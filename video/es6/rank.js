/*
 * @Author: Liliang Zhu 
 * @Date: 2019-12-03 16:17:01 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-03 17:11:40
 */
// 引入公用模块
import './components/common';
// 引入轮播图
import Swiper from 'swiper';

$(function () {
  new Swiper('.swiper-container', {
    loop: true,
    initialSlide: 2,
    slidesPerView: 3,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })

  const $videoItems = $('.video-item');
  const videoloadHtml = '<div class="video-load"></div>';
  let timer;

  $videoItems.hover(function () {
    if ($(this).closest('.swiper-slide').hasClass('swiper-slide') && !$(this).closest('.swiper-slide').hasClass('swiper-slide-next')) return;

    let $_this = $(this),
      $video = $_this.find('video'),
      videoLoading = null;

    $_this.addClass('hover').append(videoloadHtml);

    timer = setTimeout(function () {
      $video.attr('src', $video.data('src'));
      videoLoading = setInterval(function () {
        if ($video.get(0).readyState === 4) {
          clearInterval(videoLoading);
          $_this.find('.video-load').remove();
          $video.get(0).play();
        }
      }, 50)
    }, 250);
  }, function () {
    clearTimeout(timer);
    $(this).removeClass('hover').find('video').attr('src', '').get(0).pause();
    if ($(this).find('.video-load').length) {
      $(this).find('.video-load').remove();
    }
  })
});