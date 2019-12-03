/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-29 10:28:32 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-29 11:01:36
 * 全站通用板块
 */
// 引入登录注册模块
import {
  toLoginType
} from './login'
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
    $headerSearchBox.show();
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
});