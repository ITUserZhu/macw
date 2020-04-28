/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-27 14:02:20 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-04-28 11:39:02
 * 素材内容页面
 */

// 引入公用模块, 收藏与购物车功能提取在公共模块中
import './components/common';
// 引入轮播图
import Swiper from 'swiper';
// 瀑布流
import './plugins/waterfall.js';
// fancybox插件调用
import '@fancyapps/fancybox';
// api接口
import {
  CONENT_APIS
} from './api';
// 引入下载功能
import Download from './components/download-recharge';
// 图片分享功能
import './components/share-pic';


$(function () {
  const $contentInfo = $('#content-info');
  const SOFTID = $contentInfo.data('id'),
    MODELID = $contentInfo.data('model');

  // 轮播图切换
  const $atlasLis = $('.content-info_swiper').find('ul').children('li');

  if ($atlasLis.length) {
    let curIndex;
    let newSwiper = new Swiper('.content-info_swiper', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      preventClicks: false,
      allowTouchMove: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });
    $atlasLis.each((i, v) => {
      if ($(v).data('id') == SOFTID) {
        curIndex = i;
      }
    })
    $(window).on('load', function () {
      newSwiper.slideTo(curIndex, 0);
    });
  };

  // 相似图片轮播图
  if ($('.material').length) {
    const $material = $('.material');
    $material.flexImages({
      'rowHeight': 280,
      'container': 'li'
    });
  }

  // 用户编辑
  const $editBtn = $('#edit');
  $editBtn.on('click', function () {
    // 判断登录
    const ISLOGIN = $('#logined-box').hasClass('active');
    const EDITID = $(this).data('id');
    if (ISLOGIN) {
      window.location.href = `/img_edit.html?img_id=${EDITID}`;
    } else {
      $('#login-in').trigger('click');
    }
  });

  // 用户下载
  const $downloadBtn = $('.download');
  $downloadBtn.on('click', function () {
    // 判断登录
    const ISLOGIN = $('#logined-box').hasClass('active');
    const DWONID = $(this).data('id');
    if (ISLOGIN) {
      new Download(DWONID);
    } else {
      $('#login-in').trigger('click');
    }
  });

  // 添加足迹
  $(window).one('scroll', function () {
    setTimeout(function () {
      $.ajax({
        url: CONENT_APIS.stat + MODELID + '/' + SOFTID,
        type: 'GET',
        success: function () {
          return;
        }
      });
    }, 1000);
  });
});