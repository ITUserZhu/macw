import QRcode from "qrcode";
import { toggleActive, alertBox } from "../util";
import { VIP_RECHARGE } from "../api";

let rechargeHtml = `<div class="recharge-box" id="recharge-box">
    <div class="recharge-wrap">
        <div class="recharge-close">X</div>
        <div class="recharge-type">
            <p class="active">开通VIP</p>
            <p>开通SVIP</p>
            <p>积分</p>
        </div>
        <nav class="recharge-nav">
            <span class="active">VIP</span>
            <span>SVIP</span>
            <span>积分</span>
        </nav>
        <div class="recharge-item-wrap">
            { uls }
        </div>
        <div class="recharge-coupon">
            <span class="coupon-title">优惠券：</span>
            <div class="coupon-box">
                <p class="coupon-cur">{ coupon_num }</p>
                <div class="coupon-swiper">
                    <div class="swipe-wrap">
                        <ul>{ coupons }</ul>
                    </div>
                    <div class="coupon-check">
                        <span class="coupon-arr fl disabeld">&lt;</span>
                        <span class="coupon-arr fr">&gt;</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="recharge-pay">
            <p class="recharge-need">应付金额：<span>￥</span><em>30</em></p>
            <div class="recharge-paypal"><img src="/assets/images/paypal.png"></div>
            <div class="recharge-paybox">
                <div class="recharge-ali">
                    <div class="ewm-box">
                        <img src="https://icon.52112.com/assets/images/foot-ewm.png">
                    </div>
                    <p><i class="icon-alipay"></i> 支付宝支付</p>
                </div>
                <div class="recharge-wx">
                    <div class="ewm-box">
                        <img src="https://icon.52112.com/assets/images/foot-ewm.png">
                    </div>
                    <p><i class="icon-wxpay"></i> 微信支付</p>
                </div>
            </div>
        </div>
    </div>
</div>`;

class RechargeBox {
  constructor(data) {
    this.rechargeData = data;
  }

  init() {
    if ($("#recharge-box").length) {
      this.showRecharge();
    } else {
      this.initData();
    }
  }

  initData() {
    this.couponData = this.rechargeData.coupon_info;
    let formatData = {
      vip: [],
      svip: [],
      point: this.rechargeData.point_info
    };
    this.rechargeData.package_info.forEach(v => {
      if (v.svip) {
        formatData.svip.push(v);
      } else {
        formatData.vip.push(v);
      }
    });
    this.defaultData = {
      coupon_relation_id: 0,
      coupon_len: this.couponData.length,
      coupon_width: 320,
      coupon_price: 0,
      point_type: 2
    };
    this.renderRechargeData(formatData);
    this.initDoms();
    this.initEvent();
    this.getPayOk();
    this.callPay();
  }

  initDoms() {
    this.rechargeHooks = {
      $box: $("#recharge-box"),
      $close: $(".recharge-close"),
      $vipDesc: $(".recharge-type").children("p"),
      $vipTypes: $(".recharge-nav").children("span"),
      $vipWraps: $(".recharge-item-wrap").children("ul"),
      $vipCouponSel: $(".coupon-cur"),
      $vipCouponSwipe: $(".coupon-swiper"),
      $vipCurPrice: $(".recharge-need em"),
      $vipAliEwm: $(".recharge-ali"),
      $vipWxEwm: $(".recharge-wx"),
      $vipPaypal: $(".recharge-paypal")
    };

    this.checkIndex = 0;
    this.loadingImg = "/assets/images/loading.gif";
  }

