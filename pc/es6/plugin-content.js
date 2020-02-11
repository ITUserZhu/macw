/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-18 11:34:44 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-21 11:42:59
 * 插件内容页面
 */

// 内容公共板块
import './modules/content-operate';
// 轮播图
import Swiper from 'swiper';
// 工具
import {
  toggleActive
} from './util';

$(function () {
  // 轮播切换
  const $videosBtn = $('.swiper-slide').find('.video-play'),
    videos = $videosBtn.prev('video');
    // $checkLis = $('.screenshot-wrap_small').find('ul').children('li');

  new Swiper('.screenshot-swiper', {
    loop: true,
    slidesPerView: 2,
    centeredSlides: true,
    initialSlide: 0,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    simulateTouch: false,
    on: {
      slideChange: function () {
        videos.length && videos.get(0).pause();
        // toggleActive($checkLis.eq(this.activeIndex));
      },
    },
  });

  // 缩略图点击
  // $checkLis.on('click', function () {
  //   let _index = $(this).index();
  //   screenshotSwiper.slideTo(_index, 300, false)
  // });
  // console.log(1);
});