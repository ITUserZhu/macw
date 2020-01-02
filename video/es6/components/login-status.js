/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-21 11:33:36 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-01-02 14:13:57
 * 登录状态判断与头像展示
 */
import {
  LOGIN_STATUS
} from '../api'
import {
  toggleActive
} from '../util';

const HEAD_LOGIN_HTML = `
    <div class="head-user">
        <div class="acvtor-info">
            <div class="head-img">
                <img src="{ headimg }">
            </div>
            <div class="name-vip">
              <p>{ username }</p>
              <span class="{ isVip }">vip</span>
            </div>
        </div>
        <div class="user-function">
            <div class="user-item user-info">
              <div class="img"><img src="{ headimg }"></div>
              <div class="infos">
                <p><span>{ username }</span> ID：{ userid }</p>
                <p>{ vipType } <a href="https://www.__host.com/vip.html">充值</a></p>
                <p>积分：{ point }</p>
              </div>
            </div>
            <div class="user-item down-left">
              <span>软件：{ pcTimes }次</span>
              <span>素材：{ scTimes }次</span>
              <span>视频：{ vTimes }次</span>
            </div>
            <ul>
              <li><a href="/mac/pm#/admin"><i class="icon-admin"></i>用户中心</a></li>
              <li><a href="/mac/pm#/collect"><i class="icon-collectl"></i>我的收藏</a></li>
              <li><a href="/mac/pm#/download"><i class="icon-down"></i>我的下载</a></li>
              <li><a href="/mac/pm#/history"><i class="icon-footer"></i>浏览足迹</a></li>
              <li><a href="/mac/pm#/recharge"><i class="icon-recharge3"></i>充值记录</a></li>
              <li><a href="/mac/pm#/consume"><i class="icon-consume"></i>消费记录</a></li>
              <li><a href="/mac/pm#/share"><i class="icon-shares"></i>分享记录</a></li>
              <li><a href="/mac/pm#/coupon"><i class="icon-coupons"></i>优惠券</a></li>
              <li><a href="/mac/pm#/news"><i class="icon-info"></i>消息中心</a></li>
              <li class="user-out"><i class="icon-out"></i>退出</li>
            </ul>
        </div>
    </div>`;

const DEFAULTHEADIMG = '/assets/images/headimg.png';

;
(function () {
  $.ajax({
    url: LOGIN_STATUS.is_login,
    type: 'POST',
    success: function (res) {
      if (res.code == 200) {
        initHeadLogin(res);
        // 本地存储用户ip与id用于分享调用
        window.localStorage.reg_info = encodeURIComponent(window.btoa(res.data.id + '&_&' + res.data.ip));

        // 内容教程vip展示
        if ($('.fr-vip-show').length) {
          let softPoint = $('#content-info').data('point') / 1;
          if (res.data.vip != 0 || res.data.point >= softPoint) {
            $('.fr-vip-show').show();
            $('.fr-vip-tip').hide();
          }
        }
      }
    }
  });
  // 初始化头部用户功能
  function initHeadLogin(data) {
    const $loginBox = $('.header-login');
    const $logined = $loginBox.find('.header-login_logined');

    $logined.append(htmlFormat(data.data));
    toggleActive($logined);

    $logined.on('click', '.user-out', function () {
      $.ajax({
        url: LOGIN_STATUS.login_out,
        type: 'POST',
        success: function (res) {
          if (res.code == 200) {
            window.location.reload();
          } else {
            alert(res.msg)
          }
        }
      })
    })
  };
  // 格式html字符串
  function htmlFormat(data) {
    var html = '';

    html += HEAD_LOGIN_HTML
      .replace('{ isVip }', data.vip == 0 ? '' : 'vip')
      .replace('{ point }', data.point)
      .replace('{ vipType }', '普通会员')
      .replace('{ pcTimes }', 0)
      .replace('{ scTimes }', 0)
      .replace('{ vTimes }', 0)
      .replace(/{ username }/g, data.nickname)
      .replace('{ userid }', data.id)
      .replace(/{ headimg }/g, data.headimg || DEFAULTHEADIMG)

    return html;
  };

  // 判断用户是否是分享用户存入cookie
  (function () {
    let url = window.location.href,
      urlFrom = '',
      newIdUrl;

    if (url.match(/\?id=/)) {
      if (document.referrer !== '') {
        urlFrom = document.referrer;
        urlFrom === url ? urlFrom = '' : urlFrom;
      };

      let index = url.match(/\?id=/).index;

      newIdUrl = window.atob(decodeURIComponent(url.slice(index + 4)));

      !!urlFrom && (newIdUrl += '&_&' + urlFrom);

      if (!getCookie('share_code')) {
        setCookie('share_code', window.btoa(newIdUrl));
      }
    }
    // 存储cookie
    function setCookie(name, value) {
      let Days = 30;
      let exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + value + ";expires=" + exp.toGMTString() + ";domain=.__host.com;path=/";
    }
    // 获取cookie
    function getCookie(name) {
      let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg)) {
        return arr[2];
      } else {
        return null;
      }
    }
  })();
})();