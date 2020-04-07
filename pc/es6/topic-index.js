/*
 * @Author: Liliang Zhu
 * @Date: 2020-02-12 10:53:57
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-02-12 11:35:42
 * 专题首页
 */

// 引入公用模块
import "./components/common";
// 引入工具

import { toggleActive } from "./util";

$(function() {
  const $topicClassify = $(".topic-classify"),
    $nav = $topicClassify.find(".classify-nav").children("a"),
    $lis = $topicClassify.find("ul").children("li");
  $nav.on("mouseenter", function(e) {
    var _index = $(this).index();
    toggleActive([$(this), $lis.eq(_index)]);
  });
});
