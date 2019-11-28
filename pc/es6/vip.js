/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-19 17:28:44 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-22 11:14:09
 * vip充值页面
 */

// 引入公用模块
import './components/common';
// 引入生成二维码脚本
import QRcode from 'qrcode';
// api接口
import {
	VIP_APIS
} from './api'
// 引入工具
import {
	toggleActive,
	alertBox,
	confirmBox
} from './util';

$(function () {
	class VipRecharge {
		constructor(index = 0) {
			this.defaultNum = index;
			this.init()
		}

		init() {
			this.isLogin = $('#vip-login').data('login') != 0;
			this.getCouponData();
			this.initDom();
			this.initEvent();
		}

		initDom() {
			this.vipHooks = {
				$vipWrap: $('.vip-wraps'),
				$vipType: $('.vip-type'),
				$couponWrap: $('#coupon-wrap'),
				$aliPay: $('#ali-pay'),
				$wxPay: $('#wx-pay'),
				$shouldPay: $('.should-pay'),
				$payPal: $('#paypal'),
				$toLogin: $('.to-login'),
			}
			this.loadingImg = '/assets/images/vip/loadcode.gif';
			const $defaultLi = this.vipHooks.$vipWrap.find('.combo').children('li').eq(this.defaultNum);

			this.defaultData = {
				id: $defaultLi.data('id'),
				coupon_relation_id: 0,
				price: 0,
				us_price: 0,
			};

			this.initDefaultData();

			this.isLogin && this.isPayOk()
		}

		getCouponData() {
			let _this = this;
			_this.couponData = [];
			if (!this.isLogin) return;
			$.ajax({
				url: VIP_APIS.coupon,
				type: 'POST',
				data: {
					coupon_status: 0
				},
				success: function (res) {
					if (res.code == 200) {
						_this.couponData = res.coupon_info;
						_this.renderCoupon();
					}
				}
			})
		}

		renderCoupon() {
			let _this = this;

			this.vipHooks.$couponWrap.empty();

			this.couponData.forEach(v => {
				if (_this.defaultData.price >= v.min_consume / 1) {
					let str = `
						<li class="${v.coupon_point/1 == 10? 'ten': v.coupon_point/1 == 20? 'twenty': 'five'}" data-id="${v.id}" data-price="${v.coupon_point/1}">
							<span class="use">使用中</span>
							<div class="fl price">￥ <em>${v.coupon_point/1}</em></div>
							<div class="time-price">
								<p>满${v.min_consume/1}可用</p>
								<span>${v.end_time}到期</span>
							</div>
						</li>`;
					this.vipHooks.$couponWrap.append(str)
				}
			});

			if (this.vipHooks.$couponWrap.children().length == 0) {
				this.vipHooks.$couponWrap.append('<p>暂无可用优惠券</p>')
			}

		}

		initEvent() {
			this.vipHooks.$vipType.on('click', 'span', this.showType.bind(this))
			this.vipHooks.$vipWrap.on('click', '.item', this.checkRecharge.bind(this))
			this.vipHooks.$couponWrap.on('click', 'li', this.checkCoupon.bind(this))
			this.vipHooks.$payPal.on('click', 'img', this.paypalAjax.bind(this))
			this.vipHooks.$toLogin.on('click', function () {
				$('#login-in').trigger('click');
			});
		}
		// 切换充值类型
		showType(e) {
			let type = $(e.target).index();
			toggleActive([this.vipHooks.$vipWrap.children('ul').eq(type), $(e.target)]);
			this.defaultData.id = this.vipHooks.$vipWrap.children('ul').eq(type).find('li:first-child').data('id');
			this.defaultData.coupon_relation_id = 0;
			this.initDefaultData();
		}
		// 切换充值选项
		checkRecharge(e) {
			let $target = $(e.target).closest('.item');

			if ($target.hasClass('active')) return;

			this.defaultData.coupon_relation_id = 0;
			this.defaultData.id = $target.data('id');
			this.initDefaultData();
		}
		// 切换优惠券
		checkCoupon(e) {
			let $target = $(e.target).closest('li'),
				_price = $target.data('price'),
				_id = $target.data('id');

			if ($target.hasClass('active')) {
				this.defaultData.coupon_relation_id = 0;
				this.defaultData.price += _price;
				$target.removeClass('active');
			} else {
				this.defaultData.coupon_relation_id = _id;
				this.defaultData.price -= _price;

				if ($target.siblings('.active').length) {
					this.defaultData.price += $target.siblings('.active').data('price');
				};
				$target.addClass('active').siblings().removeClass('active');
			};

			this.callPay();
		}
		// 初始选中状态样式
		initDefaultData() {
			let _this = this;
			this.vipHooks.$vipWrap.find('li').each((i, v) => {
				$(v).removeClass('active');
				if ($(v).data('id') == _this.defaultData.id) {
					$(v).addClass('active');
					_this.defaultData.price = $(v).data('price');
					_this.defaultData.us_price = $(v).data('us');
				}
			})

			this.renderCoupon();
			this.callPay();
		}
		// 贝宝充值
		paypalAjax() {
			let _this = this,
				{
					id
				} = this.defaultData;
			if (this.isLogin) {
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
			} else {
				_this.vipHooks.$toLogin.trigger('click');
			}
		}

		paypalLoding(flag) {
			let loadingHtml = `<div class="loading-mask" id="loading-mask"><div class="loader"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" class="path"></circle></svg></div></div>`;
			if (flag && this.loading) {
				this.loading.hide();
			} else {
				$('main').append(loadingHtml);
				this.loading = $('#loading-mask');
				this.loading.show();
			}
		}

		callPay() {
			this.vipHooks.$shouldPay.find('em').text(this.defaultData.price);
			this.vipHooks.$payPal.find('em').text(this.defaultData.us_price);

			const {
				id,
				coupon_relation_id
			} = this.defaultData;

			// 请求二维码
			this.isLogin && this.payAjax({
				id,
				coupon_relation_id
			})
		}

		payAjax(data) {
			for (let index = 0; index < 2; index++) {
				let dom = index ? this.vipHooks.$wxPay.find('img') : this.vipHooks.$aliPay.find('img');
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
	}

	// 调用
	new VipRecharge(1);
});