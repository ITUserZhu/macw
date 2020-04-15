import {
  LOGIN_REG
} from "../api";
import {
  toggleActive
} from "../util";

const HEAD_LOGIN_HTML = `
    <div class="head-user">
      <div class="acvtor-info">
        <div class="head-img">
          <img src="{ headimg }">
          <span class="icon-vip2 { isVip }"></span>
        </div>
      </div>
      <div class="user-function">
        <div class="user-item user-name">
          <span>{ username }</span>
          <em>积分：{ point }</em>
          <p>ID： { userid }</p>
        </div>
        <ul>
          <li><a href="https://www.macw.com/mac/pm#/admin"><i class="icon-admin"></i>个人主页</a></li>
          <li><a href="https://www.macw.com/mac/pm#/collect"><i class="icon-shop"></i>我的收藏</a></li>
          <li><a href="https://www.macw.com/mac/pm#/download"><i class="icon-down"></i>我的下载</a></li>
          <li><a href="https://www.macw.com/mac/pm#/consume"><i class="icon-vip"></i>消费记录</a></li>
          <li><a href="https://www.macw.com/mac/pm#/news"><i class="icon-tip"></i>消息中心</a></li>
        </ul>
        <div class="user-item down-left">
          <span>VIP图标下载次数</span>
          <em>{ vipnum }</em>
        </div>
        <div class="user-item user-out">
          <i class="icon-out"></i>退出
        </div>
      </div>
    </div>`;

const DEFAULTHEADIMG = "/assets/images/headimg.png";

(function () {
  $.ajax({
    url: LOGIN_REG.is_login,
    type: "POST",
    success: function (res) {
      if (res.code == 200) {
        initHeadLogin(res);
      }
    }
  });

  function initHeadLogin(data) {
    const $loginBox = $(".head-login");
    const $logined = $loginBox.find(".login-logined");

    $logined.append(htmlFormat(data.data));
    toggleActive($logined);

    $logined
      .on("click", ".acvtor-info", function (e) {
        e.stopPropagation();
        $(".head-user").toggleClass("active");
      })
      .on("click", ".user-out", function () {
        $.ajax({
          url: LOGIN_REG.login_out,
          type: "POST",
          success: function (res) {
            if (res.code == 200) {
              window.location.reload();
            } else {
              alert(res.msg);
            }
          }
        });
      });
    $(document).click(e => {
      $(".head-user").removeClass("active");
    });
  }

  function htmlFormat(data) {
    var html = "";

    html += HEAD_LOGIN_HTML.replace(
        "{ isVip }",
        data.vip == 1 ? "vip" : ""
      )
      .replace("{ point }", data.point)
      .replace("{ username }", data.nickname)
      .replace("{ userid }", data.id)
      .replace("{ vipnum }", (data.icon_time - data.surplus_icon_time))
      .replace("{ headimg }", data.headimg || DEFAULTHEADIMG);

    return html;
  }
})();