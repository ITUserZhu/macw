/*
 * @Author: Liliang Zhu
 * @Date: 2019-11-18 11:34:44
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-21 11:42:59
 * 插件内容页面
 */

// 内容公共板块
import "./modules/content-operate";
// 轮播图
import Swiper from "swiper";
// fancybox插件调用
import "@fancyapps/fancybox";
// 工具
import { toggleActive } from "./util";

$(() => {
  // 轮播切换
  const $videosBtn = $(".swiper-slide").find(".video-play"),
    videos = $videosBtn.prev("video");
  // $checkLis = $('.screenshot-wrap_small').find('ul').children('li');

  new Swiper(".screenshot-swiper", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    on: {
      slideChange: () => {
        videos.length && videos.get(0).pause();
        // toggleActive($checkLis.eq(this.activeIndex));
      }
    }
  });

  // 调用点击放大功能脚本
  $('[data-fancybox="frview"]').fancybox({
    thumbs: {
      autoStart: true
    }
  });
});
