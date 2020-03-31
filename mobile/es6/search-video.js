import "./common/index";
import listLoad from "./list/index";

$(() => {
  const $headerForm = $(".header-search");
  const $form = $headerForm.find("form");
  const $cancel = $headerForm.find(".cancel");
  const $history = $(".history-box");
  const $noHistory = $(".no-history");
  const $delHistory = $(".del-history");
  let historySearches = [];

  let getHistoryItems = () => {
    window.localStorage.getItem("history_search_v") &&
      (historySearches = JSON.parse(
        window.localStorage.getItem("history_search_v")
      ));

    if (historySearches.length > 0) {
      $history.empty();
      $.each(historySearches, (index, element) => {
        index < 10 &&
          $history.prepend(
            `<a href="/search/vall_${element}.html">${element}</a>`
          );
        $noHistory.hide();
      });
    } else {
      $history.empty();
      $noHistory.show();
    }
  };

  $history.length && getHistoryItems();

  $form.on("submit", function(e) {
    e.preventDefault();
    let val = $(this)
      .find("input[type='text']")
      .val()
      .trim();

    let type = $(this)
      .find("input[type='hidden']")
      .val();

    if (val.length) {
      historySearches.indexOf(val) === -1 && historySearches.push(val);
      window.localStorage.setItem(
        "history_search_v",
        JSON.stringify(historySearches)
      );

      window.location.href = `/search/${type}_${val}.html`;
    }
  });

  $delHistory.on("click", () => {
    historySearches = [];
    window.localStorage.setItem("history_search_v", "");
    getHistoryItems();
  });

  // 返回
  let referUrl = document.referrer;
  if (referUrl.indexOf("macw") > 0 && referUrl.indexOf("/search") < 0) {
    window.sessionStorage.refer = referUrl;
  } else {
    !window.sessionStorage.refer &&
      (window.sessionStorage.refer = "https://m.macw.com/");
  }

  $cancel.on("click tap", () => {
    window.location.href = window.sessionStorage.refer;
  });

  // 滚动加载
  const $dataInfo = $("#video-infos");
  const dataTotal = $dataInfo.data("total");
  const dataType = $dataInfo.data("type");

  let ajaxData = {
    page: 1,
    model: $dataInfo.data("model"),
    keyword: $dataInfo.data("keyword"),
    type: dataType
  };

  const $dom = $(".search-result"),
    $wrap = $dom.find("ul").last();

  // 滚动加载功能调用
  listLoad($dom, $wrap, ajaxData, dataType);
});
