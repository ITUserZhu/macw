/*
 * @Author: Liliang Zhu 
 * @Date: 2019-12-12 16:32:10 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-12 18:03:39
 */

// 引入公用模块
import './components/common';
// 瀑布流
import './plugins/waterfall';
// 图片放大功能
import ScaleImages from './components/scale-images'

$(function () {
  // 瀑布流
  const $material = $('.waterfall');

  $material.flexImages({
    'rowHeight': 280,
    'container': 'li',
  });
  // 图片放大功能
  new ScaleImages('.material', {
    item: 'li',
    fadeTime: 0,
    oftX: 20,
    checkbtn: '.show-big'
  })
  // 条件切换
  const $listFilterItem = $('.list-filter_item');
  $listFilterItem.on('click', function () {
    $(this).siblings().find('.list-filter_cont').hide();
    $(this).find('.list-filter_cont').toggle();
  });
});