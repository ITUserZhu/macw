/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-20 09:18:49 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-01-02 10:46:34
 * 登录注册弹框功能板块
 */
// 调用序列号表单
import '../plugins/serialize';
// 调用api
import {
  LOGIN_APIS
} from '../api';
// 调用工具
import {
  phoneReg,
  codeReg,
  toggleActive
} from '../util';

// 登录框功能
let loginHtml = `
  <div id="login-wrap">
     <div class="login-box">
         <div class="login-content">
             <div class="close-login">X</div>
             <p class="title-type">
                 <span class="active">登录</span>
                 <span>登录</span>
                 <span>注册</span>
                 <span>忘记密码</span>
             </p>
             <div class="form-box">
                 <div class="other-login active">
                     <div class="third-login wx" data-type="wx"><i class="icon-wx"></i>微信<span>登录</span><em>注册</em></div>
                     <div class="third-login qq" data-type="qq"><i class="icon-qq2"></i>QQ<span>登录</span><em>注册</em></div>
                     <div class="phone-login"><i class="icon-phone"></i>手机登录</div>
                     <div class="phone-reg"><i class="icon-phone"></i>手机注册</div>
                     <p class="check-type check-to-reg">没有账号?<a >立即注册</a></p>
                     <p class="check-type check-to-login">已有账号?<a >立即登录</a></p>
                 </div>
                 <form id="login-form">
                     <fieldset>
                         <input type="text" name="username" placeholder="请输入手机号码" minlength="11" maxlength="11">
                     </fieldset>
                     <fieldset>
                         <input type="password" name="password" placeholder="请输入密码" minlength="6">
                     </fieldset>
                     <p class="check-login">
                         <span class="forgit-pswd">忘记密码?</span>
                     </p>
                     <button class="login-btn">登录</button>
                     <p class="login-tips"></p>
                     <p class="check-type login-check-other"><a  class="fl">第三方登录</a> <span class="fr">没有账号?<a >立即注册</a></span></p>
                 </form>
                 <form id="reg-form">
                     <fieldset>
                         <input type="text" name="phone" placeholder="请输入手机号码" minlength="11" maxlength="11">
                     </fieldset>
                     <fieldset>
                         <input type="text" name="phone_code" placeholder="请输入短信验证码" class="note-ipt" minlength="6" maxlength="6">
                         <span class="get-note">获取验证码</span>
                     </fieldset>
                     <fieldset>
                         <input type="password" name="pswd" placeholder="请输入密码" minlength="6">
                     </fieldset>
                     <fieldset>
                         <input type="password" name="repswd" placeholder="重复密码" minlength="6">
                     </fieldset>
                     <button class="reg-btn">注册</button>
                     <p class="login-tips"></p>
                     <p class="check-type reg-check-other"><a  class="fl">第三方注册</a> <span class="fr">已有账号?<a >立即登录</a></span></p>
                 </form>
                 <form id="reset-form">
                     <fieldset>
                         <input type="text" name="phone" placeholder="请输入手机号码" minlength="11" maxlength="11">
                     </fieldset>
                     <fieldset>
                         <input type="text" name="phone_code" placeholder="请输入短信验证码" class="note-ipt" minlength="6" maxlength="6">
                         <span class="get-note">获取验证码</span>
                     </fieldset>
                     <fieldset>
                         <input type="password" name="pswd" placeholder="请输入新密码" minlength="6">
                     </fieldset>
                     <fieldset>
                         <input type="password" name="repswd" placeholder="请确认新密码" minlength="6">
                     </fieldset>
                     <button class="reset-btn">确定</button>
                     <p class="login-tips"></p>
                     <p class="check-type back-login">
                         <em>返回登陆</em>
                     </p>
                 </form>
             </div>
         </div>
     </div>
 </div>`;

class Login {
  constructor() {
    this.captchaNum = '2050354954';
    this.sendingCode = false;
  }

  init() {
    if (!$('#login-wrap').length) {
      $('main').append(loginHtml);
      this.initDom();

      this.initEvent();
    }
    return this;
  }

