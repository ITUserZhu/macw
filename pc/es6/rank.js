/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-19 14:53:57 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-21 11:35:42
 * 排行榜
 */
// 引入公用模块
import './components/common';
// 引入工具
import {
  toggleActive
} from './util';

$(function () {
  const $pagi = $('.rank-pagi'),
    $rankUls = $('section').children('ul');
  $pagi.on('click', 'span', function (e) {
    var _index = $(this).index();
    toggleActive([$(this), $rankUls.eq(_index)]);
  });
});