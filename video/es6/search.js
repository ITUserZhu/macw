/*
 * @Author: Liliang Zhu 
 * @Date: 2019-12-13 12:03:51 
 * @Last Modified by:   Liliang Zhu 
 * @Last Modified time: 2019-12-13 12:03:51 
 */

// 引入公用模块
import './list';
// 搜索
import {
  commonSearch
} from './util';

$(function () {
  // 搜索
  const $form = $('#search-video');

  $form.on('submit', function (e) {
    e.preventDefault();
    let _val = $(this).find('input').val();
    commonSearch(_val);
  });
});