  initDom() {
    this.loginDom = $('#login-wrap');
    this.loginType = this.loginDom.find('.title-type').children();
    this.formList = this.loginDom.find('.form-box').children();
    this.loginForm = this.loginDom.find('#login-form');
    this.regForm = this.loginDom.find('#reg-form');
    this.resetForm = this.loginDom.find('#reset-form');
  }

  initEvent() {
    this.loginDom.on('click', '.close-login', () => {
        this.loginDom.hide()
      })
      .on('click', '.login-check-other .fl', () => {
        this.showLogin();
      })
      .on('click', '.reg-check-other .fl', () => {
        this.showLogin(0, 1);
      })
      .on('click', '.forgit-pswd', () => {
        this.showLogin(3);
      })
      .on('click', '.to-reg, .check-to-reg, .login-check-other span a, .phone-reg', () => {
        this.showLogin(2);
      })
      .on('click', '.to-login, .phone-login, .check-to-login a, .reg-check-other span a, .back-login em', () => {
        this.showLogin(1);
      })
      .on('click', '.get-note', this.sendNoteCode.bind(this))
      .on('click', '.third-login', this.thirdLogin.bind(this))
      .on('change', 'form', this.watchInput.bind(this))

    this.loginForm.on('submit', this.toLoginIn.bind(this));
    this.regForm.on('submit', this.toRegIn.bind(this));
    this.resetForm.on('submit', this.toResetIn.bind(this));
  }

  // 监测输入修改验证码状态
  watchInput(e) {
    const target = $(e.target);
    if (target.attr('name') == 'phone') {
      let val = target.val(),
        tip = target.closest('form').find('.login-tips');
      tip.text('');
      target.parent().next().find('.get-note').removeClass('active');
      if (!phoneReg(val)) {
        tip.text('手机号格式错误！');
        return false;
      } else {
        target.parent().next().find('.get-note').addClass('active');
      }
    }
  }

  //登录
  toLoginIn(e) {
    e.preventDefault();
    let _this = this;
    const loginData = $(e.target).serializeObject();

    if (this.regUsername(loginData, $(e.target))) {
      let captchaObj = new TencentCaptcha(_this.captchaNum, function (res) {
        if (res.ret === 0) {
          loginData.ticket = res.ticket;
          loginData.randstr = res.randstr;
          _this.loginGo(loginData);
        }
      }, {})
      captchaObj.show()
    }
    return false;
  }

  loginGo(data) {
    $.ajax({
        url: LOGIN_APIS.login_go,
        type: 'POST',
        data,
      })
      .done(function (res) {
        if (res.code == 200) {
          window.location.reload();
        } else {
          alert(res.msg)
        }
      })
      .fail(function (error) {
        console.log(error);
      })

  }

  // 第三方登录
  thirdLogin(e) {
    let type = $(e.target).closest('span').data('type'),
      newWindow;

    let thirdUrl = type == 'wx' ? LOGIN_APIS.wx_login : LOGIN_APIS.qq_login;

    if (newWindow) {
      newWindow.close();
    };

    let iWidth = 750,
      iHeight = 500,
      winWidth = $(window).width(),
      winHeight = $(window).height(),
      iTop = (winHeight - iHeight) / 2,
      iLeft = (winWidth - iWidth) / 2;
    newWindow = window.open(thirdUrl, '第三方安全登录', 'width=' + iWidth + ', height=' + iHeight + ', top=' + iTop + ', left=' + iLeft);

    setInterval(function () {
      var _cookie = document.cookie.match(/(qq_refersh_time=1)|(wx_refersh_time=1)/gi);
      if (_cookie) {
        newWindow.close();
        document.cookie = 'qq_refersh_time=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/';
        document.cookie = 'wx_refersh_time=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/';
        window.location.reload();
      }
    }, 2000);
  }

