/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-29 17:45:48 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-01-09 13:54:21
 * 首页
 */

// 引入公用模块
import './components/common';
import {
  toggleActive,
  commonSearch
} from './util';
// 引入轮播图
import Swiper from 'swiper';
// 引入视频播放功能
import VideoPlay from './components/video-play';

$(function () {
  // 头部搜索
  const $searchForm = $('#video-search'),
    $searchFormIpt = $searchForm.find('input');

  $searchForm.on('submit', function (e) {
    e.preventDefault();
    let _val = $(this).find('input').val();
    commonSearch(_val);
  });

  $searchFormIpt.autocomplete({
    paramName: 'k',
    formatResult: suggestion => suggestion.value,
    transformResult: response => {
      if (response) {
        return {
          suggestions: $.map(JSON.parse(response), v => ({
            value: v.thumb && ('<img src='+ v.thumb +'>' + v.value) || v.value,
            data: v.data
          }))
        };
      } else {
        return {
          suggestions: {}
        }
      }

    },
    params: {
      'm': 'video'
    },
    width: 630,
    type: 'POST',
    preserveInput: true,
    serviceUrl: 'https://www.macw.com/api/search_associate',
    onSelect: val => val.data && window.open(val.data)
  });
  // 首显轮播
  const $videoInfos = $('.index-infos-wrap').children('.video-info');
  let $videosWrap, $videos;

  new Swiper('#index-swiper', {
    loop: true,
    slidesPerView: 2,
    centeredSlides: true,
    initialSlide: 1,
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
      init: function () {
        $videosWrap = $('#index-swiper').find('.video');
        $videos = $videosWrap.find('video');
      },
      slideChange: function () {
        toggleActive($videoInfos.eq(this.realIndex));
        $videos.length && $videos.each((i, v) => {
          v.pause();
        });
      },
    },
  })

  $videosWrap.on('click', function (e) {
    e.stopPropagation();
    if (!$(this).closest('li').hasClass('swiper-slide-active')) return;
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
  new VideoPlay('.videos-wrap', {
    item: 'li',
    fade: true,
    oftX: 5,
    conCallback(src) {
      return `<video autoplay muted loop><source src="${ src }" type="video/mp4">您的浏览器不支持html5播放器</video>`;
    }
  })

  // 热门专题鼠标效果
  const $topics = $('.hot-topic').find('ul');

  new VideoPlay($topics, {
    item: '.img',
    fade: true,
    oftX: 5,
    conCallback(src) {
      return `<video autoplay muted loop><source src="${ src }" type="video/mp4">您的浏览器不支持html5播放器</video>`;
    }
  })

  // 最新板块换一批功能

  /** 生成随机数组
   * @params 
   * max {Number} 取值数组长度
   * num {Number} 取值数量
   * return {Array} num长度的数组
   */

  let getRandomNums = (max, num = 4) => {
    let arrWrap = new Array;

    for (let index = 0; index < num; index++) {
      let randomNum = Math.floor(Math.random() * max);
      if ($.inArray(randomNum, arrWrap) == -1) {
        arrWrap.push(randomNum);
      } else {
        index--;
      }
    }

    return arrWrap.sort((a, b) => a - b);
  }
  // 点击随机切换
  const $checkBtn = $('.newest-video_wraps').find('.check');

  $checkBtn.on('click', function () {
    let $lis = $(this).closest('.newest-video_wraps').find('ul').children('li'),
      len = $lis.length;

    let indexsArr = getRandomNums(len - 1);
    $lis.each((i, v) => {
      if ($.inArray(i, indexsArr) != -1) {
        $(v).addClass('active');
      } else {
        $(v).removeClass('active');
      }
    })
  })
});