  renderRechargeData(data) {
    let html = "";
    for (let k in data) {
      let str = "";
      data[k].forEach((v, i) => {
        if (k == "vip" && i == 0) {
          this.defaultData.id = v.id;
          this.defaultData.price = v.discount_price / 1;
        }
        str += `<li class="${i == 0 && k == "vip" && "active"}" data-id="${
          v.id
        }" data-price="${
          k == "point" ? v.discount_money / 1 : v.discount_price / 1
        }">
                    <p class="name">${
                      k == "point"
                        ? v.point_name + "<em>" + v.discount_name + "</em>"
                        : v.package_name
                    }</p>
                    <div class="price">
                        <span>￥</span>
                        <em>${
                          k == "point"
                            ? v.discount_money / 1
                            : v.discount_price / 1
                        }</em>
                    </div>
                    <button>立即订购</button>
                </li>`;
      });
      html += `<ul class="${k == "vip" ? "active" : ""}">${str}</ul>`;
    }

    let couponHtml = this.renderCouponHtml();

    $("main").append(
      rechargeHtml
        .replace("{ uls }", html)
        .replace("{ coupons }", couponHtml)
        .replace(
          "{ coupon_num }",
          this.defaultData.coupon_len
            ? this.defaultData.coupon_len + "张可用"
            : "暂无可用优惠券"
        )
    );
    $("#recharge-box")
      .find(".coupon-swiper ul")
      .width(this.defaultData.coupon_len * this.defaultData.coupon_width);
  }

  initEvent() {
    const _this = this;
    // 关闭窗口
    this.rechargeHooks.$close.on("click", () => {
      this.rechargeHooks.$box.hide();
      clearInterval(this.interTimer);
    });
    // 类型切换
    this.rechargeHooks.$vipTypes.on("click", function() {
      if ($(this).hasClass("active")) return;
      const _index = $(this).index();
      const $curTypeDom = _this.rechargeHooks.$vipWraps.eq(_index);
      const $curLiDom = $curTypeDom.find("li").first();
      toggleActive([
        $(this),
        _this.rechargeHooks.$vipDesc.eq(_index),
        $curTypeDom,
        $curLiDom
      ]);
      // 积分充值修改类型
      if (_index == 2) {
        _this.defaultData.point_type = 1;
      } else {
        _this.defaultData.point_type = 2;
      }
      _this.defaultData.price = $curLiDom.data("price");
      _this.defaultData.id = $curLiDom.data("id");
      _this.defaultData.coupon_relation_id = 0;
      _this.defaultData.coupon_price = 0;

      _this.resetCoupon();
      _this.callPay();
    });
    // 项目切换
    this.rechargeHooks.$vipWraps.on("click", "li", function() {
      if ($(this).hasClass("active")) return;
      toggleActive($(this));
      _this.defaultData.id = $(this).data("id");
      _this.defaultData.price = $(this).data("price");
      _this.defaultData.coupon_relation_id = 0;
      _this.defaultData.coupon_price = 0;

      _this.resetCoupon();
      _this.callPay();
    });
    // 优惠券展示状态点击
    this.rechargeHooks.$vipCouponSel.on("click", function() {
      if (_this.defaultData.coupon_len) {
        _this.rechargeHooks.$vipCouponSwipe.toggleClass("active");
      }
    });
    // 优惠券箭头切换
    this.rechargeHooks.$vipCouponSwipe.on(
      "click",
      ".coupon-check",
      this.couponArrCheck.bind(this)
    );
    // 优惠券选择
    this.rechargeHooks.$vipCouponSwipe.on(
      "click",
      "ul li",
      this.couponChoose.bind(this)
    );
    // 贝宝支付
    this.rechargeHooks.$vipPaypal.on("click", this.paypalAjax.bind(this));
  }

  resetCoupon() {
    this.rechargeHooks.$vipCouponSwipe
      .find("ul")
      .html(this.renderCouponHtml())
      .css({
        marginLeft: 0,
        width:
          this.defaultData.coupon_len * this.defaultData.coupon_width + "px"
      });
    this.checkIndex = 0;
    this.rechargeHooks.$vipCouponSwipe
      .find(".coupon-arr.fl")
      .addClass("disabeld");

    if (this.defaultData.coupon_len > 2) {
      this.rechargeHooks.$vipCouponSwipe
        .find(".coupon-arr.fr")
        .removeClass("disabeld");
    } else {
      this.rechargeHooks.$vipCouponSwipe
        .find(".coupon-arr.fr")
        .addClass("disabeld");
    }

    this.defaultData.coupon_len &&
      this.rechargeHooks.$vipCouponSel.text(
        this.defaultData.coupon_len + "张可用"
      );
  }

