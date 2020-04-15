import "./components/common";
import QRcode from "qrcode";
import { toggleActive } from "./util";
import { VIP_RECHARGE } from "./api";
(() => {
  class VipRecharge {
    constructor() {
      this.init();
    }
    // 初始化
    init() {
      this.isLogin = $("#vip-info").data("login") != 0;
      this.initCouponData();
    }

    initDom() {
      this.vipHook = {
        $vipDesc: $(".hwrap"),
        $vipTypes: $("nav.vip-type").children("span"),
        $vipWraps: $(".recharge-chooice").children("ul"),
        $vipCouponSel: $(".cur-coupon"),
        $vipCouponSwipe: $(".coupons-swipe"),
        $vipCurPrice: $(".should-pay").find("em"),
        $vipAliEwm: $(".ali-box"),
        $vipWxEwm: $(".wx-box"),
        $vipPaypal: $(".paypal"),
        $vipTologin: $(".tologin")
      };

      this.defaultData = {
        id: this.vipHook.$vipWraps
          .eq(0)
          .find("li")
          .first()
          .data("id"),
        coupon_relation_id: 0,
        price: this.vipHook.$vipWraps
          .eq(0)
          .find("li")
          .first()
          .data("price"),
        couponLen: this.couponData.length,
        couponWidth: 320,
        coupon_price: 0,
        point_type: 2
      };
      this.checkIndex = 0;
      this.loadingImg = "/assets/images/loading.gif";

      this.initChooseItem();

      this.isLogin && this.getPayOk();
    }

    initEvent() {
      const _this = this;
      // vip类型切换
      this.vipHook.$vipTypes.on("click", function() {
        if ($(this).hasClass("active")) return;
        const _index = $(this).index();
        toggleActive([
          $(this),
          _this.vipHook.$vipDesc.eq(_index),
          _this.vipHook.$vipWraps.eq(_index)
        ]);
        // 积分充值修改类型
        if (_index == 2) {
          _this.defaultData.point_type = 1;
        } else {
          _this.defaultData.point_type = 2;
        }

        _this.defaultData.id = _this.vipHook.$vipWraps
          .eq(_index)
          .find("li")
          .first()
          .data("id");
        _this.defaultData.coupon_relation_id = 0;
        _this.defaultData.coupon_price = 0;

        _this.initChooseItem();
      });
      // 充值项目切换
      this.vipHook.$vipWraps.on("click", "li", function() {
        if ($(this).data("id") == _this.defaultData.id) return;
        _this.defaultData.id = $(this).data("id");
        _this.defaultData.coupon_relation_id = 0;
        _this.defaultData.coupon_price = 0;

        _this.initChooseItem();
      });
      // 优惠券展示状态点击
      this.vipHook.$vipCouponSel.on("click", function() {
        if (_this.defaultData.couponLen) {
          _this.vipHook.$vipCouponSwipe.toggleClass("active");
        }
      });
      // 优惠券箭头切换
      this.vipHook.$vipCouponSwipe.on(
        "click",
        ".coupon-arr",
        this.couponArrCheck.bind(this)
      );
      // 优惠券选择
      this.vipHook.$vipCouponSwipe.on(
        "click",
        "ul li",
        this.couponChoose.bind(this)
      );
      // 贝宝支付
      this.vipHook.$vipPaypal.on("click", this.paypalAjax.bind(this));
      // 点击登录
      this.vipHook.$vipTologin.on("click", function() {
        $(".login-login").trigger("click");
      });
    }

    initChooseItem() {
      this.vipHook.$vipWraps.children("li").each((i, v) => {
        $(v).removeClass("active");
        if ($(v).data("id") === this.defaultData.id) {
          $(v).addClass("active");
          this.defaultData.price = $(v).data("price");
        }
      });

      this.renderCoupon();
      this.callPay();
    }

    callPay() {
      this.vipHook.$vipCurPrice.text(this.defaultData.price);
      this.vipHook.$vipCouponSwipe.removeClass("active");

      if (this.defaultData.coupon_price) {
        this.vipHook.$vipCouponSel.text(
          this.defaultData.coupon_price + "元优惠券"
        );
      } else {
        this.defaultData.couponLen &&
          this.vipHook.$vipCouponSel.text(
            this.defaultData.couponLen + "张可用"
          );
      }

      const { id, coupon_relation_id, point_type } = this.defaultData;
      this.isLogin && this.payAjax({ id, coupon_relation_id, point_type });
    }

    payAjax(data) {
      for (let index = 0; index < 2; index++) {
        let dom = index
          ? this.vipHook.$vipWxEwm.find("img")
          : this.vipHook.$vipAliEwm.find("img");
        dom.attr("src", this.loadingImg);

        $.ajax({
          url: index ? VIP_RECHARGE.wx_pay : VIP_RECHARGE.ali_pay,
          type: "POST",
          data
        }).done(res => {
          if (res.code == 200) {
            QRcode.toDataURL(res.msg, {
              width: 158,
              margin: 1
            }).then(url => {
              dom.attr("src", url);
            });
          } else {
            alert(res.msg);
          }
        });
      }
    }

    initCouponData() {
      this.couponData = [];
      if (!this.isLogin) {
        this.initDom();
        this.initEvent();
        return;
      }
      const _this = this;

      $.ajax({
        url: VIP_RECHARGE.coupon,
        type: "POST"
      }).done(function(res) {
        if (res.code == 200) {
          _this.couponData = res.coupon_info;
        }
        _this.initDom();
        _this.initEvent();
      });
    }

    renderCoupon() {
      this.vipHook.$vipCouponSwipe
        .find("ul")
        .html(this.formatCouponData())
        .end()
        .find("ul")
        .width(this.defaultData.couponLen * this.defaultData.couponWidth)
        .end()
        .css("marginLeft", 0);
      this.checkIndex = 0;
      this.vipHook.$vipCouponSwipe.find(".left-arr").addClass("disabeld");

      if (this.defaultData.couponLen > 2) {
        this.vipHook.$vipCouponSwipe.find(".right-arr").removeClass("disabeld");
      } else {
        this.vipHook.$vipCouponSwipe.find(".right-arr").addClass("disabeld");
      }

      this.defaultData.couponLen &&
        this.vipHook.$vipCouponSel.text(this.defaultData.couponLen + "张可用");
    }

    couponArrCheck(e) {
      const target = $(e.target).closest(".coupon-btn");

      if (!target.hasClass("disabeld")) {
        if (target.is(".left-arr")) {
          if (this.checkIndex < 2) {
            target.closest(".left-arr").addClass("disabeld");
          }
          this.checkIndex--;
          this.vipHook.$vipCouponSwipe.find("ul").css({
            marginLeft: -this.checkIndex * this.defaultData.couponWidth + "px"
          });
          target
            .closest(".left-arr")
            .next(".right-arr")
            .removeClass("disabeld");
        } else {
          if (this.checkIndex > this.defaultData.couponLen - 5) {
            target.closest(".right-arr").addClass("disabeld");
          }
          this.checkIndex++;
          this.vipHook.$vipCouponSwipe.find("ul").css({
            marginLeft: -this.checkIndex * this.defaultData.couponWidth + "px"
          });
          target
            .closest(".right-arr")
            .prev(".left-arr")
            .removeClass("disabeld");
        }
      }
    }

    couponChoose(e) {
      const $target = $(e.target).closest("li"),
        _price = $target.data("price"),
        _id = $target.data("id");

      if ($target.hasClass("active")) {
        this.defaultData.coupon_relation_id = 0;
        this.defaultData.price += _price;
        this.defaultData.coupon_price = 0;
        $target.removeClass("active");
      } else {
        this.defaultData.coupon_relation_id = _id;
        this.defaultData.price -= _price;
        this.defaultData.coupon_price = _price;

        if ($target.siblings(".active").length) {
          this.defaultData.price += $target.siblings(".active").data("price");
        }
        $target
          .addClass("active")
          .siblings()
          .removeClass("active");
      }

      this.callPay();
    }

    formatCouponData() {
      var html = "";
      this.defaultData.couponLen = 0;

      $.each(this.couponData, (i, v) => {
        if (this.defaultData.price >= v.min_consume / 1 && !v.status) {
          html += `<li data-id="${v.id}" data-price="${v.coupon_point / 1}">
                        <div class="coupon-info fl">
                            <p>VIP优惠券</p>
                            <p class="min-price">满${v.min_consume /
                              1}元可使用</p>
                            <span>${v.end_time}前有效</span>
                        </div>
                        <div class="coupon-price fr">
                            <em>￥</em>
                            <span>${v.coupon_point / 1}</span>
                        </div>
                    </li>`;
          this.defaultData.couponLen++;
        }
      });
      if (html === "") {
        html = '<div class="no-coupon">暂无优惠券</div>';
      }

      return html;
    }

    paypalAjax() {
      if (this.isLogin) {
        const _this = this;
        const { id } = _this.defaultData;
        _this.paypalLoading();
        $.ajax({
          url: VIP_RECHARGE.paypal,
          type: "POST",
          data: {
            id
          }
        })
          .done(res => {
            if (res.oode == 200) {
              window.location.href = res.url;
            } else {
              alert(res.msg);
            }
          })
          .always(() => {
            _this.paypalLoading(1);
          });
      } else {
        $(".login-login").trigger("click");
      }
    }

    paypalLoading(flag) {
      let loadingHtml = `<div class="loading-mask" id="loading-mask"><div class="loader"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" class="path"></circle></svg></div></div>`;
      if (flag && this.loading) {
        this.loading.hide();
      } else {
        $("main").append(loadingHtml);
        this.loading = $("#loading-mask");
        this.loading.show();
      }
    }

    getPayOk() {
      setInterval(function() {
        $.ajax({
          url: VIP_RECHARGE.pay_ok,
          type: "GET",
          success: function(msg) {
            if (msg.code == 200) {
              $("body").append(
                '<div id="payok" style="width: 400px; z-index: 9999; height: 250px; padding: 25px; box-sizing: border-box; background: #fff; border-radius: 10px; position: fixed; top: 0; left: 0; right: 0; bottom: 0; margin: auto; text-align: center; font-size: 16px; box-shadow: 0 0 20px 0 rgba(0,0,0,.2)"><img src="/assets/images/payok.png" width="70"><p style="font-size: 20px; margin: 20px 0 25px;">充值成功</p><a href="/" style="display: inline-block; margin: 0 15px; width: 145px; height: 40px; line-height: 40px; border-radius: 5px; border: 1px solid #4fbafe; box-sizing: border-box;">返回首页</a><a href="javascript: window.location.reload();" style="display: inline-block; margin: 0 15px; width: 145px; height: 40px; line-height: 40px; border-radius: 5px; background: #4fbafe; color: #fff;">确定</a></div>'
              );
              setTimeout(function() {
                win.location.reload();
              }, 5000);
            }
            return;
          }
        });
      }, 10000);
    }
  }

  new VipRecharge();
})();
