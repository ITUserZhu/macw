// 引入动态根字体适配
import "amfe-flexible";

$(() => {
  // 侧边弹出菜单
  const $nav = $("#menu");
  const $fixNav = $(".fix-nav");
  const $navWrap = $fixNav.find(".nav-wrap");

  $nav.on("click tap", () => {
    $fixNav.fadeIn();
    setTimeout(() => {
      $navWrap.addClass("active");
    }, 0);
  });

  $fixNav.on("click tap", e => {
    if (
      $(e.target)
        .closest("div")
        .is(".nav-wrap")
    ) {
      e.stopPropagation();
      return;
    }
    $navWrap.removeClass("active");
    setTimeout(() => {
      $fixNav.fadeOut();
    }, 400);
  });

  // 返回顶部
  const backTopHtml = `<div class="back-top" id="back-top"><span class="icon-arrow"></span></div>`;
  let $backTop = null;

  $(document).on("scroll ", function(e) {
    if ($(this).scrollTop() > 300) {
      if ($backTop) {
        $backTop.fadeIn();
      } else {
        $("main").append(backTopHtml);
        $backTop = $("#back-top");
        $backTop.on("click", () => {
          $("body,html").animate({ scrollTop: 0 }, 400);
        });
      }
    } else {
      $backTop && $backTop.fadeOut();
    }
  });

  // 返回上一页
  const $backPrev = $("header .back-arr");
  $backPrev.on("click tap", () => {
    if (document.referrer.indexOf("m.__host") > 0) {
      window.history.back();
    } else {
      window.location.href = "https://m.__host.com/";
    }
  });

  // 定位导航选中
  const $headNav = $("nav"),
    $navActive = $headNav.find("li.active");
  if ($navActive.length) {
    $headNav.scrollLeft($navActive.offset().left - $(window).width() / 2 + 20);
  }
});

// 百度统计
// (function() {
//   var hm = document.createElement("script");
//   hm.src = "https://hm.baidu.com/hm.js?e921479a4d3e3a69bae8435ee593a209";
//   var s = document.getElementsByTagName("script")[0];
//   s.parentNode.insertBefore(hm, s);
// })();

// 百度推送
(function() {
  var bp = document.createElement("script");
  var curProtocol = window.location.protocol.split(":")[0];
  if (curProtocol === "https") {
    bp.src = "https://zz.bdstatic.com/linksubmit/push.js";
  } else {
    bp.src = "http://push.zhanzhang.baidu.com/push.js";
  }
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(bp, s);
})();