  callPay() {
    this.rechargeHooks.$vipCurPrice.text(this.defaultData.price);
    this.rechargeHooks.$vipCouponSwipe.removeClass("active");

    if (this.defaultData.coupon_price) {
      this.rechargeHooks.$vipCouponSel.text(
        this.defaultData.coupon_price + "元优惠券"
      );
    } else {
      this.defaultData.coupon_len &&
        this.rechargeHooks.$vipCouponSel.text(
          this.defaultData.coupon_len + "张可用"
        );
    }

    const { id, coupon_relation_id, point_type } = this.defaultData;
    this.payAjax({ id, coupon_relation_id, point_type });
  }

  payAjax(data) {
    for (let index = 0; index < 2; index++) {
      let dom = index
        ? this.rechargeHooks.$vipWxEwm.find("img")
        : this.rechargeHooks.$vipAliEwm.find("img");
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
          alertBox(res.msg);
        }
      });
    }
  }

  renderCouponHtml() {
    this.defaultData.coupon_len = 0;
    let html = "";
    this.couponData.forEach(v => {
      if (v.min_consume <= this.defaultData.price) {
        html += `<li data-id="${v.id}" data-price="${v.coupon_point / 1}">
                    <div class="coupon-info fl">
                        <p>VIP优惠券</p>
                        <p class="min-price">满${v.min_consume / 1}元可使用</p>
                        <span>${v.end_time}前有效</span>
                    </div>
                    <div class="coupon-price fr">
                        <em>￥</em>
                        <span>${v.coupon_point / 1}</span>
                    </div>
                </li>`;
        this.defaultData.coupon_len++;
      }
    });
    return html;
  }

  couponArrCheck(e) {
    const target = $(e.target).closest(".coupon-arr");

    if (!target.hasClass("disabeld")) {
      if (target.is(".fl")) {
        if (this.checkIndex < 2) {
          target.closest(".fl").addClass("disabeld");
        }
        this.checkIndex--;
        target
          .closest(".fl")
          .next(".fr")
          .removeClass("disabeld");
      } else {
        if (this.checkIndex > this.defaultData.coupon_len - 4) {
          target.closest(".fr").addClass("disabeld");
        }
        this.checkIndex++;
        target
          .closest(".fr")
          .prev(".fl")
          .removeClass("disabeld");
      }
      this.rechargeHooks.$vipCouponSwipe
        .find("ul")
        .css(
          "marginLeft",
          -this.checkIndex * this.defaultData.coupon_width + "px"
        );
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

  paypalAjax() {
    const { id } = this.defaultData;
    this.paypalLoading();
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
          alertBox(res.msg);
        }
      })
      .always(() => {
        this.paypalLoading(1);
      });
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
    this.interTimer = setInterval(function() {
      $.ajax({
        url: VIP_RECHARGE.pay_ok,
        type: "GET",
        success: function(msg) {
          if (msg.code == 200) {
            $("body").append(
              '<div id="payok" style="width: 400px; z-index: 9999; height: 250px; padding: 25px; box-sizing: border-box; background: #fff; border-radius: 10px; position: fixed; top: 0; left: 0; right: 0; bottom: 0; margin: auto; text-align: center; font-size: 16px; box-shadow: 0 0 20px 0 rgba(0,0,0,.2)"><img src="/assets/images/payok.png" width="70"><p style="font-size: 20px; margin: 20px 0 25px;">充值成功</p><a href="/" style="display: inline-block; margin: 0 15px; width: 145px; height: 40px; line-height: 40px; border-radius: 5px; border: 1px solid #4fbafe; box-sizing: border-box;">返回首页</a><a href="javascript: window.location.reload();" style="display: inline-block; margin: 0 15px; width: 145px; height: 40px; line-height: 40px; border-radius: 5px; background: #4fbafe; color: #fff;">确定</a></div>'
            );
            setTimeout(function() {
              window.location.reload();
            }, 5000);
          }
          return;
        }
      });
    }, 10000);
  }

  showRecharge() {
    if (this.rechargeHooks) {
      this.rechargeHooks.$box.show();
      this.callPay();
    } else {
      $("#recharge-box").show();
      $("#recharge-box").one("click", ".recharge-close", () => {
        clearInterval(this.interTimer);
      });
    }
    this.getPayOk();
  }
}

export default RechargeBox;
