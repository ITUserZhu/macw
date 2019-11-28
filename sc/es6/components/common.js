/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-15 10:28:32 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-28 14:05:26
 * 全站通用板块
 */
// 引入登录注册模块
import {
  toLoginType
} from './login'
// 判断登录状态模块，动态处理收藏与购物车
import './login-status';
// 搜索
import {
  commonSearch
} from '../util';

$(function () {
  // 头部登录注册
  const $loginBtn = $('#login-box').children('button');
  $loginBtn.on('click', function () {
    let _index = $(this).index();
    toLoginType.init().showLogin(0, _index)
  });

  // 头部搜索
  const $headerForm = $('#header-bot_form');
  $headerForm.on('submit', function (e) {
    e.preventDefault();
    let _val = $(this).find('input').val();
    commonSearch(_val);
  });
});