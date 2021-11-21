// 以下代码从 `https://cdn.jsdelivr.net/npm/docsify@4.12.1/lib/plugins/gitalk.js` 复制过来，并优化了gitalk的生成规则。
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

			// @Override: 动态生成ID
			window.gitalkConfig.id = generateGitalkId();
			console.info('gitalk.id = "' + window.gitalkConfig.id + '";');
			window.gitalk = new Gitalk(window.gitalkConfig);

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
	let id = location.pathname + location.search + location.hash;
	return id;
}
