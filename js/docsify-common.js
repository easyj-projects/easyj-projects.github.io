const communityName = 'easyj-projects'; // 项目组名
const communityHomePageProjectName = communityName + '.github.io'; // 当前官网项目名
const branchName = 'docsify'; // 项目分支名

// DocSify初始化
window.$docsify = {
	name: 'EasyJ开源社区',
	repo: 'https://github.com/' + communityName,

	// 封面
	coverpage: false,

	// 侧边导航栏
	loadSidebar: true,
	subMaxLevel: 2,

	// 插件：全文检索
	search: {
		paths: 'auto',
		placeholder: '搜索',
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
			'https://github.com/' + communityName + '/' + communityHomePageProjectName + '/blob/' + branchName + location.pathname,
			null,
			function () {
				return '内容有问题？立即提交修改！'
			}
		)
	]
}


document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js"></script>'); // 插件：全文检索
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/zoom-image.min.js"></script>'); // 插件：图片绽放
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify-copy-code/dist/docsify-copy-code.min.js"></script>'); // 插件：代码复制
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify-count/dist/countable.min.js"></script>'); // 插件：字数统计
document.writeln('<script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-java.min.js"></script>'); // 插件：Java语法高亮
document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify-pagination/dist/docsify-pagination.min.js"></script>'); // 插件：分页导航
// 插件：评论系统 GITalk
document.writeln('<script src="//cdn.jsdelivr.net/npm/gitalk/dist/gitalk.min.js"></script>');
document.writeln('<script src="/js/gitalk-config.js"></script>'); // gitalk配置
//document.writeln('<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/gitalk.min.js"></script>');
document.writeln('<script src="/js/docsify-plugins-gitalk.js"></script>'); // 重写过上面的文件
