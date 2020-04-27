/*
 * @Author: Liliang Zhu 
 * @Date: 2020-04-24 16:22:05 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-04-26 10:11:52
 * 记录用户行为
 */
import BrowserMatch from './browser-info';

$(() => {
	const browserInfo = new BrowserMatch();

	// 用户信息，当前页面地址
	const userNavi = window.navigator;
	const userScreen = window.screen;
	let userInfo = {
		language: userNavi.language,
		resolution: userScreen.width + '*' + userScreen.height,
		browser: browserInfo.browser,
		version: browserInfo.version,
		os: browserInfo.OS,
	};

	const curPageUrl = window.location.href;

	window.navigator.language
	// 进去时间
	const enterTime = new Date();
	let enterMillisecond = enterTime.getTime();
	// 离开时间，页面保持时长
	let endTime, stayTime;

	// 判断浏览器切出状态
	let hidden, visibilityChange;

	if (typeof document.hidden !== "undefined") {
		hidden = "hidden";
		visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") {
		hidden = "mozHidden";
		visibilityChange = "mozvisibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
	}

	// 计时器， 隐藏时长， 隐藏总时长
	let hideTimer,
		hideTime = 0,
		hideAllTime = 0;
	// 添加监听方法
	function userCheckPage() {
		console.log("当前页面是否被隐藏：" + document[hidden]);
		if (document[hidden]) {
			hideTimer = setInterval(() => {
				hideTime++;
				if (hideTime > 300) {
					clearInterval(hideTimer);
					window.removeEventListener('beforeunload', ajaxUserAction);
					document.removeEventListener(visibilityChange, userCheckPage)
				}
			}, 1000)
		} else {
			// 切出再切进后重置隐藏时间，并且延后进入的时间
			enterMillisecond += hideTime * 1000;
			hideAllTime += hideTime;
			hideTime = 0;
			clearInterval(hideTimer);
		}
	}
	// 页面监听
	document.addEventListener(visibilityChange, userCheckPage);

	// 关闭或刷新浏览器
	function ajaxUserAction(e) {
		let event = e || window.event;
		// 获取当前关闭时间
		endTime = new Date();
		const endMillisecond = endTime.getTime();
		// 计算停留时长
		stayTime = Math.floor((endMillisecond - enterMillisecond) / 1000) - hideAllTime;

		console.log(userInfo, `所在页面${curPageUrl}，隐藏时长${hideAllTime}，停留时长${stayTime}s`);

		event.returnValue = `确定离开？`;
	}
	// 监听事件
	window.addEventListener("beforeunload", ajaxUserAction);
});