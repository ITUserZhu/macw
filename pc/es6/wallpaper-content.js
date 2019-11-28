/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-21 10:13:25 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-21 11:27:12
 * 壁纸内容页
 */

// 内容公共板块
import './modules/content-operate';

// 引入壁纸播放脚本
import './plugins/wallpaper';

$(function () {
  // 壁纸播放
  $('.wallpaper-img').hoverCheck(2000);

});