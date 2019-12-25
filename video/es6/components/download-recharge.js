/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-22 10:38:15 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-25 15:48:20
 * 软件下载与充值弹框功能
 */

// 下载与充值接口
import {
	VIP_APIS
} from '../api';
// 引入生成二维码脚本
import QRcode from 'qrcode';

import {
	alertBox,
	confirmBox,
	toggleActive
} from '../util';

let rechargeHtml = `
    <div id="recharge-frame">
        <div class="recharge-box">
            <span class="close-rechagre">X</span>
            <h1>{ tips }</h1>
            <div class="recharge-type-check">
                <span class="active">VIP</span>
                <span>积分</span>
            </div>
            <div>
                <ul class="recharge-items vip clearfix active">
                    {vlis}
                </ul>
                <ul class="recharge-items point clearfix">
                    {plis}
                </ul>
            </div>
            <p class="recharge-title">优惠券 <i>优惠券仅限支付宝、微信支付使用</i> </p>
            <div class="recharge-coupon-box">
                <p><span class="coupon-choose"><em>暂无优惠券</em></span></p>
                <div class="recharge-coupon-wrap">
                <div class="coupon-wrap">
                    <ul class="clearfix" id="coupons">
                        { coupons }
                    </ul>
                </div>
                <div class="coupon-btns">
                    <div class="coupon-btn prev disabled"><i class="icon-arrow"></i></div>
                    <div class="coupon-btn next disabled"><i class="icon-arrow"></i></div>
                </div>
            </div>
            </div>
            <div class="recharge-ewm">
                <p class="should-pay">应支付： <em>158</em> 元</p>
                <div class="ewm-box">
                    <div class="ewm" id="download-ali-pay">
                        <img src="/assets/images/vip/loadcode.gif" class="loadimg">
                    </div>
                    <p><i class="icon-alipay"></i>支付宝支付</p>
                </div>
                <div class="ewm-box">
                    <div class="paypal">
                        <img src="/assets/images/vip/paypal.png" width="150">
                        <p>( $<em>98</em> )</p>
                    </div>
                    <p><i class="icon-paypal"><em class="path1"></em><em class="path2"></em><em class="path3"></em></i>paypal支付</p>
                </div>
                <div class="ewm-box">
                    <div class="ewm" id="download-wx-pay">
                        <img src="/assets/images/vip/loadcode.gif" class="loadimg">
                    </div>
                    <p><i class="icon-wxpay"></i>微信支付</p>
                </div>
            </div>
            <div class="recharge-user">
                <ul>
                </ul>
            </div>
        </div>
    </div>`;

let loadimgImg = '<div class="down-loading" id="down-loading"><div class="load-war"><p><em>下</em><em>载</em><em>打</em><em>包</em><em>中</em><em>。</em><em>。</em><em>。</em></p><div class="load-base"><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div></div></div></div>';

class Download {
	constructor(id, model) {
		this.soft_id = id;
		this.model_id = model;
		this.init()
	}

	init() {
		this.downloading(1);
		this.downloadAjax(0)
	}

	downloadAjax(status) {
		let _this = this;
		this.defaultData = {};

		$.ajax({
				url: VIP_APIS.download,
				type: 'POST',
				data: {
					res_id: _this.soft_id,
					model_id: _this.model_id,
					point_status: status
				},
			})
			.done(function (res) {
				if (res.code == 200) {
					window.location.href = res.url;
				} else {
					switch (res.code) {
						case 501:
							$('#login-in').trigger('click');
							break;
						case 10002:
							_this.tipsText = res.msg;
							_this.getRechargeData(res);
							break;
						case 10009:
							confirmBox(res.msg, function () {
								_this.downloadAjax(1);
							});
							break;
						default:
							alertBox(res.msg);
							break;
					}
				}
				_this.downloading();
			})
			.fail(function (error) {
				console.log(error);
			})
	}

	downloading(flag) {
		if ($('#down-loading').length) {
			flag ? $('#down-loading').show() : $('#down-loading').hide();
		} else {
			flag && $('main').append(loadimgImg);
		}
	}

	getRechargeData(data) {
		this.vipData = data.package_info;
		this.couponData = data.coupon_info;

		let defaultVipdata = this.vipData.filter(function (v) {
			return v.point_type != 1;
		});
		this.defaultData.id = defaultVipdata[0].id;
		this.defaultData.coupon_relation_id = 0;
		this.defaultData.should_pay = defaultVipdata[0].point_money;
		this.defaultData.should_pay_us = defaultVipdata[0].usd_price;
		this.defaultData.couponLen = 0;
		this.initRechargeBox();
		this.getUsers();
	}

	getUsers() {
		let _this = this;
		$.ajax({
				url: VIP_APIS.member_history,
				type: 'POST',
			})
			.done(function (res) {
				if (res.code == 200) {
					let userHtml = '';
					$.each(res.data, function (index, el) {
						userHtml += `<li><p>用户 ${el.username} ${el.contact_name} <em> 刚刚</em></p></li>`
					});
					$('.recharge-user').find('ul').append(userHtml);
					_this.initScroll();
				}
			})
	}

