// elements
const tools = document.getElementById("tools"); // 工具栏

const input = document.getElementById("pid"); // PID输入框
const enter = document.getElementById("enter"); // 确定
const count = document.getElementById("count"); // 图片数
const loading = document.getElementById("loading"); // loading效果

const auto = document.getElementById("auto"); // 自动
const save = document.getElementById("save"); // 收藏
const remove = document.getElementById("remove"); // 删除
const last = document.getElementById("last"); // 最后：加载最后一张收藏
const prev = document.getElementById("prev"); // 上一张
const next = document.getElementById("next"); // 下一张

const imgs = document.getElementById("imgs"); // 图片列表


// 窗口宽度
const windowWidth = window.innerWidth - 10 < 200 ? 200 : window.innerWidth - 10;
console.log("windowWidth:", windowWidth);


// 一些数据
let curPid = 0;
let inFocus = false; // 输入框是否获取到了焦点


// 绑定事件
{
	// PID输入框：监听回车键
	input.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			enter.click();
		}
	});
	// PID输入框：监听获取焦点
	input.addEventListener('focus', function () {
		inFocus = true;
		clearPid();
	});
	// PID输入框：监听失去焦点
	input.addEventListener('blur', function () {
		inFocus = false;
		clearPid();
	});

	// “确定” 按钮点击事件
	enter.addEventListener("click", () => {
		doEnter();
		isInSavePidList();
	});

	// “自动” 按钮点击事件
	auto.addEventListener("click", function () {
		if (auto.value === '自动') {
			auto.value = '手动';
		} else {
			auto.value = '自动';
			if (loading.style.display === 'none') {
				doNext();
			}
		}
	});

	// “收藏” 按钮点击事件
	save.addEventListener("click", function () {
		const pid = input.value - 0;
		if (pid > 0) {
			input.style.backgroundColor = '#f1e0b8';

			const savePidList = getSavePidList();
			for (let i = 0; i < savePidList.length; i++) {
				if (pid === savePidList[i]) {
					return;
				}
			}

			savePidList.push(pid);
			savePidList.sort();
			localStorage.setItem("savePidList", JSON.stringify(savePidList));
		}
	});
	// “删除” 按钮点击事件
	remove.addEventListener("click", function () {
		const pid = input.value - 0;
		if (pid > 0) {
			const savePidList = getSavePidList();
			let index;
			while ((index = savePidList.indexOf(pid)) !== -1) {
				savePidList.splice(index, 1);
				input.style.backgroundColor = '';
			}
			localStorage.setItem("savePidList", JSON.stringify(savePidList));
		}
	});
	// “最后” 按钮点击事件
	last.addEventListener("click", function () {
		const savePidList = getSavePidList();
		if (savePidList.length > 0) {
			const lastSavePid = savePidList[savePidList.length - 1];
			input.value = lastSavePid;
			input.style.backgroundColor = '#f1e0b8';
			doEnter(lastSavePid, false);
		}
	});

	// “上一张” 按钮点击事件
	prev.addEventListener("click", doPrev);

	// “下一张” 按钮点击事件
	next.addEventListener("click", doNext);

	// 监听全局键盘：F2、左键、右键
	window.addEventListener('keyup', function (e) {
		if (inFocus) {
			return;
		}

		// 按F2获取输入框焦点
		if (e.key === 'F2') {
			input.focus();
			return;
		}

		// 监听左右键
		clearPid();
		if (input.value === '') {
			return;
		}
		if (e.key === 'ArrowLeft') {
			doPrev();
		}
		if (e.key === 'ArrowRight') {
			doNext();
		}
	});
}


// 初始化
if (isMobileBrowser()) {
	document.body.classList.add("mobile");
	tools.style.width = windowWidth + "px";
}
setTimeout(function () {
	let needSavePid = true;
	if (location.hash && location.hash.substring(1) - 0 > 0) {
		input.value = location.hash.substring(1) - 0; // 优先hash
		needSavePid = false;
	} else if (localStorage.getItem('pid')) {
		input.value = localStorage.getItem('pid'); // 其次 localStorage
	} else {
		input.value = '';
	}

	const pid = clearPid();
	if (pid) {
		doEnter(pid, needSavePid);
	} else {
		input.value = '116000000'; // 一个不错的PID起始值，值太小图不好看
	}
	input.focus(); // 自动获取焦点

	isInSavePidList();
}, 500);


// 方法

function clearPid () {
	if (input.value !== '') {
		return input.value = input.value.replace(/[^0-9]/g, '');
	}
	return '';
}

function showImg (img) {
	img.title = `${img.id}  ${img.naturalWidth}✖️${img.naturalHeight}`;
	img.classList.remove("hidden");
	if (400 / img.naturalHeight * img.naturalWidth > windowWidth) {
		// 宽度超过页面时，缩小显示
		img.style.width = windowWidth + "px";
		img.style.height = (windowWidth / img.naturalWidth * img.naturalHeight) + "px";
	} else {
		img.style.width = (400 / img.naturalHeight * img.naturalWidth) + "px";
		img.style.height = "400px";
	}
}

function stopImgInterval (img) {
	if (img.interval) {
		clearInterval(img.interval);
		img.interval = null;
	}
}

