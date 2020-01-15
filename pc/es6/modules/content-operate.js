/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-21 11:12:45 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-30 17:40:27
 * 内容页通用板块
 */

// 引入公用模块
import '../components/common';

// 内容侧边标题导航
import ContentFixNav from '../components/content-nav';

// api接口
import {
  CONENT_APIS
} from '../api';

// 引入分享功能
import Share from '../components/share';

// 引入下载功能
import Download from '../components/download-recharge'

// 提示弹框
import {
  alertBox
} from '../util';

$(function () {
  // 内容信息
  const $contentInfo = $('#content-info');
  const MODELID = $contentInfo.data('model'),
    SOFTID = $contentInfo.data('id');

  // 视频监听状态
  const $videosBtn = $('.swiper-slide').length ? $('.swiper-slide').find('.video-play') : $('.video-play'),
    videos = $videosBtn.prev('video');

  $videosBtn.on('click', function (e) {
    e.stopPropagation();
    let video = $(this).prev('video').get(0);

    video.paused ? video.play() : video.pause();
  });

  // 监听视频播放展示按钮显隐
  videos
    .on('play', function (e) {
      $(this).next('span').addClass('play').stop(true, true).delay(400).fadeOut();
    })
    .on('pause', function (e) {
      $(this).next('span').removeClass('play').stop(true, true).show();
    });

  // 内容目录导航
  const $frView = $('.fr-view'),
    $contentH = $('.fr-view .intro').length > 0 ? $('.fr-view .intro') : $('.fr-view h2').length > 0 ? $('.fr-view h2') : $('.fr-view h3');
  const descTop = $('.fr-view').offset().top - window.innerHeight / 2;

  new ContentFixNav($frView, $contentH, {
    scrollT: MODELID == 15 ? 80 : 0,
    showTop: descTop,
    top: '40%',
  });

  // 用户下载
  let $downloadBtn = $('#download');
  if ($('#fix-download').length) {
    $downloadBtn = $downloadBtn.add($('#fix-download'));
  }
  $downloadBtn.on('click', function () {
    // 判断登录
    const ISLOGIN = $('.header-login_logined').hasClass('active');

    if (ISLOGIN) {
      new Download(SOFTID, MODELID);
    } else {
      $('#login-in').trigger('click');
    }

  });

  // 判断显示教程
  const $frVipShow = $('.fr-vip-show'),
    $frVipTip = $('.fr-vip-tip');
  $.ajax({
      url: CONENT_APIS.check_vip,
      type: 'POST',
      data: {
        res_id: SOFTID,
        model_id: MODELID,
      },
    })
    .done(function (res) {
      if (res.code == 200 && res.status == 1) {
        $frVipShow.show();
        $frVipTip.hide();
      }
    })

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
    let num = $(this).find('em').text() / 1,
      isWallpaper = $(this).find('em').text() == '+1',
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
          if(isWallpaper) {
            $this.addClass('active')
          } else {
            $this.find('em').text(num + 1);
          }
        } else {
          alertBox(res.msg)
        }
      }
    });
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