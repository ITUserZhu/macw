/*
 * @Author: Liliang Zhu
 * @Date: 2019-11-19 09:59:13
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-21 11:35:04
 * 文章内容页面
 */

// 引入公用模块
import "./components/common";
// 内容侧边标题导航
import ContentFixNav from "./components/content-nav";
// api接口
import { CONENT_APIS } from "./api";

$(function() {
  // 内容信息
  const $contentInfo = $("#content-info");
  const MODELID = $contentInfo.data("model"),
    SOFTID = $contentInfo.data("id");

  // 内容目录导航
  const $frView = $(".fr-view"),
    $contentH =
      $(".fr-view .intro").length > 0
        ? $(".fr-view .intro")
        : $(".fr-view h3").length > 0
        ? $(".fr-view h3")
        : $(".fr-view .t_h3");
  const descTop = $("section.content").offset().top - window.innerHeight / 2;
  new ContentFixNav($frView, $contentH, {
    scrollT: 0,
    showTop: descTop
  });

  // 添加足迹
  $(window).one("scroll", function() {
    setTimeout(function() {
      $.ajax({
        url: CONENT_APIS.stat + MODELID + "/" + SOFTID,
        type: "GET",
        success: function() {
          return;
        }
      });
    }, 1000);
  });
});
