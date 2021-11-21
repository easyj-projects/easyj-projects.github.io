const communityName = 'easyj-projects'; // 社区名称/项目组名称
const projectName = communityName + '.github.io'; // 项目名

// 插件：评论系统配置
window.gitalkConfig = {
	clientID: '21bffd940d486618132b',
	clientSecret: '5b51c3a75de223a4ce17664320d8243689b3da9f',
	repo: projectName,
	owner: communityName,
	admin: ['wangliang181230']
};

// 创建gitalk实例
window.gitalk = new Gitalk(window.gitalkConfig);
