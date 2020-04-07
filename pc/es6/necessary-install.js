/*
 * @Author: Liliang Zhu
 * @Date: 2020-02-13 12:45:48
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-02-13 12:55:51
 * 首页
 */

// 引入公用模块
import "./components/common";
// 壁纸鼠标效果
import "./plugins/wallpaper";
// 引入视频播放功能
import VideoPlay from "./components/video-play";

$(function() {
  // 壁纸鼠标效果
  $("ul.wallpaper")
    .on("mouseenter", "li", function() {
      $(this).hoverCheck();
    })
    .on("mouseleave", "li", function() {
      $(this).leaveCheck();
    });

  // 视频鼠标功能
  const $videos = $(".necessary").find("ul.video");

  new VideoPlay($videos, {
    item: "li",
    fade: true,
    oftX: 5,
    conCallback(src) {
      return `<video autoplay muted loop><source src="${src}" type="video/mp4">您的浏览器不支持html5播放器</video>`;
    }
  });
});
