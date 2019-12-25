/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-15 10:28:32 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-24 16:12:49
 * 全站通用板块
 */
// 引入登录注册模块
import {
  toLoginType
} from './login'
import SideBar from './sidebar';
// 判断登录状态模块
import './login-status';
// 搜索
import {
  commonSearch
} from '../util';

$(function () {
  // 头部登录注册
  const $loginBtn = $('.header-login_btns').children('button');
  $loginBtn.on('click', function () {
    let _index = $(this).index();
    toLoginType.init().showLogin(0, _index)
  });

  // 头部搜索
  const $headerSearchBtn = $('.header-search'),
    $headerSearchBox = $('.header-search-box'),
    $headerBox = $('.header'),
    $headerForm = $('#header-form');

  $headerSearchBtn.on('click', function () {
    $headerSearchBox.show().find('input').focus();
    $headerBox.hide();
  });

  $headerSearchBox.on('click', '.search-close', function () {
    $headerSearchBox.hide();
    $headerBox.show();
  });

  $headerForm.on('submit', function (e) {
    e.preventDefault();
    let _val = $(this).find('input').val(),
      _model = $(this).data('model') || 'all';
    commonSearch(_val, _model);
  });


  // 侧边栏生成
  new SideBar({
    item1: {
      selector: '/vip.html',
      iconClass: 'vip',
      cellText: 'VIP',
    },
    item2: {
      iconClass: 'qq',
      cellText: 'QQ客服',
      img: '/assets/images/sidebar/qq.jpg'
    },
    item3: {
      iconClass: 'wx',
      cellText: '微信客服',
      img: '/assets/images/sidebar/wx.png'
    },
    item4: {
      iconClass: 'wxgzh',
      cellText: '微信公众号',
      img: '/assets/images/sidebar/wxgzh.jpg'
    },
    item5: {
      iconClass: 'complaint',
      selector: '/complaint.html',
      cellText: '内容举报',
    },
    goTopIcon: {
      iconClass: 'back-top',
      cellText: '返回顶部'
    },
    goTopIconShow: 500
  });

});