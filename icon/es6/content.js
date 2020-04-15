import "./components/common";
import {
  SHOPPING_API,
  DOWNLOAD_API,
  ICON_API
} from "./api";
import {
  toggleActive,
  confirmBox,
  alertBox
} from "./util";
import Recharge from "./components/recharge-box";
import Edit from "./components/edit-icon";

$(function () {
  // 按键监听
  $(document).on("keyup", function (e) {
    const isOverlay = !!$("#detail-overlay").length && $("#detail-overlay").is(":visible");
    let _keyCode = e.keyCode;
    switch (_keyCode) {
      case 37: //键盘左按键
        e.preventDefault();
        if (isOverlay) {
          $(".pjax-item.prev-btn i").trigger("click");
        } else {
          location.href = $(".pjax-item.prev-btn").attr("href");
        }

        break;
      case 39: //键盘右按键
        e.preventDefault();
        if (isOverlay) {
          $(".pjax-item.next-btn i").trigger("click");
        } else {
          location.href = $(".pjax-item.next-btn").attr("href");
        }

        break;
      case 107: //键盘+按键
        e.preventDefault();
        if (!$("#con-shop").hasClass("active")) {
          $("#con-shop").trigger("click");
        }
        break;
      case 109: //键盘-按键
        e.preventDefault();
        if ($("#con-shop").hasClass("active")) {
          $("#con-shop").trigger("click");
        }
        break;
      default:
        break;
    }
  });

  // 收藏功能
  $(document).on("click", "#con-shop", function () {
    const ICON_ID = $("#con-shop").data("id");
    let $this = $(this),
      hasCol = $this.hasClass("active"),
      url = hasCol ? SHOPPING_API.del_icon : SHOPPING_API.add_icon;
    $.ajax({
      url,
      type: "POST",
      data: {
        icon_id: ICON_ID
      }
    }).done(res => {
      if (res.code == 200) {
        $this.toggleClass("active");
      } else if (res.code == 400 || res.code == 500) {
        $(".login-login").trigger("click");
      } else {
        alert(res.msg);
      }
    });
  });
  // 编辑功能
  $(document).on("click", "#icon_edit", function (e) {
    const ICON_ID = $("#con-shop").data("id");
    $.ajax({
      url: ICON_API.status,
      type: "POST",
      data: {
        icon_id: ICON_ID
      }
    }).done(function (res) {
      if (res.code == 200) {
        var opt = new Object();
        opt.icon_id = ICON_ID;
        if (res.data.user_status == 1) {
          opt.isVip = true;
        } else {
          opt.isVip = false;
        }
        new Edit(opt);
      } else if (res.code == 400 || res.code == 500) {
        $(".login-login").trigger("click");
      } else {
        alert(res.msg);
      }
    });
  });

  // 下载按钮点击
  $(document).on("click", ".content-download li", function (e) {
    const ICON_ID = $("#con-shop").data("id");
    let $target = $(e.target),
      $size = $target.closest(".size"),
      type = $(this).data("type");

    let downData = {
      format_type: type,
      ids: ICON_ID
    };

    if ($size.is(".size") || $target.is("input")) {
      e.stopPropagation();
      $target
        .closest(".content-download")
        .find(".size")
        .removeClass("active");

      if ($target.is("p")) {
        toggleActive($target.closest("p"));
        $size.find("input").val($target.closest("p").data("size"));
        return;
      }

      $size
        .find("input")
        .focus()
        .val("")
        .end()
        .toggleClass("active");
      return;
    }
    if (type == "png" || type == "ico") {
      if ($target.find("input").val() <= 0) {
        $target.find("input").val(0);
      } else if ($target.find("input").val() > 256 && type == "ico") {
        $target.find("input").val(256);
      } else if ($target.find("input").val() > 1024 && type == "png") {
        $target.find("input").val(1024);
      }
      downData.size = $target.find("input").val();
    }
    if ($(".login-logined").hasClass("active")) {
      toDownloadIcon(downData);
      // regTimeLeft(downData);
    } else {
      $(".login-login").trigger("click");
    }
  });
  // 普通用户判断次数剩余
  // function regTimeLeft(data) {
  //   const VIP_TYPE = $("#con-shop").data("type");
  //   $.ajax({
  //     url: DOWNLOAD_API.time_left,
  //     type: "POST"
  //   }).done(res => {
  //     if (res.code == 200) {
  //       if (res.user_list.package_id == 1 && VIP_TYPE == 0) {
  //         confirmBox(
  //           `<div class="downleft">
  // 						<p>今日免费图标下载次数剩余<em>${res.surplus_icon_time}</em>次</p>
  // 						<span><a href="/vip.html">想要获取无限下载？</a>升级会员，免费图标任意下载</span>
  // 					</div>`,
  //           function () {
  //             toDownloadIcon(data);
  //           }, {
  //             title: "提示",
  //             closeIcon: true,
  //             buttons: {
  //               sure: {
  //                 text: "下载",
  //                 btnClass: "btn-blue"
  //               },
  //               cancel: {
  //                 text: "升级会员",
  //                 btnClass: "btn-orange",
  //                 action: function () {
  //                   location.href = "/vip.html";
  //                 }
  //               }
  //             }
  //           }
  //         );
  //       } else {
  //         toDownloadIcon(data);
  //       }
  //     } else if (res.code == 400 || res.code == 500) {
  //       $(".login-login").trigger("click");
  //     } else {
  //       alertBox(res.msg);
  //     }
  //   });
  // }
  let recharge;
  // 下载方法
  function toDownloadIcon(data) {
    $.ajax({
      url: DOWNLOAD_API.download,
      type: "POST",
      data
    }).done(res => {
      if (res.code == 200) {
        if (data.format_type == "base64") {
          $.dialog({
            title: "base64&svg",
            boxWidth: "30%",
            type: "dark",
            useBootstrap: false,
            content: `<div class="base64-box">
								<p>base64</p>
								<textarea class="base-area"></textarea>
								<p>svg代码</p>
								<textarea class="svg-area"></textarea>
							</div>`,
            onContentReady: function () {
              let self = this;
              self.$content.find(".base-area").val(res.data);
              self.$content.find(".svg-area").val(atob(res.data));
              self.$content.find("textarea").on("click", function () {
                $(this).select();
                document.execCommand("Copy", true);
                alertBox("已复制到剪贴板");
              });
            }
          });
          return;
        }
        location.href = res.url;
      } else if (res.code == 10005) {
        if (!recharge) {
          recharge = new Recharge(res);
        }
        recharge.init();
      } else {
        alertBox(res.msg);
      }
    });
  }

  $(document).on("click", () => {
    $(this)
      .find(".content-download .size")
      .removeClass("active");
    const $pngIpt = $(".more-size.png").find("input");
    const $icoIpt = $(".more-size.ico").find("input");
    if ($pngIpt.val() == "") {
      $pngIpt.val(
        $pngIpt
        .next()
        .find(".active")
        .text()
      );
    }
    if ($icoIpt.val() == "") {
      $icoIpt.val(
        $icoIpt
        .next()
        .find(".active")
        .text()
      );
    }
  });
});