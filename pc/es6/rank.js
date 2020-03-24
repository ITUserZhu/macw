/*
 * @Author: Liliang Zhu
 * @Date: 2019-11-19 14:53:57
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-21 11:35:42
 * 排行榜
 */
// 引入公用模块
import "./components/common";
import "./plugins/wallpaper";
// 引入工具
import { toggleActive } from "./util";

$(() => {
  const $pagi = $(".rank-pagi"),
    $rankUls = $("section").children("ul");
  $pagi.on("click", "span", function(e) {
    let _index = $(this).index();
    toggleActive([$(this), $rankUls.eq(_index)]);
  });

  if ($(".rank-wallpaper").length) {
    $("ul.wallpaper")
      .on("mouseenter", "li", function() {
        $(this).hoverCheck();
      })
      .on("mouseleave", "li", function() {
        $(this).leaveCheck();
      });
  }
});
