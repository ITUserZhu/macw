/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-14 16:09:23 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-21 11:25:46
 * mac软件内容
 */

// 内容公共板块
import './modules/content-operate';
// 轮播图
import Swiper from 'swiper';

$(function () {

  // 轮播切换与视频播放
  const $videosBtn = $('.swiper-slide').find('.video-play'),
    videos = $videosBtn.prev('video');
  new Swiper('.screenshot-swiper', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    on: {
      slideChange: function () {
        videos.length && videos.get(0).pause();
      },
    },
  });
});