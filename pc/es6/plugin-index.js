/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-15 15:39:41 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-21 11:35:35
 * 插件首页
 */

// 轮播图
import Swiper from 'swiper';

$(function () {
  let bannerInfos = new Swiper('#banner-infos', {
    effect: 'fade',
    // allowTouchMove: false,
  });

  new Swiper('#banner-imgs', {
    controller: {
      control: bannerInfos,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
      renderFraction: function (currentClass, totalClass) {
        return '0<span class="' + currentClass + '"></span>' +
          ' <em>————</em> ' +
          '0<span class="' + totalClass + '"></span>';
      },
    },
  })
});