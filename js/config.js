// 当前项目名称
let projectName = 'easyj-projects.github.io';

// 生成可用的pathname，避免部分插件运行异常
let pathName = location.pathname;
if (pathName.endsWith("/index.html")) {
	location.href = pathName.substring(0, pathName.length - "/index.html".length);
}
if (pathName.startsWith("/" + projectName)) {
	pathName = pathName.substring(("/" + projectName).length);
}
pathName = pathName || "/";
if (pathName[pathName.length - 1] !== "/") {
	pathName += "/";
}

// 站点配置
window.config = {
	communityName: 'easyj-projects', // 社区名称/项目组名称
	projectName: projectName, // 项目名
	branchName: 'docsify', // 项目分支名
	pathName: pathName
};
// 生成 config.jsRootPath 的值
{
	let scripts = document.getElementsByTagName("script");
	let currentScriptSrc = scripts[scripts.length - 1].getAttribute("src");
	config.jsRootPath = currentScriptSrc.substring(0, currentScriptSrc.indexOf("config.js"));
}
// 打印配置值
console.info(config);


// 插件：Gitalk（评论系统）配置
window.gitalkConfig = {
	clientID: '21bffd940d486618132b',
	clientSecret: '5b51c3a75de223a4ce17664320d8243689b3da9f',
	repo: config.projectName,
	owner: config.communityName,
	admin: ['wangliang181230']
};
// 创建gitalk实例
//window.gitalk = new Gitalk(window.gitalkConfig); // 因为在重写的 `docsify-plugins-gitalk.js` 文件中有创建对象，所以这里无需创建对象

// 百度统计
document.writeln('<script src="' + config.jsRootPath + 'baidu-statistics.js"></script>'); // 重写过上面的文件：修复多目录情况下，搜索结果为另一个目录时，链接有误导致404的问题