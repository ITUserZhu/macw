/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-21 10:02:34 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-21 11:36:08
 * 壁纸列表页面
 */

import './components/common';
import './plugins/wallpaper';

$(function () {
  $('ul.wallpaper').on('mouseenter', 'li', function () {
    $(this).hoverCheck();
  }).on('mouseleave', 'li', function () {
    $(this).leaveCheck();
  })
});