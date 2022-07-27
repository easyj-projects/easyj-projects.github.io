(function (w, d, l) {
	// 项目名配置
	const projectName = 'easyj-projects.github.io';


	// 站点配置
	const c = {
		debug: true,
		communityName: 'easyj-projects', // 社区名称/项目组名称
		projectName: projectName, // 项目名
		branchName: 'docsify', // 项目分支名
		pathName: getPathName(), // 自动生成 pathName，代替 location.pathname 使用，避免部分插件在 'pathname' 存在 '二级目录' 或 'index.html' 时执行失败
		jsRootPath: getJsRootPath() // 自动生成 jsRootPath
	};
	w.config = c;


	// 插件：Gitalk（评论系统）配置
	w.gitalkConfig = {
		clientID: '21bffd940d486618132b',
		clientSecret: '5b51c3a75de223a4ce17664320d8243689b3da9f',
		repo: projectName,
		owner: c.communityName,
		admin: ['wangliang181230']
	};


	// 打印配置值日志
	if (c.debug) {
		console.info("window.config:");
		console.info(c);
		console.info("window.gitalkConfig:");
		console.info(gitalkConfig);
	}


	//region 自动生成部分配置的方法

	function getPathName() {
		// 生成可用的pathname，避免部分插件运行异常
		let pn = l.pathname;
		if (pn.endsWith("/index.html")) {
			l.href = pn.substring(0, pn.length - "/index.html".length) || "/";
		}
		if (pn.startsWith("/" + projectName)) {
			pn = pn.substring(("/" + projectName).length);
		}
		pn = pn || "/";
		if (pn[pn.length - 1] !== "/") {
			pn += "/";
		}
		return pn;
	}

	function getJsRootPath() {
		let scripts = d.getElementsByTagName("script");
		let currentScriptSrc = scripts[scripts.length - 1].getAttribute("src");
		return currentScriptSrc.substring(0, currentScriptSrc.indexOf("config"));
	}

	//endregion
})(window, document, location);
