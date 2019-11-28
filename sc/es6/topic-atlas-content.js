/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-26 16:19:37 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-26 16:41:29
 * 专题与图集内容页
 */

// 引入公用模块
import './components/common';
// 瀑布流
import './plugins/waterfall.js';
// 引入轮播图
import Swiper from 'swiper';

$(function () {
  // 图片素材瀑布流
  if ($('ul.material').length) {
    const $materialUl = $('ul.material');
    $materialUl.flexImages({
      'rowHeight': 280,
      'container': 'li',
    });
  }

  // banner轮播
  new Swiper('.swiper-container', {
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 18,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});