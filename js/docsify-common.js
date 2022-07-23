let pathname = location.pathname;
if (pathname.startsWith("/easyj-projects.github.io")) {
	pathname = pathname.substring("/easyj-projects.github.io".length);
}

// 获取页面标题
function pageTitle() {
	if (pathname.startsWith('/docs')) {
		return '📝EasyJ文档';
	} else if (pathname.startsWith('/blog')) {
		return '📚EasyJ博客';
	} else {
		return 'EasyJ开源社区';
	}
}

// '在GitHub上编辑' 功能的URL
let editOnGithubUrl = 'https://github.com/' + config.communityName + '/' + config.projectName + '/blob/' + config.branchName + pathname;
console.info('editOnGithubUrl = "' + editOnGithubUrl + '";');

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
			editOnGithubUrl,
			null,
			function (file) {
				return '内容有问题？立即提交修改！'
			}
		)
	]
}


document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/zoom-image.min.js"></script>'); // 插件：图片缩放
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify-copy-code/dist/docsify-copy-code.min.js"></script>'); // 插件：代码复制
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify-count/dist/countable.min.js"></script>'); // 插件：字数统计
document.writeln('<script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-java.min.js"></script>'); // 插件：Java语法高亮
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify-pagination/dist/docsify-pagination.min.js"></script>'); // 插件：分页导航
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify-sidebar-collapse/dist/docsify-sidebar-collapse.min.js"></script>'); // 插件：侧边栏扩展与折叠

// 插件：全文检索
//document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js"></script>');
document.writeln('<script src="' + config.srcRootPath + 'docsify-plugins-search.js"></script>'); // 重写过上面的文件：修复多目录情况下，搜索结果为另一个目录时，链接有误导致404的问题

// 插件：评论系统 GITalk
document.writeln('<script src="//cdn.jsdelivr.net/npm/gitalk/dist/gitalk.min.js"></script>');
//document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/gitalk.min.js"></script>');
document.writeln('<script src="' + config.srcRootPath + 'docsify-plugins-gitalk.js"></script>'); // 重写过上面的文件：自定义规则动态生成ID
