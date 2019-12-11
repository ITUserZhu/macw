/*
 * @Author: Liliang Zhu 
 * @Date: 2019-12-11 15:34:18 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-11 15:36:38
 */

// 引入公用模块
import './components/common';
// 引入工具
import {
  toggleActive
} from './util';

$(function () {
  $(window).on('load hashchange', function () {
    let _hash = (window.location.hash).replace('#', '');
    if (!_hash) {
      window.location.href = "#about";
      _hash = 'about';
    };
    let _this = $('.' + _hash);
    toggleActive(_this);
    toggleActive($('.content-check').eq(_this.index()));
  });
});