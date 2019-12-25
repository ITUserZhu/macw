/*
 * @Author: Liliang Zhu 
 * @Date: 2019-12-12 16:32:10 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-25 11:09:11
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

  if ($material.children().length) {
    $material.flexImages({
      'rowHeight': 280,
      'container': 'li',
    });
    // 图片放大功能
    new ScaleImages('.material', {
      item: 'li',
      fadeTime: 0,
      fade: true,
      oftX: 15,
      checkbtn: '.show-big'
    })
  }

  // 条件切换
  const $listFilterItem = $('.list-filter_item');
  $listFilterItem.on('click', function () {
    $(this).siblings().find('.list-filter_cont').hide();
    $(this).find('.list-filter_cont').toggle();
  });

  // 翻页输入框
  const $checkPagi = $('.check-pagi');

  $checkPagi.on('keyup', 'input', function (event) {
    const e = event || window.event || arguments.callee.caller.arguments[0];
    let page = $(this).val() / 1,
      url = $(this).data('url'),
      allNum = $(this).parent().find('em').text() / 1;
    if (page < 1) $(this).val(1);
    if (page > allNum) $(this).val(allNum);
    if (e && e.keyCode == 13) {
      window.location.href = url.replace('checkPagi', page);
    }
  });

  // 判断滚动到底部加载下一页
  $('#next-url').length && $(window).on('scroll', function (e) {
    const nextUrl = $('#next-url').attr('href');
    let $this = $(this),
      viewH = $this.height(),
      contentH = $('body').get(0).scrollHeight,
      scrollT = $this.scrollTop();
    if (scrollT / (contentH - viewH) >= 1) {
      window.location.href = nextUrl;
    }
  });
});