/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-25 15:02:14 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-28 15:06:26
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
  toggleActive,
  commonSearch
} from './util';

$(function () {
  // 头部搜索
  const $indexSearch = $('#index-search'),
    $indexSearchIpt = $indexSearch.find('input');
  $indexSearch.on('submit', function (e) {
    e.preventDefault();
    let _val = $(this).find('input').val();
    commonSearch(_val);
  });

  $indexSearchIpt.autocomplete({
    paramName: 'k',
    formatResult: suggestion => suggestion.value,
    transformResult: response => {
      if (response) {
        return {
          suggestions: $.map(JSON.parse(response), v => ({
            value: v.thumb && ('<img src='+ v.thumb +'>' + v.value) || v.value,
            data: v.data
          }))
        };
      } else {
        return {
          suggestions: {}
        }
      }

    },
    deferRequestBy: 500,
    params: {
      'm': 'pic'
    },
    type: 'POST',
    preserveInput: true,
    serviceUrl: 'https://www.macw.com/api/search_associate',
    onSelect: val => val.data && window.open(val.data)
  });

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