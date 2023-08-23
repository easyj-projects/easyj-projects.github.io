(function (l) {
	let changeHostInterval = null;

	function checkPage() {
		if (l.hash.startsWith("#/native-image/")) {
			if (changeHostInterval) {
				clearInterval(changeHostInterval);
				changeHostInterval = null;
			}
			alert("GraalVM Native Image相关文章已经迁移到王良的技术博客中，即将跳转。");
			l.href = "https://wangliang1024.cn/blog/" + l.hash;
		}
	}

	changeHostInterval = setInterval(checkPage, 100);
})(location);
