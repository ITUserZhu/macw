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

  const liActiveWidth = "50%";
  const liOtherWidth = 50 / (lisLen - 1) + "%";

  $bannerLis.css("width", liOtherWidth);
  $bannerLis
    .eq(midIndex)
    .addClass("active")
    .css("width", liActiveWidth);

  $bannerLis.on("mouseenter", function() {
    let curIndex = $(this).index();

    toggleActive($(this));
    $(this).css("width", liActiveWidth);
    $(this)
      .siblings()
      .css("width", liOtherWidth);
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

  // 轮播图
  // new Swiper(".swiper-container", {
  //   autoplay: true,
  //   loop: true,
  //   loopAdditionalSlides: 3,
  //   slidesPerView: 3,
  //   roundLengths: true,
  //   spaceBetween: 60,
  //   navigation: {
  //     nextEl: ".swiper-button-next",
  //     prevEl: ".swiper-button-prev"
  //   },
  //   breakpoints: {
  //     768: {
  //       slidesPerView: 2,
  //       spaceBetween: 50
  //     },
  //     1281: {
  //       slidesPerView: 3,
  //       spaceBetween: 60
  //     },
  //     1921: {
  //       slidesPerView: 4,
  //       spaceBetween: 50
  //     }
  //   }
  // });
  // 推荐切换
  const $recommendNav = $(".recommend-nav");
  const $recommendUl = $(".recommend-wrap").children("ul");
  $recommendNav.on("click", "span", function() {
    let _index = $(this).index();
    toggleActive([$(this), $recommendUl.eq(_index)]);
  });
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
