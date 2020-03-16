import "./common/index";

$(() => {
  const $headerForm = $(".header-search");
  const $form = $headerForm.find("form");
  const $cancel = $headerForm.find(".cancel");
  const $history = $(".history-box");
  const $noHistory = $(".no-history");
  const $delHistory = $(".del-history");
  let historySearches = [];

  let getHistoryItems = () => {
    window.localStorage.getItem("history_search") &&
      (historySearches = JSON.parse(
        window.localStorage.getItem("history_search")
      ));

    if (historySearches.length > 0) {
      $history.empty();
      $.each(historySearches, (index, element) => {
        index < 10 &&
          $history.prepend(`<a href="/search/mac/${element}">${element}</a>`);
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
        "history_search",
        JSON.stringify(historySearches)
      );

      window.location.href = `/search/${type}/${val}`;
    }
  });

  $delHistory.on("click", () => {
    historySearches = [];
    window.localStorage.setItem("history_search", "");
    getHistoryItems();
  });

  // 返回
  let referUrl = document.referrer;
  if (referUrl.indexOf("macw") > 0 && referUrl.indexOf("/search/") < 0) {
    window.sessionStorage.refer = referUrl;
  } else {
    !window.sessionStorage.refer &&
      (window.sessionStorage.refer = "https://m.macw.com/");
  }

  $cancel.on("click tap", () => {
    window.location.href = window.sessionStorage.refer;
  });
});