	initScroll() {
		const $wrap = $('.recharge-user');
		const $ul = $wrap.find('ul');
		const $lis = $ul.children('li');
		const warpWidth = $lis.width() + 30;

		$ul.animate({
			left: -warpWidth
		}, 6000, 'linear', function () {
			$ul.css('left', 0);
			$ul.append($ul.children('li').first())
		})
		this.scrollInterval = setInterval(() => {
			$ul.animate({
				left: -warpWidth
			}, 6000, 'linear', function () {
				$ul.css('left', 0);
				$ul.append($ul.children('li').first())
			})
		}, 6000);
	}

	initRechargeBox() {
		this.isPayOk();
		if ($('#recharge-frame').length) {
			$('#recharge-frame').show();
			return;
		};

		let html = rechargeHtml
			.replace('{vlis}', this.formatVipData().vip)
			.replace('{plis}', this.formatVipData().point)
			.replace('{ tips }', this.tipsText)
			.replace('{ coupons }', this.formatCouponData());
		$('main').append(html);

		this.rechargeDom = $('#recharge-frame');
		this.initStatus();
		this.initEvent();
		this.checkIndex = 0;

	}

	initEvent() {
		this.rechargeDom
			.on('click', '.recharge-items li', this.checkRecharge.bind(this))
			.on('click', '#coupons li', this.checkCoupon.bind(this))
			.on('click', '.coupon-btn', this.couponArr.bind(this))
			.on('click', '.paypal img', this.paypalAjax.bind(this))
			.on('click', '.recharge-type-check span', this.checkType.bind(this))
			.on('click', '.coupon-choose', this.showCouponBox.bind(this))
			.on('mouseenter', '.recharge-user', () => {
				clearInterval(this.scrollInterval);
			})
			.on('mouseleave', '.recharge-user', () => {
				this.initScroll();
			})
			.on('click', '.close-rechagre', () => {
				this.rechargeDom.hide();
				clearInterval(this.isPayOkFlag);
				clearInterval(this.scrollInterval);
			})
	}

	showCouponBox() {
		if (this.defaultData.couponLen) {
			$('.recharge-coupon-box').toggleClass('active');
		}
	}

	checkType(e) {
		if ($(e.target).hasClass('active')) return;

		let $ul;
		if ($(e.target).index()) {
			$ul = this.rechargeDom.find('.recharge-items.point');
		} else {
			$ul = this.rechargeDom.find('.recharge-items.vip');
		}
		toggleActive([$(e.target), $ul]);

		$ul.children('li').first().trigger('click');
	}

	checkRecharge(e) {
		const target = $(e.target).closest('li');

		if (target.hasClass('active')) return;

		this.defaultData.id = target.data('id');
		this.defaultData.coupon_relation_id = 0;
		this.defaultData.coupon_price = 0;
		this.loadingImg = '/assets/images/vip/loadcode.gif';
		this.initStatus();
	}

	couponArr(e) {
		const target = $(e.target).closest('.coupon-btn');

		if (!target.hasClass('disabled')) {
			if (target.is('.prev')) {
				if (this.checkIndex < 2) {
					target.closest('.prev').addClass('disabled');
				};
				this.checkIndex--;
				this.rechargeDom.find('#coupons').css({
					marginLeft: -this.checkIndex * 280 + 'px'
				});
				target.closest('.prev').next('.next').removeClass('disabled');
			} else {
				if (this.checkIndex > this.defaultData.couponLen - 4) {
					target.closest('.next').addClass('disabled');
				};
				this.checkIndex++;
				this.rechargeDom.find('#coupons').css({
					marginLeft: -this.checkIndex * 280 + 'px'
				});
				target.closest('.next').prev('.prev').removeClass('disabled');
			}
		}
	}

	checkCoupon(e) {
		const $target = $(e.target).closest('li'),
			_price = $target.data('price'),
			_id = $target.data('id');

		if ($target.hasClass('active')) {
			this.defaultData.coupon_relation_id = 0;
			this.defaultData.should_pay += _price;
			this.defaultData.coupon_price = 0;
			$target.removeClass('active');
		} else {
			this.defaultData.coupon_relation_id = _id;
			this.defaultData.should_pay -= _price;
			this.defaultData.coupon_price = _price;

			if ($target.siblings('.active').length) {
				this.defaultData.should_pay += $target.siblings('.active').data('price');
			};
			$target.addClass('active').siblings().removeClass('active');
		};

		this.callPay();
	}

	formatCouponData() {
		var html = '';

		this.defaultData.couponLen = 0;

		$.each(this.couponData, (i, v) => {
			if (this.defaultData.should_pay >= v.min_consume / 1) {
				html += `
                <li class="${v.coupon_point/1 == 10? 'ten': v.coupon_point/1 == 20? 'twenty': 'five'}" data-id="${v.id}" data-price="${v.coupon_point/1}">
                    <span class="use">使用中</span>
                    <div class="fl price">￥ <em>${v.coupon_point/1}</em></div>
                    <div class="time-price">
                        <p>满${v.min_consume/1}可用</p>
                        <span>${v.end_time}到期</span>
                    </div>
                </li>`;
				this.defaultData.couponLen++;
			}

		})

		if (html === '') {
			html = '<div class="no-coupon">暂无优惠券</div>';
		}

		return html;
	}

