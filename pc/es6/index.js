/*
 * @Author: Liliang Zhu
 * @Date: 2019-11-12 17:45:48
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-01-08 15:05:51
 * 首页
 */

// 引入公用模块
import "./components/common";
// 引入轮播图
// import Swiper from "swiper";
// 壁纸鼠标效果
import "./plugins/wallpaper";
// 引入工具
import { toggleActive } from "./util";
// 引入视频播放功能
import VideoPlay from "./components/video-play";
// 侧边
import SideBar from "./components/sidebar";

$(function() {
  // 头部手风琴
  const $bannerUl = $(".banner-box");
  const $bannerLis = $bannerUl.children("li");
  const lisLen = $bannerLis.length;
  const midIndex = Math.floor(lisLen / 2);

  let timer = null;

  $bannerLis.on("mouseenter", function() {
    let curIndex = $(this).index();
    !!timer && clearTimeout(timer);
    timer = setTimeout(() => {
      toggleActive($(this));
    }, 150);
  });

  $bannerLis.on("mouseleave", function() {
    !!timer && clearTimeout(timer);
  });

  // 侧边锚点导航
  new SideBar(
    {
      item1: {
        selector: ".newest-video",
        iconClass: "icon-shipin",
        cellText: "视频"
      },
      item2: {
        selector: ".newest-material",
        iconClass: "icon-sucai",
        cellText: "素材"
      },
      item3: {
        selector: ".boutique-app",
        iconClass: "icon-yingyong",
        cellText: "应用"
      },
      item4: {
        selector: ".boutique-plugin",
        iconClass: "icon-chajian",
        cellText: "插件"
      },
      item5: {
        selector: ".boutique-template",
        iconClass: "icon-moban",
        cellText: "模板"
      },
      item6: {
        selector: ".newest-article",
        iconClass: "icon-jiaocheng",
        cellText: "教程"
      },
      item7: {
        selector: ".rank",
        iconClass: "icon-bangdan",
        cellText: "榜单"
      },
      goTopIcon: {
        iconClass: "icon-arrow",
        cellText: "返回顶部"
      },
      goTopIconShow: 500,
      watchScroll: true
    },
    '<div id="index-aside"></div>'
  );

  // 推荐板块切换功能
  const $recommendNav = $(".recommend-nav").children("span"),
    $recommendPagi = $(".recommend-pagi"),
    $recommendWrap = $(".recommend-wrap").children(".recommend-box");

  initNewestItemCheck();

  $recommendNav.on("click", function() {
    var _index = $(this).index();
    toggleActive([$(this), $recommendWrap.eq(_index)]);

    initNewestItemCheck(_index);
  });

  $recommendPagi.on("click", ".pagi-btn", function() {
    const $wrap = $(".recommend-wrap")
      .children(".recommend-box.active")
      .find(".ul-box");
    let index = $(this).index();
    toggleActive($(this));
    if (!index) {
      $wrap.removeClass("move");
    } else {
      $wrap.addClass("move");
      let $uls = $wrap.children("ul").eq(1);
      $uls.children("li").each(function(index, el) {
        if (
          !$(el)
            .find(".img img")
            .attr("src")
        ) {
          $(el)
            .find("img:not('.bz-imgs')")
            .attr(
              "src",
              $(el)
                .find(".img img")
                .data("src")
            );
        }
      });
    }
  });

  function initNewestItemCheck(index = 0) {
    const $wrap = $recommendWrap.eq(index).find(".ul-box"),
      hasChild = !!$wrap
        .find("ul")
        .eq(1)
        .children().length;
    $wrap.removeClass("move");
    if (hasChild) {
      $recommendPagi.show();
      toggleActive($recommendPagi.children().eq(0));
    } else {
      $recommendPagi.hide();
    }
  }

  // 壁纸鼠标效果
  $("ul.wallpaper")
    .on("mouseenter", "li", function() {
      $(this).hoverCheck();
    })
    .on("mouseleave", "li", function() {
      $(this).leaveCheck();
    });

  // 最新文章切换
  const $articleSection = $(".newest-article"),
    $articleUl = $articleSection.find(".article-wraps").children("ul"),
    $articleBtns = $articleSection.find(".article-check").children("span");

  $articleBtns.on("click", function() {
    let _index = $(this).index();
    toggleActive([$(this), $articleUl.eq(_index)]);
  });

  // 最新视频鼠标功能
  const $videos = $(".newest-video_wrap").find("ul");

  new VideoPlay($videos, {
    item: "li",
    fade: true,
    oftX: 5,
    conCallback(src) {
      return `<video autoplay muted loop><source src="${src}" type="video/mp4">您的浏览器不支持html5播放器</video>`;
    }
  });
});
