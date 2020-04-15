import "./components/common";
import { toggleActive } from "./util";
$(function() {
  $(window).on("load hashchange", function() {
    var _hash = window.location.hash.replace("#", "");
    if (!_hash) {
      window.location.href = "#1";
      _hash = "1";
    }
    toggleActive([
      $(".ab" + _hash),
      $(".li-content").eq($(".ab" + _hash).index())
    ]);
  });
});
