/*
 * @Author: Liliang Zhu
 * @Date: 2019-12-27 16:55:25
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-01-03 16:51:23
 * word模板内容
 */

// 内容公共板块
import "./modules/content-operate";
// fancybox插件调用
import "@fancyapps/fancybox";

$(function() {
  $('[data-fancybox="frview"]').fancybox({
    thumbs: {
      autoStart: true
    }
  });
  // 页面滚动展示悬浮头部
  const $fixNav = $("section.section-nav");

  $(window).scroll(function() {
    var scrollT = $(window).scrollTop();
    scrollT >= 300 ? $fixNav.stop().show() : $fixNav.stop().hide();
  });
});
