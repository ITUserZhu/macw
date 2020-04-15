import {
  LOGIN_REG
} from "../api";

const loginHtml = `<div class="login-mask">
        <div class="login-outer">
            <div class="round-bg"><i></i><i></i><i></i><i></i><i></i><i></i></div>
            <div class="login-close">X</div>
            <div class="login-main">
                <hgroup>
                    <span class="login-type-btn active">登录</span>
                    <span class="login-type-btn">注册</span>
                </hgroup>  
                <div class="login-forms">
                    <form class="form-login active">
                        <fieldset>
                            <i class="icon-admin"></i>
                            <input type="text" name="username" placeholder="输入手机号">
                        </fieldset>
                        <fieldset>
                            <i class="icon-lock"></i>
                            <input type="password" name="password" placeholder="输入密码" minlength="6">
                        </fieldset>
                        <p>
                            <span class="check-forgot">忘记密码?</span>
                        </p>
                        <button class="login-btn">登录</button>
                        <p class="login-tip"></p>
                    </form>
                    <form class="form-reg">
                        <fieldset>
                            <input type="text" name="param" placeholder="输入手机号码">
                        </fieldset>
                        <fieldset>
                            <input type="text" name="code" placeholder="输入验证码" class="note-ipt" minlength="6" maxlength="6">
                            <span class="get-note">获取验证码</span>
                        </fieldset>
                        <fieldset>
                            <input type="password" name="password" placeholder="输入密码" minlength="6">
                        </fieldset>
                        <fieldset>
                            <input type="password" name="repswd" placeholder="确认密码" minlength="6">
                        </fieldset>
                        <button class="reg-btn">注册</button>
                        <p class="login-tip"></p>
                    </form>
                    <form class="form-forgot">
                        <fieldset>
                            <input type="text" name="user" placeholder="输入手机号码">
                        </fieldset>
                        <fieldset>
                            <input type="text" name="verification_code" placeholder="输入验证码" class="note-ipt" minlength="6" maxlength="6">
                            <span class="get-note">获取验证码</span>
                        </fieldset>
                        <fieldset>
                            <input type="password" name="password" placeholder="输入新密码" minlength="6">
                        </fieldset>
                        <fieldset>
                            <input type="password" name="repswd" placeholder="确认新密码" minlength="6">
                        </fieldset>
                        <button class="reset-btn">确定</button>
                        <p class="login-tip"></p>
                    </form>
                </div>
                <div class="login-third">
                    <p class="third-type">
                        <span class="active">第三方登录</span>
                        <span>第三方注册</span>
                    </p>
                    <div class="third-login">
                        <div class="third-btn third-qq">
                            <span><i class="icon-qq"></i></span>
                            <p>QQ</p>
                        </div>
                        <div class="third-btn third-wx">
                            <span><i class="icon-wx"></i></span>
                            <p>微信</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

class Login {
  constructor(api, html) {
    this.loginHtml = html;
    this.api = api;
    this.captchaNum = "2050354954";
    this.sendingCode = false;
  }
  // 初始化
  init() {
    if (!$(".login-mask").length) {
      $("main").append(this.loginHtml);
      this.$loginMask = $(".login-mask");
      this.loginDom = {
        $close: this.$loginMask.find(".login-close"),
        $checkBtn: this.$loginMask.find(".login-type-btn"),
        $loginForm: this.$loginMask.find(".form-login"),
        $regForm: this.$loginMask.find(".form-reg"),
        $forgotForm: this.$loginMask.find(".form-forgot"),
        $checkForgot: this.$loginMask.find(".check-forgot"),
        $checkThirdType: this.$loginMask.find(".third-type").children("span"),
        $thirdLogin: this.$loginMask.find(".third-login")
      };
      this.initEvent();
    }
    return this;
  }

  initEvent() {
    // 切换注册登录按钮
    this.loginDom.$checkBtn.on("click", e => {
      let _index = $(e.target).index();
      this.showLoginType(_index == 0 ? "login" : "reg");
    });
    // 关闭按钮
    this.loginDom.$close.on("click", () => {
      this.$loginMask.hide();
    });
    // 切换忘记密码
    this.loginDom.$checkForgot.on("click", () => {
      this.showLoginType("forgot");
    });
    // 点击登录
    this.loginDom.$loginForm.on("submit", e => {
      e.preventDefault();
      const data = $(e.target).serializeObject();
      const _this = this;
      if (_this.checkingData(data, $(e.target))) {
        let captchaObj = new TencentCaptcha(
          _this.captchaNum,
          function (res) {
            if (res.ret === 0) {
              data.ticket = res.ticket;
              data.randstr = res.randstr;
              _this.loginGo(data);
            }
          }, {}
        );
        captchaObj.show();
      }
    });

    // 获取验证码
    this.$loginMask.on("click", ".get-note", e => {
      const $target = $(e.target);
      if (!$target.hasClass("active")) return;

      const $ipt = $target
        .parent()
        .prev()
        .find("input");
      const _this = this;
      let data = {
        [$ipt.attr("name")]: $ipt.val()
      };
      if (_this.checkingData(data, $target.closest("form"))) {
        let captchaObj = new TencentCaptcha(
          _this.captchaNum,
          function (res) {
            if (res.ret === 0) {
              data.ticket = res.ticket;
              data.randstr = res.randstr;
              _this.sendNote(data, $target);
            }
          }, {}
        );
        captchaObj.show();
      }
    });

    // 提交注册
    this.loginDom.$regForm.on("submit", e => {
      e.preventDefault();
      const _this = this;
      const $target = $(e.target);
      const data = $(e.target).serializeObject();

      if (_this.checkingData(data, $target)) {
        const {
          param,
          code,
          password
        } = data;
        $.ajax({
            url: _this.api.reg_check,
            type: "POST",
            data: {
              param,
              code,
              password
            }
          })
          .done(function (res) {
            if (res.code == 200) {
              window.location.reload();
            } else {
              $target.find(".login-tips").text(res.msg);
            }
          })
          .fail(function (error) {
            console.log(error);
          });
      }
    });

    // 提交忘记密码
    this.loginDom.$forgotForm.on("submit", e => {
      e.preventDefault();

      const _this = this;
      const data = $(e.target).serializeObject();

      if (_this.checkingData(data, $(e.target))) {
        const {
          user,
          verification_code,
          password
        } = data;
        $.ajax({
            url: _this.api.forgot_check,
            type: "POST",
            data: {
              user,
              verification_code,
              password
            }
          })
          .done(function (res) {
            if (res.code == 200) {
              alert("修改成功！请登录");
              _this.showLoginType("login");
            } else {
              $(e.target)
                .find(".login-tips")
                .text(res.msg);
            }
          })
          .fail(function (error) {
            console.log(error);
          });
      }
    });

    // 第三方登录
    this.loginDom.$thirdLogin.on(
      "click",
      ".third-btn",
      this.thirdLogin.bind(this)
    );

    // 监测输入修改验证码按钮状态
    this.$loginMask.on("change", "form", e => {
      const $target = $(e.target);
      const $form = $target.closest("form");
      if ($target.attr("name") === "param" || $target.attr("name") === "user") {
        let val = $target.val(),
          $tip = $form.find("login-tip");
        $tip.val("");
        if (this.checkingData({
            user: val
          }, $form)) {
          $form.find(".get-note").addClass("active");
        } else {
          $form.find(".get-note").removeClass("active");
        }
      }
    });
  }

  // 获取验证码
  sendNote(data, dom) {
    const _this = this;
    const $form = dom.closest("form");
    let ajxUrl = $form.hasClass("form-reg") ? this.api.reg : this.api.forgot;

    $.ajax({
        url: ajxUrl,
        type: "POST",
        data
      })
      .done(function (res) {
        if (res.code == 200) {
          _this.sendingCode = true;
          _this.timerInterBtn(dom);
        } else {
          $form.find(".login-tip").text(res.msg);
        }
      })
      .fail(function (error) {
        console.log(error);
      });
  }

  // 登录请求
  loginGo(data) {
    const _this = this;
    $.ajax({
        url: _this.api.login_go,
        type: "POST",
        data
      })
      .done(function (res) {
        if (res.code == 200) {
          window.location.reload();
        } else {
          alert(res.msg);
        }
      })
      .fail(function (error) {
        console.log(error);
      });
  }
  // 第三方登录
  thirdLogin(e) {
    let type = $(e.target)
      .closest(".third-btn")
      .hasClass("third-wx") ?
      "wx" :
      "qq",
      newWindow;

    let thirdUrl = type == "wx" ? this.api.wx_login : this.api.qq_login;

    if (newWindow) {
      newWindow.close();
    }

    let iWidth = 750,
      iHeight = 500,
      winWidth = $(window).width(),
      winHeight = $(window).height(),
      iTop = (winHeight - iHeight) / 2,
      iLeft = (winWidth - iWidth) / 2;
    newWindow = window.open(
      thirdUrl,
      "第三方安全登录",
      "width=" +
      iWidth +
      ", height=" +
      iHeight +
      ", top=" +
      iTop +
      ", left=" +
      iLeft
    );

    setInterval(function () {
      var _cookie = document.cookie.match(
        /(qq_refersh_time=1)|(wx_refersh_time=1)/gi
      );
      if (_cookie) {
        newWindow.close();
        document.cookie =
          "qq_refersh_time=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/";
        document.cookie =
          "wx_refersh_time=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/";
        window.location.reload();
      }
    }, 2000);
  }

  // 切换当前展示
  showLoginType(type) {
    this.$loginMask.show();
    this.resetForm();
    switch (type) {
      case "login":
        this.toggleActive([
          this.loginDom.$checkBtn.eq(0),
          this.loginDom.$checkThirdType.eq(0),
          this.loginDom.$loginForm
        ]);
        break;
      case "reg":
        this.toggleActive([
          this.loginDom.$checkBtn.eq(1),
          this.loginDom.$checkThirdType.eq(1),
          this.loginDom.$regForm
        ]);
        break;
      case "forgot":
        this.toggleActive([
          this.loginDom.$checkBtn.removeClass("active"),
          this.loginDom.$checkThirdType.eq(0),
          this.loginDom.$forgotForm
        ]);
        break;
      default:
        break;
    }
  }
  // 初始form表单数据
  resetForm() {
    this.sendingCode = false;
    this.$loginMask
      .find("form")
      .each((i, v) => {
        v.reset();
        $(v)
          .find(".login-tip")
          .text("");
      })
      .find(".get-note")
      .removeClass("active");
  }

  // 获取验证码按钮效果
  timerInterBtn(el) {
    let _this = this,
      timer,
      num = 60;

    el.text(`重新发送(${num--})`).removeClass("active");

    timer = setInterval(function () {
      el.text(`重新发送(${num--})`);
      if (!_this.sendingCode) {
        clearInterval(timer);
        el.text("发送验证码").addClass("active");
      }
      if (num < 0) {
        clearInterval(timer);
        el.text("重新发送").addClass("active");
        _this.sendingCode = false;
      }
    }, 1000);
  }

  // 判断数据格式
  checkingData(obj, dom) {
    let tip = dom.find(".login-tip");
    for (let k in obj) {
      if (obj[k] === "") {
        tip.text("输入不能为空！");
        return false;
      }
    }

    if (!!obj.param && !this._regUsername(obj.param)) {
      tip.text("手机号格式错误！");
      return false;
    }

    if (!!obj.username && !this._regUsername(obj.username)) {
      tip.text("手机号格式错误！");
      return false;
    }

    if (!!obj.user && !this._regUsername(obj.user)) {
      tip.text("手机号格式错误！");
      return false;
    }

    if (!!obj.verification_code && !this._regPhoneCode(obj.verification_code)) {
      tip.text("短信验证码错误！");
      return false;
    }

    if (!!obj.repswd && obj.repswd !== obj.password) {
      tip.text("两次密码必须一致！");
      return false;
    }

    tip.text("");
    return true;
  }

  _regUsername(val) {
    const ret = /^1[3456789]\d{9}$/;
    // const rets = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (ret.test(val)) {
      return true;
    } else {
      return false;
    }
  }

  _regPhoneCode(val) {
    const ret = /^\d{6}$/;
    if (ret.test(val)) {
      return true;
    } else {
      return false;
    }
  }

  // 切换当前选中
  toggleActive(el, active = "active") {
    if (typeof el === "object") {
      $(el).each(function (index, ele) {
        $(ele)
          .addClass(active)
          .siblings()
          .removeClass(active);
      });
    } else {
      $(el)
        .addClass(active)
        .siblings()
        .removeClass(active);
    }
  }
}

const login = new Login(LOGIN_REG, loginHtml);

export {
  login as toLoginType
};