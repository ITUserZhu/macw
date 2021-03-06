/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-21 11:33:36 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-01-03 10:45:22
 * 登录状态判断与头像展示
 */
import {
  LOGIN_STATUS
} from '../api'
import {
  toggleActive
} from '../util';
// 引入图片收藏记录
import Collection from './collection';
// 引入图片购物车
import ShoppingCar from './shopping';

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
              <div class="img"><a href="https://www.__host.com/mac/pm#/admin"><img src="{ headimg }"></a></div>
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
              <li><a href="https://www.__host.com/mac/pm#/admin"><i class="icon-admin"></i>用户中心</a></li>
              <li><a href="https://www.__host.com/mac/pm#/collect"><i class="icon-collectl"></i>我的收藏</a></li>
              <li><a href="https://www.__host.com/mac/pm#/download"><i class="icon-down"></i>我的下载</a></li>
              <li><a href="https://www.__host.com/mac/pm#/history"><i class="icon-footer"></i>浏览足迹</a></li>
              <li><a href="https://www.__host.com/mac/pm#/recharge"><i class="icon-recharge3"></i>充值记录</a></li>
              <li><a href="https://www.__host.com/mac/pm#/consume"><i class="icon-consume"></i>消费记录</a></li>
              <li><a href="https://www.__host.com/mac/pm#/share"><i class="icon-shares"></i>分享记录</a></li>
              <li><a href="https://www.__host.com/mac/pm#/coupon"><i class="icon-coupons"></i>优惠券</a></li>
              <li><a href="https://www.__host.com/mac/pm#/news"><i class="icon-info"></i>消息中心</a></li>
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
      let colDatas = false,
        isLogin = false;
      if (res.code == 200) {
        initHeadLogin(res);
        // 本地存储用户ip与id用于分享调用
        window.localStorage.reg_info = encodeURIComponent(window.btoa(res.data.id + '&_&' + res.data.ip));
        colDatas = res.data.favorite_pic_id;
        // 如果是购物车页面单独处理
        !$('.shopping-car').length && (isLogin = true);
      }
      // 素材收藏状态展示
      new Collection({
        datas: colDatas,
        wrap: $('.material'),
        child: 'li',
      });
      // 素材购物车
      new ShoppingCar({
        wrap: $('.material'),
        child: 'li',
        isLogin
      });
    }
  });
  // 初始化头部用户功能
  function initHeadLogin(data) {
    const $logined = $('#logined-box');

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
      .replace('{ vipType }', data.vip_name)
      .replace('{ pcTimes }', data.surplus)
      .replace('{ scTimes }', data.surplus_pic)
      .replace('{ vTimes }', data.surplus_video)
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