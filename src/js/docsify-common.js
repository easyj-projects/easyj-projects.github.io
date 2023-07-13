(function (w, d, l) {
	const c = w.config;
	const pathName = c.pathName;
	const jsRootPath = c.jsRootPath;


	// 部分页面特殊处理一下
	if (pathName === "/docs/") {
		setInterval(function () {
			if (l.hash === "#/discussion") {
				l.href = "../#/discussion";
			}
		}, 100);
	}

	// 生成 EditOnGithubPlugin 的url
	const editOnGithubUrl = c.vcsRoot + c.communityName + '/' + c.projectName + '/blob/' + c.branchName + pathName;
	c.debug && console.info('editOnGithubUrl = "' + editOnGithubUrl + '";');

	// DocSify初始化
	w.$docsify = {
		name: pageTitle(),
		repo: c.vcsRoot + c.communityName,

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

		// 插件：返回顶部
		scrollToTop: {
			auto: true,
			text: 'Top',
			right: 15,
			bottom: 15,
			offset: 500
		},

		// 其他插件
		plugins: [
			// 插件：在GitHub上编辑
			EditOnGithubPlugin.create(
				editOnGithubUrl,
				null,
				function () {
					return '帮助我们完善此页内容'
				}
			)
		]
	};


	// 常用插件
	d.writeln('<script src="https://wangliang1024.cn/npm/docsify/lib/plugins/zoom-image.min.js"></script>'); // 插件：图片缩放
	d.writeln('<script src="https://wangliang1024.cn/npm/docsify-copy-code/dist/docsify-copy-code.min.js"></script>'); // 插件：代码复制
	d.writeln('<script src="https://wangliang1024.cn/npm/docsify-count/dist/countable.min.js"></script>'); // 插件：字数统计
	d.writeln('<script src="https://wangliang1024.cn/npm/docsify-pagination/dist/docsify-pagination.min.js"></script>'); // 插件：分页导航
	if (!window.location.pathname.endsWith("/blog/")) { // 博客页面暂时不需要侧边栏折叠
		d.writeln('<script src="https://wangliang1024.cn/npm/docsify-sidebar-collapse/dist/docsify-sidebar-collapse.min.js"></script>'); // 插件：侧边栏折叠
	}
	d.writeln('<script src="https://wangliang1024.cn/npm/docsify-scroll-to-top/dist/docsify-scroll-to-top.min.js"></script>'); // 插件：返回顶部
	d.writeln('<script src="https://wangliang1024.cn/npm/docsify-tabs/dist/docsify-tabs.min.js"></script>'); // 插件：Tabs
	// 插件：全文检索
	d.writeln('<script src="' + jsRootPath + 'optimize/docsify-plugins-search.min.js"></script>'); // 重写过上面的文件：修复多目录情况下，搜索结果为另一个目录时，链接有误导致404的问题

	// 获取页面标题
	function pageTitle() {
		if (pathName.startsWith('/docs')) {
			return '📝EasyJ文档';
		} else if (pathName.startsWith('/blog')) {
			return '📚博客';
		} else {
			return 'EasyJ开源社区';
		}
	}
})(window, document, location);
