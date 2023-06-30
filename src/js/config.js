(function (w, d, l) {
	// 环境名：不同 location.hostname 对应不同的环境名
	const env = getEnv();

	// 项目名配置
	const projectName = 'easyj-projects.github.io';

	// 站点配置
	const c = {
		debug: true/*(env !== 'github')*/, // 非github环境，全部默认启用debug
		env: env, // 环境名：local、gitee、github
		vcsRoot: 'https://github.com/', // 代码仓库根地址
		communityName: 'easyj-projects', // 社区名称/项目组名称
		projectName: projectName, // 项目名
		branchName: 'docsify', // 项目分支名
		pathName: getPathName(), // 自动生成 pathName，代替 location.pathname 使用，避免部分插件在 'pathname' 存在 '二级目录' 或 'index.html' 时执行失败
		jsRootPath: getJsRootPath() // 自动生成 jsRootPath
	};
	w.config = c;


	// 根据环境名，加载环境配置（以下配置请进入 https://github.com/settings/developers 添加）
	//d.writeln('<script src="' + c.jsRootPath + 'config-' + env + '.min.js"></script>');
	// 目前不一样的内容比较少，直接switch处理，当内容多起来后，分文件保存配置
	switch (env) {
		case 'local':
			break;
		case 'gitee':
			c.vcsRoot = 'https://gitee.com/';
			break;
		default:
			break;
	}


	// 打印配置值日志
	c.debug && console.info("window.config: " + JSON.stringify(c));


	//region 自动生成部分配置的方法

	function getEnv() {
		if (l.hostname === 'localhost' || l.hostname === '127.0.0.1') {
			return 'local';
		} else if (l.host === 'easyj-projects.gitee.io') {
			return 'gitee';
		} else {
			return 'github';
		}
	}

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
