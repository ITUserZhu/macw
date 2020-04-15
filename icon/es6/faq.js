import "./components/common";
import { toggleActive } from "./util";
$(function() {
  $(window).on("load hashchange", function() {
    var _hash = window.location.hash.replace("#", ""),
      parentIndex;
    if (!_hash) {
      window.location.href = "#0";
      _hash = "0";
    }
    $("aside")
      .find("a")
      .removeClass("active");
    toggleActive([
      $("aside")
        .find("li")
        .eq(_hash),
      $("aside")
        .find("li")
        .eq(_hash)
        .find("a")
        .eq(0),
      $("article ul")
        .children("li")
        .eq(_hash),
      $("article ul")
        .children("li")
        .eq(_hash)
        .find(".content")
        .eq(0)
    ]);
  });

  $("aside .nav").on("click", "a", function() {
    var curIndex = $(this).index(),
      parentIndex = $(this)
        .closest("li")
        .index();
    $(this)
      .closest("ul")
      .find("a")
      .removeClass("active");
    toggleActive([
      $(this),
      $(this).closest("li"),
      $("article ul")
        .children("li")
        .eq(parentIndex),
      $("article ul")
        .children("li")
        .eq(parentIndex)
        .find(".content")
        .eq(curIndex)
    ]);
  });
});
