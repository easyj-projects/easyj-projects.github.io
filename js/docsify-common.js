// 部分页面特殊处理一下
if (config.pathName === "/docs/") {
	setInterval(function () {
		if (location.hash === "#/discussion") {
			location.href = "../#/discussion";
		}
	}, 100);
}

// 获取页面标题
function pageTitle() {
	if (config.pathName.startsWith('/docs')) {
		return '📝EasyJ文档';
	} else if (config.pathName.startsWith('/blog')) {
		return '📚EasyJ博客';
	} else {
		return 'EasyJ开源社区';
	}
}

// DocSify初始化
window.$docsify = {
	name: pageTitle(),
	repo: "https://github.com/" + config.communityName,

	// 侧边导航栏
	loadSidebar: true,
	subMaxLevel: 3,
	sidebarDisplayLevel: 0,
	alias: {
		"/.*/_sidebar.md": "/_sidebar.md"
	},

	// 自动将侧边栏的导航作为标题显示
	//autoHeader: true,

	// 插件：全文检索
	search: {
		paths: 'auto',
		placeholder: '全站搜索',
		noData: '<span style="color:red">未找到任何结果</span>'
	},

	// 插件：代码复制
	copyCode: {
		buttonText: '复制',
		successText: '已复制'
	},


	// 插件：字数统计
	count: {
		language: 'chinese'
	},


	// 插件：分页导航
	pagination: {
		previousText: '上一章节',
		nextText: '下一章节',
		crossChapter: true,
		crossChapterText: true
	},

	// 其他插件
	plugins: [
		// 插件：在GitHub上编辑
		EditOnGithubPlugin.create(
			'https://github.com/' + config.communityName + '/' + config.projectName + '/blob/' + config.branchName + config.pathName,
			null,
			function (file) {
				return '内容有问题？立即提交修改！'
			}
		)
	]
};

// 常用插件
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/zoom-image.min.js"></script>'); // 插件：图片缩放
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify-copy-code/dist/docsify-copy-code.min.js"></script>'); // 插件：代码复制
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify-count/dist/countable.min.js"></script>'); // 插件：字数统计
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify-pagination/dist/docsify-pagination.min.js"></script>'); // 插件：分页导航
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify-sidebar-collapse/dist/docsify-sidebar-collapse.min.js"></script>'); // 插件：侧边栏扩展与折叠

// 插件：全文检索
//document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js"></script>');
document.writeln('<script src="' + config.jsRootPath + 'optimize/docsify-plugins-search.js"></script>'); // 重写过上面的文件：修复多目录情况下，搜索结果为另一个目录时，链接有误导致404的问题

// 插件：语法高亮
document.writeln('<script src="' + config.jsRootPath + 'optimize/prism-bash.min.js"></script>'); // bash：支持了parameter，并增加了两个操作 `java` 和 `sysctl`（提交PR已合并，将在新版本中可用：https://github.com/PrismJS/prism/pull/3505）
document.writeln('<script src="' + config.jsRootPath + 'optimize/prism-java.min.js"></script>'); // java，重写：可自定义variable匹配规则
document.writeln('<script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-yaml.min.js"></script>'); // yaml
document.writeln('<script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-properties.min.js"></script>'); // properties
document.writeln('<script src="' + config.jsRootPath + 'optimize/prism-log.js"></script>'); // log

// 插件：评论系统 GITalk
document.writeln('<script src="//cdn.jsdelivr.net/npm/gitalk/dist/gitalk.min.js"></script>');
//document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/gitalk.min.js"></script>');
document.writeln('<script src="' + config.jsRootPath + 'optimize/docsify-plugins-gitalk.js"></script>'); // 重写过上面的文件：自定义规则动态生成ID
