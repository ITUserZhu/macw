/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-14 16:09:23 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-01-06 11:40:09
 * mac软件内容
 */

// 内容公共板块
import './modules/content-operate';
// 轮播图
import Swiper from 'swiper';
// fancybox插件调用
import '@fancyapps/fancybox';

import {
  toggleActive
} from './util'

$(function () {
  // 点击展示截图
  const $contentInfoThumbsEntry = $('.content-info_thumbs');
  const $screenshotBox = $('section.screenshot');
  const $screenshotClose = $('.screenshot-close');

  // 轮播切换与视频播放
  const $videosBtn = $('.swiper-slide').find('.video-play'),
    videos = $videosBtn.prev('video');
  let thumbsSwiper = null;

  $contentInfoThumbsEntry.on('click', '.img', function () {
    $screenshotBox.show();
    if (!thumbsSwiper) {
      thumbsSwiper = new Swiper('.screenshot-swiper-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        watchSlidesVisibility: true,

      })

      new Swiper('.screenshot-swiper', {
        zoom: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        thumbs: {
          swiper: thumbsSwiper,
        },
        on: {
          slideChange: function () {
            videos.length && videos.get(0).pause();
          },
        },
      });
    }
  });
  // 点击隐藏
  $screenshotClose.on('click', function () {
    $screenshotBox.hide();
  });

  // 头部悬浮导航
  const $sections = $("section.sec-item"),
    $navLis = $('#nav-ul').children('li'),
    $conImgs = $('.fr-view').find('img'),
    $fixNav = $('section.section-nav');
  // 需要出现悬浮高度
  const fixShowHeight = $('.rec-topic').length && $('.rec-topic').offset().top || 500;

  let sectionHeight = new Array;
  // 存入栏目高度
  $sections.each(function (i, el) {
    sectionHeight.push(Math.floor($(el).offset().top - 70))
  });
  // 判断内容图片加载动态添加高度
  if ($conImgs.length > 0) {
    let imgI = 0;
    $conImgs.each(function () {
      let $this = $(this);
      if ($this.get(0).complete) {
        imgI++;
      } else {
        $this.on('load', function () {
          imgI++;
          if (imgI == $conImgs.length) {
            sectionHeight = sectionHeight.map(function (v, m) {
              return Math.ceil($sections.eq(m).offset().top) - 70;
            });
          } else {
            sectionHeight = sectionHeight.map(function (height, n) {
              if (n < 1 || $this.closest('td').is('td')) return height;
              return height += $this.height();
            });
          }
        });
      }

    });
  };
  // 点击悬浮菜单滚动到指定位置
  $navLis.on('click', function () {
    let _index = $(this).index();
    $('body, html').animate({
      scrollTop: sectionHeight[_index]
    }, 300);
  });
  // 页面滚动动态切换选中状态
  $(window).scroll(function () {
    var scrollT = $(window).scrollTop(),
      curI;
    scrollT >= fixShowHeight ? $fixNav.stop().show() : $fixNav.stop().hide();
    for (var i = 0; i < sectionHeight.length; i++) {
      var height_0 = sectionHeight[0],
        height_1 = sectionHeight[i],
        height_2 = sectionHeight[i + 1];
      if (scrollT < height_0) {
        curI = 0;
        break;
      } else if (!height_2 || height_1 <= scrollT && height_2 > scrollT) {
        curI = i;
        break;
      }
    };
    toggleActive($navLis.eq(curI));
  });

  // 所有切換按鈕切換功能
  const $toggleBtnWrap = $('.sec-toggle-btn');

  $toggleBtnWrap.on('click', 'span', function () {
    if ($(this).hasClass('active')) return;
    let _index = $(this).index();
    const $wrap = $(this).closest('.sec-toggle-btn').prev('.sec-toggle-wrap');
    toggleActive([$(this), $wrap.children().eq(_index)]);
  });
});