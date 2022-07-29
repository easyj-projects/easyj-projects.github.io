//以下代码从 `https://cdn.jsdelivr.net/npm/docsify@4.12.1/lib/plugins/gitalk.js` 复制过来的：自定义规则动态生成ID
(function (w) {
	const c = w.config;

	/* eslint-disable no-unused-vars */
	function install(hook) {
		let dom = Docsify.dom;

		hook.mounted(function (_) {
			let div = dom.create('div');
			div.id = 'gitalk-container';
			let main = dom.getNode('#main');
			div.style = "width: " + (main.clientWidth) + "px; margin: 0 auto 20px;";
			dom.appendTo(dom.find('.content'), div);
		});

		hook.doneEach(function (_) {
			let el = document.getElementById('gitalk-container');
			while (el.hasChildNodes()) {
				el.removeChild(el.firstChild);
			}

			//region @Override：自定义规则动态生成ID
			c.gitalkConfig.id = generateGitalkId();
			c.debug && console.info('window.gitalkConfig: ' + JSON.stringify(c.gitalkConfig));
			w.gitalk = new Gitalk(c.gitalkConfig);
			//endregion

			// eslint-disable-next-line
			gitalk.render('gitalk-container');
		});
	}

	$docsify.plugins = [].concat(install, $docsify.plugins);


	/**
	 * 动态生成gitalk的id
	 * 修复如下问题：
	 * 1. 选中md中的子菜单时，刷新页面，会导致加载issue数据失败
	 * 2. 当菜单的md文件路径存在`../`或`./`时，因为label不正确，导致加载不到对应的issue
	 *
	 * @returns string 返回gitalk的ID
	 */
	function generateGitalkId() {
		let pathName = c.pathName;
		//let search = location.search; // 不拼接search，因为当前站点没有用到search参数
		let hashPre = '';
		let hash = location.hash;

		if (hash) {
			// 忽略hash后面的参数，解决问题1
			if (hash.indexOf('?') >= 0) {
				hash = hash.substring(0, hash.indexOf('?'));
			}

			// 当hash中存在'./'时，移除掉它
			// 当hash中存在'../'时，与pathname中的目录抵消掉
			if (hash.startsWith('#/')) {
				hashPre = '#/';
				hash = hash.substring(hashPre.length);
			}
			while (hash.startsWith('.')) {
				if (hash.startsWith('./')) {
					hash = hash.substring('./'.length);
				} else if (hash.startsWith('../') && pathName.indexOf('/') !== pathName.lastIndexOf('/')) {
					hash = hash.substring('../'.length);
					if (pathName.lastIndexOf('/') === pathName.length - 1) {
						pathName = pathName.substring(0, pathName.length - 1);
					}
					pathName = pathName.substring(0, pathName.lastIndexOf('/') + 1);
				} else {
					if (hash.indexOf('/./') >= 0) {
						hash = hash.replaceAll('/./', '/');
					}
					break;
				}
			}
		}

		return pathName + hashPre + hash;
	}
}(window));
