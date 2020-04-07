/*
 * @Author: Liliang Zhu
 * @Date: 2019-11-15 15:39:41
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-27 11:16:37
 * 插件首页
 */

// 引入公用模块
import "./components/common";
// 轮播图
import Swiper from "swiper";
import { toggleActive } from "./util";

$(function() {
  let bannerInfos = new Swiper("#banner-infos", {
    effect: "fade"
    // allowTouchMove: false,
  });

  new Swiper("#banner-imgs", {
    controller: {
      control: bannerInfos
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
      renderFraction: function(currentClass, totalClass) {
        return (
          '0<span class="' +
          currentClass +
          '"></span>' +
          " <em>————</em> " +
          '0<span class="' +
          totalClass +
          '"></span>'
        );
      }
    }
  });
  // 最新更新切换
  const $checkBtn = $(".sec-check"),
    $checkWrapUl = $("section.newest").find("ul");

  $checkBtn.on("click", "span", function() {
    let _index = $(this).index();
    toggleActive([$(this), $checkWrapUl.eq(_index)]);
  });
});
