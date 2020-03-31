/*
 * @Author: Liliang Zhu
 * @Date: 2019-11-18 11:34:44
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-21 11:28:30
 * 模板内容页
 */

// 内容公共板块
import "./modules/content-operate";
// fancybox插件调用
import "@fancyapps/fancybox";
// 轮播图
import Swiper from "swiper";

$(function() {
  // 轮播切换
  const $videosBtn = $(".swiper-slide").find(".video-play"),
    videos = $videosBtn.prev("video");
  new Swiper(".screenshot-swiper", {
    on: {
      slideChange: function() {
        videos.length && videos.get(0).pause();
      }
    },
    thumbs: {
      swiper: {
        el: "#screenshot-small",
        spaceBetween: 13,
        slidesPerView: 7,
        watchSlidesVisibility: true,
        /*避免出现bug*/
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      }
    }
  });

  $('[data-fancybox="frview"]').fancybox({
    thumbs: {
      autoStart: true
    }
  });
});
