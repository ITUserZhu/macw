/*
 * @Author: Liliang Zhu 
 * @Date: 2019-12-04 09:17:29 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-01-08 16:27:58
 */

// 引入公用模块
import './components/common';
// 引入轮播图
import Swiper from 'swiper';
// 引入视频播放功能
import VideoPlay from './components/video-play';
// 引入分享功能
import Share from './components/share';
// api接口
import {
  CONENT_APIS
} from './api';

// 引入下载功能
import Download from './components/download-recharge'

// 提示弹框
import {
  alertBox
} from './util';

$(function () {
  // 视频播放
  const $videoBox = $(".video-box"),
    $videoPlay = $videoBox.find('.video-play'),
    $video = $videoPlay.prev('video');

  $videoPlay.on('click', function (e) {
    e.stopPropagation();
    let video = $video.get(0);
    video.paused ? video.play() : video.pause();
  });

  $video.get(0).paused ? $videoPlay.show() : $videoPlay.hide();

  $video.on('play', function (e) {
    $videoPlay.addClass('play').stop(true, true).delay(400).fadeOut();
  }).on('pause', function (e) {
    $videoPlay.removeClass('play').stop(true, true).show();
  });

  // 轮播切换
  new Swiper('#relvideo-swiper', {
    slidesPerView: 4,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    spaceBetween: 34,
  })

  // 内容信息
  const $contentInfo = $('#content-info');
  const MODELID = $contentInfo.data('model'),
    SOFTID = $contentInfo.data('id');

  // 用户下载
  const $downloadBtn = $('#download');
  $downloadBtn.on('click', function () {
    // 判断登录
    const ISLOGIN = $('.header-login_logined').hasClass('active');

    if (ISLOGIN) {
      new Download(SOFTID, MODELID);
    } else {
      $('#login-in').trigger('click');
    }
  });

  // 点击分享
  const $share = $('#share');
  let share;
  $share.on('click', function () {
    // 判断登录
    const ISLOGIN = $('.header-login_logined').hasClass('active');
    if (ISLOGIN) {
      if (!share) {
        share = new Share();
      }
      share.init();
    } else {
      $('#login-in').trigger('click');
    }
  });

  // 收藏功能
  const $colBtn = $('#collect'),
    $colText = $colBtn.find('span'),
    colData = {
      model_id: MODELID,
      res_id: SOFTID,
      is_click: false
    };

  let isCollect = (data = colData) => {
    $.ajax({
        url: CONENT_APIS.collect,
        type: 'POST',
        data,
      })
      .done(function (res) {
        if (res.code == 200) {
          if (res.status == 1) {
            $colText.text('已收藏');
          } else {
            $colText.text('点击收藏');
          }
        } else if ((res.code == 400 || res.code == 501) && data.is_click) {
          $('#login-in').trigger('click')
        }
      })
      .fail(function (error) {
        console.log(error);
      })
  };

  isCollect();

  $colBtn.on('click', function () {
    // 判断登录
    const ISLOGIN = $('.header-login_logined').hasClass('active');
    if (ISLOGIN) {
      colData.is_click = true;
      isCollect();
    } else {
      $('#login-in').trigger('click');
    }
  });

  // 用户点赞
  const $support = $('#support');

  $support.on('click', function () {
    let num = $(this).find('span').text() / 1,
      $this = $(this);
    $.ajax({
      url: CONENT_APIS.support,
      type: 'POST',
      data: {
        model_id: MODELID,
        res_id: SOFTID,
      },
      success: function (res) {
        if (res.code == 200) {
          $this.find('span').text(num + 1)
        } else {
          alertBox(res.msg)
        }
      }
    });
  });

  // 使用教程
  const $teachBtn = $('#teach-temp');

  $teachBtn.on('click', function () {
    if ($('#teach-mask').length) {
      $('#teach-mask').show();
      $('#teach-mask').find('video').get(0).play();
    } else {
      let videoSrc = $(this).data('url');
      let teachHtml = `<div id="teach-mask"><span class="close-teach">X</span><div class="teach-con"><video src="${ videoSrc }" loop controls></video></div></div>`;
      $('main').append(teachHtml);
      setTimeout(function () {
        $('#teach-mask').find('video').get(0).play();
      }, 500)
      $('#teach-mask').on('click tap', function (e) {
        if (!$(e.target).is('video')) {
          $('#teach-mask').hide();
          $('#teach-mask').find('video').get(0).pause();
        }
      })
    }
  });

  // 专题鼠标悬浮播放
  new VideoPlay('.videos-wrap', {
    item: 'li',
    fade: true,
    oftX: 5,
    conCallback(src) {
      return `<video autoplay muted loop><source src="${ src }" type="video/mp4">您的浏览器不支持html5播放器</video>`;
    }
  })

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