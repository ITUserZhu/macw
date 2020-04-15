import "./jq-plugins/pack-check";
import "./content";
import AsideNav from "./components/aside-nav";

$(function() {
  const CURID = $("#list-info").data("id");
  new AsideNav(CURID);
  // 大小风格切换
  const $showType = $(".show-type");
  const $iconList = $(".list-content").find(".hasicons");

  // 设置用户默认大小
  if (window.localStorage) {
    const showType = localStorage.getItem("show_type");
    if (showType) {
      $iconList.addClass("big");
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
      $iconList.addClass("big");
      window.localStorage && localStorage.setItem("show_type", "big");
    } else {
      $iconList.removeClass("big");
      window.localStorage && localStorage.removeItem("show_type");
    }
  });

  const $packList = $(".pack-list");
  const $searchPack = $(".search-pack");

  // 注册鼠标悬浮切换事件
  $packList
    .add($searchPack)
    .on("mouseenter", "li", function() {
      $(this).hoverCheck();
    })
    .on("mouseleave", "li", function() {
      $(this).leaveCheck();
    });
});
