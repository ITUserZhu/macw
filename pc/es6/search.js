/*
 * @Author: Liliang Zhu
 * @Date: 2019-11-21 17:37:17
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-21 17:55:14
 * 搜索结果
 */

// 公用板块
import "./components/common";
import "./plugins/wallpaper";
import { commonSearch } from "./util";

$(function() {
  // 头部搜索功能
  const $searchForm = $("#search-form"),
    $searchInfo = $("#search-info");

  let model = $searchInfo.data("model"),
    curVal = $searchInfo.data("keyword");

  $searchForm.on("submit", function(e) {
    e.preventDefault();
    let _val = $(this)
      .find("input")
      .val();
    curVal !== _val && commonSearch(_val, model);
  });

  // 壁纸鼠标效果
  $("ul.dest-wrap")
    .on("mouseenter", "li", function() {
      $(this).hoverCheck();
    })
    .on("mouseleave", "li", function() {
      $(this).leaveCheck();
    });
});