	formatVipData() {
		var data = {
			vip: '',
			point: '',
		};
		$.each(this.vipData, (i, v) => {
			if (v.point_type == 1) {
				data.point += `<li data-price="${ v.point_money }" data-usp="${ v.usd_price }" data-id="${ v.id }">
                    <span class="type">积分充值</span>
                    <p><em>${ v.point_num }</em> 积分
                        <span>${ v.point_money }元</span>
                    </p>
                </li>`;
			} else {
				data.vip += `<li data-price="${ v.point_money }" data-usp="${ v.usd_price }" data-id="${ v.id }">
                    <span class="type">${ v.point_name }</span>
                    <p><em>${ v.day_money }</em> 元/天
                        <span>${ v.point_money } 元/${ v.point_name.replace('会员套餐', '') }</span>
                    </p>
                </li>`
			}
		})
		return data;
	}

	initStatus() {
		// 初始化切换套餐或优惠券后状态
		this.rechargeDom.find('.recharge-items').children('li').each((i, v) => {
			$(v).removeClass('active');
			if ($(v).data('id') == this.defaultData.id) {
				$(v).addClass('active');
				this.defaultData.should_pay = $(v).data('price');
				this.defaultData.should_pay_us = $(v).data('usp');
			}
		})

		this.rechargeDom.find('#coupons').empty().append(this.formatCouponData()).width(280 * this.defaultData.couponLen);
		this.checkIndex = 0;
		this.rechargeDom.find('#coupons').css('marginLeft', 0);
		this.rechargeDom.find('.coupon-btn.prev').addClass('disabled');
		if (this.defaultData.couponLen > 2) {
			this.rechargeDom.find('.coupon-btn.next').removeClass('disabled');
		} else {
			this.rechargeDom.find('.coupon-btn.next').addClass('disabled');
		}
		this.defaultData.couponLen && (this.rechargeDom.find('.coupon-choose em').text(this.defaultData.couponLen + '张可用'));

		this.callPay();
	}

	callPay() {
		this.rechargeDom.find('.should-pay em').text(this.defaultData.should_pay);
		this.rechargeDom.find('.paypal p em').text(this.defaultData.should_pay_us);
		this.rechargeDom.find('.recharge-coupon-box').removeClass('active');
		if (this.defaultData.coupon_price) {
			this.rechargeDom.find('.coupon-choose em').text(this.defaultData.coupon_price + '元优惠券')
		} else {
			this.rechargeDom.find('.coupon-choose em').text(this.defaultData.couponLen + '张可用')
		}


		const {
			id,
			coupon_relation_id
		} = this.defaultData;

		this.payAjax({
			id,
			coupon_relation_id
		});
	}

	paypalAjax() {
		let _this = this,
			{
				id
			} = this.defaultData;
		_this.paypalLoding();
		$.ajax({
				url: VIP_APIS.paypal,
				type: 'POST',
				data: {
					package_id: id
				},
			})
			.done(function (res) {
				if (res.code == 200) {
					window.location.href = res.url;
				} else {
					alertBox(res.msg)
				}
			})
			.always(function () {
				_this.paypalLoding(1);
			});
	}

	paypalLoding(flag) {
		let loadingHtml = `<div class="loading-mask" id="loading-mask"><div class="loader"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" class="path"></circle></svg></div></div>`;
		if (flag && this.loading) {
			this.loading.hide();
		} else {
			$('body').append(loadingHtml);
			this.loading = $('#loading-mask');
			this.loading.show();
		}
	}

	payAjax(data) {
		for (let index = 0; index < 2; index++) {
			let dom = index ? $('#download-wx-pay').find('img') : $('#download-ali-pay').find('img');
			dom.attr('src', this.loadingImg);

			$.ajax({
				url: (index ? VIP_APIS.wx_pay : VIP_APIS.ali_pay),
				type: 'POST',
				data
			}).done((res) => {
				if (res.code == 200) {
					QRcode.toDataURL(res.msg, {
						width: 128,
						margin: 1
					}).then(url => {
						dom.attr('src', url)
					})
				} else {
					alertBox(res.msg)
				}
			})
		}
	}

	isPayOk() {
		clearInterval(this.isPayOkFlag);

		this.isPayOkFlag = setInterval(function () {
			$.ajax({
				url: VIP_APIS.pay_ok,
				type: 'GET',
				success: function (msg) {
					if (msg.code == 200) {
						confirmBox('充值成功', function () {
							window.location.reload();
						}, {
							title: '提示',
							autoClose: 'sure|5000',
							buttons: {
								cancel: {
									text: '返回首页',
									action: function () {
										window.location.href = '/';
									}
								},
								sure: {
									btnClass: 'btn-green'
								}
							}
						})
					}
					return;
				}
			});
		}, 10000);
	}
};

export default Download;