function createImage (pid, n) {
	if (pid !== curPid) {
		return;
	}

	let start = new Date();

	// 创建img标签
	const img = document.createElement("img");
	img.id = `${pid}-${n}`;
	img.title = img.id;
	img.alt = img.id;
	if (n > 1) {
		img.src = `https://pixiv.nl/${pid}-${n}.jpg`;
	} else {
		img.src = `https://pixiv.nl/${pid}.jpg`;
	}
	if (n === 1 || auto.value !== '自动') {
		img.style.width = windowWidth + "px";
		img.style.height = "400px";
	} else {
		img.style.width = "0px";
		img.style.height = "0px";
		img.classList.add("hidden");
	}
	img.style.cursor = 'pointer';
	img.style.display = 'block';
	// 绑定图片点击事件
	img.onclick = function () {
		window.open(img.src);
	};
	// 绑定图片加载完成事件
	img.onload = function () {
		scrollToBottom();

		img.onerror = null; // 图片加载成功，将onerror事件移除
		stopImgInterval(img);

		if (pid !== curPid) {
			return;
		}

		showImg(img);

		count.innerHTML = n;

		const cost = new Date() - start;
		if (auto.value === '自动' && cost < 1000) {
			setTimeout(function () {
				createImage(pid, n + 1);
			}, 500);
		} else {
			createImage(pid, n + 1);
		}
	};
	// 绑定图片加载失败事件
	img.onerror = function (e) {
		scrollToBottom();

		img.onerror = null; // 触发一次error事件，就清除
		stopImgInterval(img);

		if (pid !== curPid) {
			return;
		}

		loading.style.display = 'none';

		if (n > 1) {
			imgs.removeChild(img);
		} else {
			imgs.innerHTML = '<h1>404 Not Found</h1><span>这个作品可能已被删除，或无法取得。</span>';
		}

		const time = n > 1 ? 1200 : 600;
		setTimeout(function () {
			if (auto.value === '自动' && pid === curPid) {
				doNext();
			}
		}, time);
	};

	img.interval = setInterval(function () {
		if (img.naturalWidth > 0) {
			img.onerror = null;
			stopImgInterval(img);
			img.title = `${img.id}  ${img.naturalWidth}✖️${img.naturalHeight}`;
			showImg(img);
			scrollToBottom();
		}
	}, 10);

	imgs.appendChild(img);

	scrollToBottom();
}

function doEnter (pid, needSavePid) {
	pid = pid || clearPid();

	if (pid === '') {
		return;
	}

	// 初始化
	curPid = 0;
	count.innerHTML = "0"; // 重置图片数

	// 清除timeout事件
	clearTimeout(window.timeout);

	// 清空图片
	imgs.childNodes.forEach(function (img) {
		if (img && img.src) {
			stopImgInterval(img);
			img.onclick = null;
			img.onload = null;
			img.onerror = null;
			img.src = '';
			img.style.height = 'auto';
			img.style.width = windowWidth + "px";
		}
	});
	if (imgs.innerHTML && !imgs.innerHTML.includes("<img ")) {
		imgs.innerHTML = '';
	}

	// 延迟图片的加载
	window.timeout = setTimeout(function () {
		if (curPid > 0 && pid !== curPid) return;

		if (pid > 999999999) {
			imgs.innerHTML = 'PID不能超过9位';
			return;
		} else if (pid < 10) {
			imgs.innerHTML = 'PID不能小于10';
			return;
		}

		// 保存pid
		curPid = pid;
		if (needSavePid !== false) {
			localStorage.setItem('pid', pid);
		}

		imgs.innerHTML = ''; // 清空图片
		loading.style.display = 'inline-block'; // 显示loading

		createImage(pid, 1);
	}, 400);
}

function doPrev () {
	const pid = input.value - 0;
	if (pid <= 0) {
		input.focus();
		return;
	}

	const savePidList = getSavePidList();
	if (savePidList.length > 0) {
		let i = 0;
		for (; i < savePidList.length; i++) {
			const savePid = savePidList[i];
			if (savePid >= pid) {
				if (i === 0) {
					input.value = pid - 1;
					input.style.backgroundColor = '';
				} else {
					input.value = savePidList[i - 1];
					input.style.backgroundColor = '#f1e0b8';
				}
				break;
			}
		}
		if (i === savePidList.length) {
			input.value = savePidList[i - 1];
			input.style.backgroundColor = '#f1e0b8';
		}
	} else {
		input.value = pid - 1;
		input.style.backgroundColor = '';
	}
	doEnter();
}

function doNext () {
	const pid = input.value - 0;
	if (pid <= 0) {
		input.focus();
		return;
	}

	const savePidList = getSavePidList();
	if (savePidList.length > 0) {
		let i = savePidList.length - 1;
		for (; i >= 0; i--) {
			const savePid = savePidList[i];
			if (savePid <= pid) {
				if (i === savePidList.length - 1) {
					input.value = pid + 1;
					input.style.backgroundColor = '';
				} else {
					input.value = savePidList[i + 1];
					input.style.backgroundColor = '#f1e0b8';
				}
				break;
			}
		}
		if (i === -1) {
			input.value = savePidList[i + 1];
			input.style.backgroundColor = '#f1e0b8';
		}
	} else {
		input.value = pid + 1;
		input.style.backgroundColor = '';
	}
	doEnter();
}

function isMobileBrowser () {
	return windowWidth < 500 || /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function scrollToBottom () {
	if (auto.value === '自动') {
		setTimeout(function () {
			window.scrollTo(0, document.body.scrollHeight);
		}, 10);
	}
}

function getSavePidList () {
	return JSON.parse(localStorage.getItem("savePidList") || "[]");
}

function isInSavePidList () {
	const pid = input.value - 0;
	if (pid > 0) {
		const savePidList = getSavePidList();
		for (let i = 0; i < savePidList.length; i++) {
			if (pid === savePidList[i]) {
				input.style.backgroundColor = '#f1e0b8';
				return;
			}
		}
	}
	input.style.backgroundColor = '';
}