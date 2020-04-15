// 引入自定义jq方法
import "./jq-plugins/pack-check";
import "./content";
import { SHOPPING_API } from "./api";
import Recharge from "./components/recharge-box";

$(function() {
  const PACKID = $("#pack-info").data("id");

  const $otherPack = $(".rel-gather").find("ul");
  // 注册鼠标悬浮切换事件
  $otherPack
    .on("mouseenter", "li", function() {
      $(this).hoverCheck();
    })
    .on("mouseleave", "li", function() {
      $(this).leaveCheck();
    });

  // 包内搜索
  const $packSearch = $("#pack-search");

  $packSearch.on("submit", function(e) {
    e.preventDefault();
    let val = $(this)
      .find("input")
      .val();

    const regStr = new RegExp(
      /[`~!@#$%^&*()_\+=<>?:"{}|.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、|]/g
    );
    let newVal = val
      .replace(regStr, "")
      .trim()
      .replace(/\s+/g, ",");
    if (newVal) {
      window.location.href = `/pack/${PACKID}_1_${newVal}.html`;
    }
  });

  // 大小风格切换
  const $showType = $(".show-type");
  const $packList = $(".pack-content").find(".hasicons");

  // 设置用户默认大小
  if (window.localStorage) {
    const showType = localStorage.getItem("show_type");
    if (showType) {
      $packList.addClass("big");
      $showType
        .find(".icon-big")
        .addClass("active")
        .siblings()
        .removeClass("active");
    }
  }

  $showType.on("click", "span", function() {
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
    if ($(this).hasClass("icon-big")) {
      $packList.addClass("big");
      window.localStorage && localStorage.setItem("show_type", "big");
    } else {
      $packList.removeClass("big");
      window.localStorage && localStorage.removeItem("show_type");
    }
  });
  // 包下载
  const $downPackage = $("#down-package");
  let newrecharge;
  $downPackage.on("click", function() {
    if (!$(".login-logined").hasClass("active")) {
      $(".login-login").trigger("click");
    } else {
      $.ajax({
        url: SHOPPING_API.pay_package,
        type: "POST",
        data: {
          pack_id: PACKID
        }
      }).done(res => {
        if (res.code == 200) {
          window.location.href = res.url;
        } else if (res.code == 10005) {
          if (!newrecharge) {
            newrecharge = new Recharge(res);
          }
          newrecharge.init();
        } else {
          alert(res.msg);
        }
      });
    }
  });
});
