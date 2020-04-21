import "./components/common";
// 引入自定义方法
import {
  toggleActive,
  commonSearch
} from "./util";
// 引入自定义jq方法
import "./jq-plugins/pack-check";
import {
  AUTOCOMPLETE_API
} from './api';

$(function () {
  // 搜索功能
  const $search = $(".banner-form").find("form");
  const $searchIpt = $search.find('input');
  $search.on("submit", function (e) {
    e.preventDefault();
    let val = $(this)
      .find("input")
      .val();
    commonSearch(val);
  });

  $searchIpt.autocomplete({
    paramName: "keyword",
    transformResult: response => {
      if (response) {
        return {
          suggestions: $.map(JSON.parse(response).data, v => {
            var html_imgs = '';
            v.icon_thumb && v.icon_thumb.forEach(function (vi) {
              html_imgs += '<img src=' + vi + '>';
            });
            return {
              value: v.keyword + '<em>（' + v.icon_total + '）</em>' + html_imgs,
              data: v.keyword
            }
          })
        };
      } else {
        return {
          suggestions: {}
        };
      }
    },
    deferRequestBy: 500,
    type: "POST",
    preserveInput: true,
    serviceUrl: AUTOCOMPLETE_API.data,
    onSelect: val => val.data && commonSearch(val.data)
  });

  // 推荐切换
  const $checkNav = $(".check-nav").children("h3");
  const $checkItem = $(".icon-items").children("ul");
  const $checkMore = $(".pack-more").children("a");

  // 点击切换
  $checkNav.on("click", function () {
    let _index = $(this).index();
    toggleActive([$(this), $checkItem.eq(_index), $checkMore.eq(_index)]);

    // 动态查询图片加载
    $checkItem
      .eq(_index)
      .children("li")
      .each((i, v) => {
        let $img = $(v).find(".img-cover");
        if (!$img.attr("src")) {
          $img.attr("src", $img.data("src"));
        }
      });
  });

  // 注册鼠标悬浮切换事件
  $checkItem
    .on("mouseenter", "li", function () {
      $(this).hoverCheck();
    })
    .on("mouseleave", "li", function () {
      $(this).leaveCheck();
    });
});