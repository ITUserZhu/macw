/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-12 17:45:48 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-25 09:36:31
 * 首页
 */

// 引入公用模块
import './components/common';
// 引入轮播图
import Swiper from 'swiper';
// 引入工具
import {
  toggleActive
} from './util';

$(function () {
  // 轮播图
  new Swiper('.swiper-container', {
    autoplay: true,
    loop: true,
    slidesPerView: 3,
    roundLengths: true,
    spaceBetween: 60,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 50
      },
      1281: {
        slidesPerView: 3,
        spaceBetween: 60
      },
      1921: {
        slidesPerView: 4,
        spaceBetween: 50
      },
    }
  });
  // 推荐切换
  const $recommendNav = $('.recommend-nav');
  const $recommendUl = $('.recommend-wrap').children('ul');
  $recommendNav.on('click', 'span', function () {
    let _index = $(this).index();
    toggleActive([$(this), $recommendUl.eq(_index)]);
  });

  // 最新视频
  // 头部首显操作
  const $videoPagi = $('.video-pagi');
  const $videoPagiNum = $videoPagi.find('.video-pagi_num em');
  const $videoLis = $('.newest-video_wrap').find('ul').children('li');
  const videoLen = $videoLis.length;
  let curVideoIndex = 0,
    curVideoZIndex = 1,
    videoLoading = null;
  // 视频点击播放与暂停
  $videoLis.on('click', '.video-wrap', function () {
    let $video = $(this).find('video');

    !$video.attr('src') && $video.attr('src', $video.data('src'));
    if ($video.get(0).paused && !videoLoading) {
      $(this).append('<div class="video-load"></div>');
      $video.parent().find('.video-play').addClass('play').stop(true, true).delay(400).fadeOut();
      videoLoading = setInterval(function () {
        if ($video.get(0).readyState === 4) {
          clearInterval(videoLoading);
          $video.parent().find('.video-load').remove();
          $video.get(0).play();
          $video.parent().css('zIndex', '2');
        }
      }, 50)

    } else {
      clearInterval(videoLoading);
      videoLoading = null;
      $(this).find('.video-load').remove();
      $(this).find('.video-play').removeClass('play').stop(true, true).show();
      $video.get(0).pause();
      $video.parent().css('zIndex', '0');
    }
  });
  // 翻页点击
  $videoPagi.on('click', function (e) {
    let $target = $(e.target).closest('button');

    if ($target.is('.btn-prev')) {
      if (curVideoIndex > 0) {
        curVideoIndex--;
        curVideoZIndex++;
      }
    } else if ($target.is('.btn-next')) {
      if (curVideoIndex < (videoLen - 1)) {
        curVideoIndex++;
        curVideoZIndex++;
      }
    }
    clearInterval(videoLoading);
    videoLoading = null;
    toggleActive($videoLis.eq(curVideoIndex));
    $videoLis.eq(curVideoIndex)
      .find('.video-play').removeClass('play').show()
      .end().find('.video-load').remove()
      .end().css('zIndex', curVideoZIndex);

    $videoLis.eq(curVideoIndex).find('video').parent().css('zIndex', '0');
    $videoLis.eq(curVideoIndex).find('video').get(0).pause()

    $videoPagiNum.text('0' + (curVideoIndex + 1));
  });

  // 最新素材
  const $materialInfos = $('.newest-material_info').children('li');
  const $materialImgs = $('.newest-material_pics').children('li');
  let materialTimer = null;

  $materialImgs.on('mouseenter', function () {
    let _index = $(this).index();
    materialTimer = setTimeout(() => {
      toggleActive([$(this), $materialInfos.eq(_index)]);
    }, 200)
  }).on('mouseleave', function () {
    clearTimeout(materialTimer);
  });

  // 精品应用
  const $boutiqueAppType = $('.boutique-app_type');
  const $boutiqueAppWrap = $('.boutique-app_wrap').children('ul');

  $boutiqueAppType.on('click', 'span', function () {
    let _index = $(this).index();
    toggleActive([$(this), $boutiqueAppWrap.eq(_index)]);
  });
});