  //注册
  toRegIn(e) {
    e.preventDefault();
    const loginData = $(e.target).serializeObject();

    if (this.regUsername(loginData, $(e.target))) {
      let data = {
        verification_code: loginData.phone_code,
        phone: loginData.phone,
        password: loginData.repswd,
        type: 1
      };

      $.ajax({
          url: LOGIN_APIS.reg,
          type: 'POST',
          data,
        })
        .done(function (res) {
          if (res.code == 200) {
            window.location.reload();
          } else {
            $(e.target).find('.login-tips').text(res.msg)
          }
        })
        .fail(function (error) {
          console.log(error);
        })
    }
    return false;
  }
  //重置密码
  toResetIn(e) {
    let _this = this;
    e.preventDefault();
    const loginData = $(e.target).serializeObject();
    if (this.regUsername(loginData, $(e.target))) {
      console.log('ok');
      $.ajax({
          url: LOGIN_APIS.rset_code,
          type: 'POST',
          data: {
            password: loginData.repswd,
            phone: loginData.phone,
            verification_code: loginData.phone_code,
          },
        })
        .done(function (res) {
          if (res.code == 200) {
            alert('修改成功！');
            _this.showLogin(1);
          } else {
            alert(res.msg)
          }
        })
        .fail(function (error) {
          console.log(error);
        })
    }
    return false;
  }

  // 发送验证码按钮
  sendNoteCode(e) {
    const target = $(e.target);
    if (!target.hasClass('active')) return;

    let _this = this,
      phone = target.parent().prev().find('input').val(),
      el = target.closest('form').find('.login-tips'),
      type = target.closest('form').attr('id') == 'reg-form' ? 'reg' : 'forgit';

    if (!phone) return;

    let captchaObj = new TencentCaptcha(_this.captchaNum, function (res) {
      if (res.ret === 0) {
        let data = {
          phone,
          ticket: res.ticket,
          randstr: res.randstr
        };
        _this.sendPhoneAjax(data, type, target, el);
      }
    }, {})
    captchaObj.show()

  }
  // 发送手机验证码
  sendPhoneAjax(data, type, target, tip) {
    let _this = this,
      url = type == 'reg' ? LOGIN_APIS.phone_reg : LOGIN_APIS.send_note;

    $.ajax({
        url,
        type: 'POST',
        data,
      })
      .done(function (res) {
        if (res.code == 200) {
          _this.sendingCode = true;
          _this.timerInter(target);

        } else {
          tip.text(res.msg);
        }
      })
      .fail(function (error) {
        console.log(error);
      })
  }

  // 获取验证倒计时
  timerInter(el) {
    let self = this,
      timer,
      num = 60;

    el.text(`重新发送(${num--})`).removeClass('active');

    timer = setInterval(function () {
      el.text(`重新发送(${num--})`);
      if (!self.sendingCode) {
        clearInterval(timer);
        el.text('发送验证码').addClass('active');
      }
      if (num < 0) {
        clearInterval(timer);
        el.text('重新发送').addClass('active');
        self.sendingCode = false;
      }
    }, 1000);
  };

  regUsername(obj, dom) {
    let tip = dom.find('.login-tips');
    for (let k in obj) {
      if (obj[k] === '') {
        tip.text('输入不能为空！');
        return false;
      }
    };

    if (!!obj.phone && !phoneReg(obj.phone)) {
      tip.text('手机号格式错误！');
      return false;
    }

    if (!!obj.username && !phoneReg(obj.username)) {
      tip.text('手机号格式错误！');
      return false;
    }

    if (!!obj.phone_code && !codeReg(obj.phone_code)) {
      tip.text('短信验证码错误！');
      return false;
    }

    if (!!obj.repswd && obj.repswd !== obj.pswd) {
      tip.text('两次密码必须一致！');
      return false;
    }

    tip.text('');
    return true;
  }

  showLogin(type = 0, isreg) {
    this.loginDom.show();

    this.cleanForm();

    toggleActive([this.loginType.eq(type), this.formList.eq(type)]);

    if (type == 0 && isreg) {
      this.formList.eq(0).addClass('reg');
      toggleActive(this.loginType.eq(2));
    } else {
      this.formList.eq(0).removeClass('reg')
    }

  }

  cleanForm() {
    this.loginDom.find('input').val('');
    this.loginDom.find('.login-tips').text('');
  }

}

const login = new Login();

export {
  login as toLoginType
}