// 以下代码从 `https://cdn.jsdelivr.net/npm/docsify@4.12.1/lib/plugins/gitalk.js` 复制过来
// 并嵌入了gitalk.id的自定义自动生成规则
(function () {
	/* eslint-disable no-unused-vars */
	function install(hook) {
		var dom = Docsify.dom;

		hook.mounted(function (_) {
			var div = dom.create('div');
			div.id = 'gitalk-container';
			var main = dom.getNode('#main');
			div.style = "width: " + (main.clientWidth) + "px; margin: 0 auto 20px;";
			dom.appendTo(dom.find('.content'), div);
		});

		hook.doneEach(function (_) {
			var el = document.getElementById('gitalk-container');
			while (el.hasChildNodes()) {
				el.removeChild(el.firstChild);
			}

			//region @Override: 自定义规则动态生成ID
			window.gitalkConfig.id = generateGitalkId();
			console.info('gitalk.id = "' + window.gitalkConfig.id + '";');
			window.gitalk = new Gitalk(window.gitalkConfig);
			//endregion

			// eslint-disable-next-line
			gitalk.render('gitalk-container');
		});
	}

	$docsify.plugins = [].concat(install, $docsify.plugins);
}());


// 动态生成gitalk的id，修复如下问题：
// 1. 选中md中的子菜单时，刷新页面，会导致加载issue数据失败
// 2. 当菜单的md文件存在`../`时，加载不到实际的issue的
function generateGitalkId() {
	let pathname = location.pathname;
	let search = location.search;
	let hashPre = '';
	let hash = location.hash;

	if (hash) {
		// 特殊处理：问题反馈页面固定id值
		if (hash.indexOf('/feedback') !== -1) {
			return '/#/feedback';
		}


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
		while (hash.indexOf('.') === 0) {
			if (hash.indexOf('./') === 0) {
				hash = hash.substring('./'.length);
			} else if (hash.indexOf('../') === 0 && pathname.indexOf('/') !== pathname.lastIndexOf('/')) {
				hash = hash.substring('../'.length);
				if (pathname.lastIndexOf('/') === pathname.length - 1) {
					pathname = pathname.substring(0, pathname.length - 1);
				}
				pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);
			} else {
				if (hash.indexOf('/./') >= 0) {
					hash = hash.replaceAll('/./', '/');
				}
				break;
			}
		}
	}

	return pathname + search + hashPre + hash;
}