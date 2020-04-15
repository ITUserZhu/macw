// 引入垫片
import "babel-polyfill";
// 引入动态svg脚本
import {
  loadAnimation
} from "lottie-web";
import {
  defineLordIconElement
} from "lord-icon-element";
// 引入pjax插件
import "../jq-plugins/pjax";
// 引入form表单序列化插件
import "../jq-plugins/serialize";
// 引入登录注册模块
import {
  toLoginType
} from "./login";
// 判断登录状态模块
import "./login-status";
// 引入侧边购物车模块
import shoppingCar from "./shopping-car";
// 引入工具
import {
  commonSearch
} from "../util";

// 调用动态svg方法
try {
  defineLordIconElement(loadAnimation);
} catch (error) {
  console.log(error);
}

$(function () {
  // 头部登录注册
  const $loginBtn = $(".login-unlogin").children(".login-btn");
  $loginBtn.on("click", function () {
    let _index = $(this).index();
    toLoginType.init().showLoginType(_index == 1 ? "login" : "reg");
  });

  // 头部收藏点击
  const $shopBtn = $("#header-shopping");
  $shopBtn.on("click", function () {
    if (!$loginBtn.parent().hasClass("active")) {
      shoppingCar.init();
    } else {
      $loginBtn.eq(1).trigger("click");
    }
  });
  // 头部搜索
  const $headSearch = $("#head-search");
  $headSearch.on("submit", function (e) {
    e.preventDefault();
    let val = $(this)
      .find("input")
      .val();
    commonSearch(val);
  });

  // 滚动头部悬浮
  const $header = $('header');
  const headerHeight = $header.height() - 50;

  $(window).on('scroll', function () {
    let s_height = $(this).scrollTop();

    if (s_height >= headerHeight) {
      $header.addClass('fixed');
    } else {
      $header.removeClass('fixed');
    }
  });

  // 所有图标点击加入购物车功能
  if ($(".hasicons").length) {
    shoppingCar.getAllShoppingIds($(".hasicons").children("li"));
    $("main").on("click", ".hasicons li", function (e) {
      if (
        $(e.target)
        .closest("span")
        .is(".collect")
      ) {
        e.preventDefault();
        e.stopPropagation();
        let id = $(this).data("id");
        if ($(this).hasClass("active")) {
          shoppingCar.removeIconAjax({
            icon_id: id
          }, null, $(this));
        } else {
          shoppingCar.addIconAjax({
            icon_id: id
          }, $(this));
        }
      }
    });
  } else {
    shoppingCar.getAllShoppingIds();
  }

  // 所有含有pjax类名图标添加点击展示功能
  if (
    $.support.pjax &&
    $(".pjax-item").length &&
    !$("#content-overly").length
  ) {
    // 声明当前页面信息
    const curInfo = {
      url: location.href,
      title: document.title,
      state: history.state
    };
    let toState = null;

    if (!$("#detail-overlay").length) {
      const detailHtml = `
        <div id="detail-overlay">
          <div id="detail-wrapper">
            <div class="detail-content" id="detail-content">
                
            </div>
          </div>
          <div id="detail-loading"></div>
        </div>`;

      $("main").append(detailHtml);
    }

    const $detailOverlay = $("#detail-overlay");
    const $detailWrap = $("#detail-wrapper");
    const $detailCon = $("#detail-content");

    const closeDetail = () => {
      // 关闭弹框
      $detailOverlay.removeClass("ready");
      $("body").removeClass("ovh");
      // 把当前弹框打开的地址信息加入历史state
      history.pushState(toState, toState.title, toState.url);
      // 替换之前保存的state到当前state信息
      history.replaceState(curInfo.state, curInfo.title, curInfo.url);
      document.title = curInfo.title;
    };
    // 注册事件
    $detailWrap.on("click", e => {
      const $_target = $(e.target);
      if (
        $_target.closest(".detail-content").is("#detail-content") &&
        !$_target.closest("span").is(".operate-close")
      ) {
        return;
      }
      closeDetail();
    });

    // pjax请求
    $(document).pjax(".pjax-item", "#detail-content", {
      fragment: "#content-overly",
      timeout: 8000
    });
    // pjax生命钩子
    $(document).on("pjax:send", function () {
      $detailOverlay.addClass("loading");
      $("body").addClass("ovh");
    });
    $(document).on("pjax:complete", function () {
      $detailOverlay.addClass("ready").removeClass("loading");
      toState = history.state;
    });
    $(document).on("pjax:end", function (e) {
      // 处理左右切换地址为当前图集图标
      if (e.relatedTarget) {
        let curUrl = e.relatedTarget.baseURI;
        let iconID = curUrl
          .substring(curUrl.lastIndexOf("/"))
          .replace(/[^0-9]/gi, "");
        let prevUrl, nextUrl;
        $(".hasicons")
          .children("li")
          .each((i, v) => {
            if ($(v).data("id") == iconID) {
              prevUrl =
                $(v)
                .prev()
                .find("a")
                .attr("href") || "javascript:;";
              nextUrl =
                $(v)
                .next()
                .find("a")
                .attr("href") || "javascript:;";
            }
          });
        if (nextUrl && prevUrl) {
          $detailCon.find(".prev-btn").attr("href", prevUrl);
          $detailCon.find(".next-btn").attr("href", nextUrl);
        }
      }

      if ($detailCon.html().trim() == "") {
        $("body").removeClass("ovh");
        $detailOverlay.attr("class", "");
      } else {
        $("body").addClass("ovh");
        $detailOverlay.addClass("ready");
        $detailWrap.animate({
          scrollTop: 0
        }, 300);
        shoppingCar.getAllShoppingIds(
          $detailCon.find(".hasicons").children("li")
        );
      }
    });
  }
});