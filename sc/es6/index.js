/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-25 15:02:14 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-26 16:29:43
 * 首页
 */

// 引入公用模块
import './components/common';
// 引入轮播图
import Swiper from 'swiper';
// 瀑布流
import './plugins/waterfall.js';
// 引入工具
import {
  toggleActive
} from './util';

$(function () {
  // banner轮播
  new Swiper('.banner-swiper', {
    autoplay: true,
    effect: 'fade',
  });

  // 最新更新瀑布流与展示切换
  const $newestNav = $('.newest-nav').children('span'),
    $ulWraps = $('article').children('ul');

  $ulWraps.first().flexImages({
    'rowHeight': 280,
    'container': 'li',
    'maxRows': 3,
  });

  $newestNav.on('click', function () {
    let _index = $(this).index();
    toggleActive([$(this), $ulWraps.eq(_index)]);
    flexImgsCheck($ulWraps.eq(_index));
  });

  const flexImgsCheck = ($wrap) => {
    if (!$wrap.children('li').first().find('img').attr('src')) {
      $wrap.children('li').map(v => {
        $(v).find('img').attr('src', $(v).data('src'));
      })
    }
    $wrap.flexImages({
      'rowHeight': 280,
      'container': 'li',
      'maxRows': 3,
    })
  }
});