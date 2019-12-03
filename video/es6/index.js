/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-29 17:45:48 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-03 14:53:51
 * 首页
 */

// 引入公用模块
import './components/common';
// 引入轮播图
import Swiper from 'swiper';
// 引入视频播放功能
import VideoPlay from './components/video-play';

$(function () {
  // 首显轮播
  const $videosWrap = $('#index-swiper').find('.video'),
    $videos = $videosWrap.find('video');

  new Swiper('#index-swiper', {
    navigation: {
      nextEl: '.swiper-btn-next',
      prevEl: '.swiper-btn-prev',
    },
    effect: 'cube',
    on: {
      slideChange: function () {
        $videos.length && $videos.each((i, v) => {
          v.pause();
        });
      },
    },
  })

  $videosWrap.on('click', function (e) {
    e.stopPropagation();
    let $video = $(this).find('video'),
      video = $video.get(0);

    if (!$video.attr('src')) {
      $video.attr('src', $video.data('src'));
    }

    video.paused ? video.play() : video.pause();
  });

  // 监听视频播放展示按钮显隐
  $videos
    .on('play', function () {
      $(this).next('.video-play').addClass('play').stop(true, true).delay(400).fadeOut();
    })
    .on('pause', function () {
      $(this).next('.video-play').removeClass('play').stop(true, true).show();
    });

  // 鼠标悬浮展示视频
  new VideoPlay('.video-list', {
    item: 'li',
    fade: true,
    oftX: 5,
    conCallback(src) {
      return `<video autoplay muted loop><source src="${ src }" type="video/mp4">您的浏览器不支持html5播放器</video>`;
    }
  })

  // 最新板块
  new Swiper('.swiper-ae', {
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
      el: '.pagi-ae',
      clickable: true,
    },
  })
  new Swiper('.swiper-pr', {
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
      el: '.pagi-pr',
      clickable: true,
    },
  })
  new Swiper('.swiper-video', {
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
      el: '.pagi-video',
      clickable: true,
    },
  })

  // 最新视频鼠标悬浮
  new VideoPlay('.newest-video_wraps', {
    item: '.img',
    fade: true,
    oftX: 5,
    conCallback(src) {
      return `<video autoplay muted loop><source src="${ src }" type="video/mp4">您的浏览器不支持html5播放器</video>`;
    }
  })

  // 专题鼠标效果
  const $topicUl = $('.hot-topic').find('ul');
  new VideoPlay($topicUl, {
    item: 'li',
    fade: true,
    oftX: 5,
    conCallback(src) {
      return `<video autoplay muted loop><source src="${ src }" type="video/mp4">您的浏览器不支持html5播放器</video>`;
    }
  });
});