/*
 * @Author: Liliang Zhu 
 * @Date: 2019-12-03 14:30:20 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-03 14:54:30
 */

// 引入公用模块
import './components/common';
// 引入视频播放功能
import VideoPlay from './components/video-play';

$(function () {
  // 鼠标悬浮展示视频
  new VideoPlay('.video-ul', {
    item: 'li',
    fade: true,
    oftX: 5,
    conCallback(src) {
      return `<video autoplay muted loop><source src="${ src }" type="video/mp4">您的浏览器不支持html5播放器</video>`;
    }
  })
});