// 站点配置
window.config = {
	communityName: 'easyj-projects', // 社区名称/项目组名称
	projectName: 'easyj-projects.github.io', // 项目名
	branchName: 'docsify', // 项目分支名
	basePath: (location.pathname.startsWith("/easyj-projects.github.io") ? "/easyj-projects.github.io" : "/")
};
// 生成 config.srcRootPath 的值
{
	let scripts = document.getElementsByTagName("script");
	let currentScriptSrc = scripts[scripts.length - 1].getAttribute("src");
	config.srcRootPath = currentScriptSrc.substring(0, currentScriptSrc.indexOf("config.js"));
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
