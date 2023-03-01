// 百度统计
if (!window.config || window.config.env !== "local") {
	(function (w, d) {
		w._hmt = w._hmt || [];
		const hm = d.createElement("script");
		hm.src = "https://hm.baidu.com/hm.js?efa7b04534aa7088ff0e2106757375b3";
		const s = d.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(hm, s);
	})(window, document);
}
