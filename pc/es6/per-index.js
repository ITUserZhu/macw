/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-21 13:35:15 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-01-02 16:32:16
 * 个人中心
 */

// 公用板块
import './components/common';
// 引入生成二维码脚本
import QRcode from 'qrcode';
// api接口
import {
  USER_APIS,
  VIP_APIS
} from './api';
// 引入工具
import * as UTIL from './util';
// 引入序列号表单
import './plugins/serialize';
// 引入省级联动脚本
import './plugins/city-select';
// 引入瀑布流脚本
import './plugins/waterfall';
// 引入抽奖
import Lottery from './components/lottery';

// 个人中心
$(() => {
  class PersonalOperate {
    constructor() {
      this.init()
    }

    init() {
      this.initVals();
      this.initDomHooks();
      this.initHtmls();
    }

    // 初始化 声明
    initVals() {
      // 收藏记录
      this.hasGetCol = {
        soft: false,
        plugin: false,
        material: false,
        video: false,
        template: false
      };

      // 下载记录
      this.hasGetDown = {
        soft: false,
        plugin: false,
        material: false,
        video: false,
        template: false
      };
      // 足迹
      this.hasGetHistory = {
        soft: false,
        plugin: false,
        material: false,
        video: false,
        template: false
      };

      // 绑定信息
      this.hasBindCity = false;

      // 充值记录
      this.hasGetRecharge = false;

      // 消费记录
      this.hasGetConsume = false;

      // 分享记录
      this.hasGetShare = false;

      // 优惠券记录
      this.hasGetCoupon = false;

      // 消息中心
      this.hasGetSys = false;
      this.hasGetNews = false;

      this.sendingCode = false;

      // 报错提交
      this.reportedFlag = false;

      this.isPayOkInterval = null;
    }

    // 初始化注册dom元素
    initDomHooks() {
      // 栏目切换
      this.navCheckHooks = {
        asideNav: $('aside').find('ul'),
        articleContents: $('article')
      };

      // 账号信息
      this.adminHook = {
        sign: $('.sign-btn'),
        renew: $('.renew-btn'),
        renewBox: $('#renew-box')
      };

      // 个人资料
      this.infoHook = {
        form: $('#per-info'),
        prov: $('#prov'),
        city: $('#city')
      };

      // 收藏记录
      this.collectHook = {
        nav: $('.collection-nav.collect'),
        content: $('.collection-wrap.collect'),
        contBoxs: $('.collection-wrap.collect').children('div'),

        softUl: $('.collection-wrap.collect').find('.soft ul'),
        pluginUl: $('.collection-wrap.collect').find('.plugin ul'),
        materialUl: $('.collection-wrap.collect').find('.material ul'),
        videoUl: $('.collection-wrap.collect').find('.video ul'),
        templateUl: $('.collection-wrap.collect').find('.template ul'),

        spagi: $('#col-soft-pagi'),
        ppagi: $('#col-plugin-pagi'),
        mpagi: $('#col-material-pagi'),
        vpagi: $('#col-video-pagi'),
        tpagi: $('#col-template-pagi'),
      };

      // 下载记录
      this.downloadHook = {
        nav: $('.collection-nav.download'),
        content: $('.collection-wrap.download'),
        contBoxs: $('.collection-wrap.download').children('div'),

        softUl: $('.collection-wrap.download').find('.soft ul'),
        pluginUl: $('.collection-wrap.download').find('.plugin ul'),
        materialUl: $('.collection-wrap.download').find('.material ul'),
        videoUl: $('.collection-wrap.download').find('.video ul'),
        templateUl: $('.collection-wrap.download').find('.template ul'),

        spagi: $('#down-soft-pagi'),
        ppagi: $('#down-plugin-pagi'),
        mpagi: $('#down-material-pagi'),
        vpagi: $('#down-video-pagi'),
        tpagi: $('#down-template-pagi'),
      };

      // 足迹dom
      this.historyHook = {
        nav: $('.collection-nav.history'),
        content: $('.collection-wrap.history'),
        contBoxs: $('.collection-wrap.history').children('div'),

        softUl: $('.collection-wrap.history').find('.soft ul'),
        pluginUl: $('.collection-wrap.history').find('.plugin ul'),
        materialUl: $('.collection-wrap.history').find('.material ul'),
        videoUl: $('.collection-wrap.history').find('.video ul'),
        templateUl: $('.collection-wrap.history').find('.template ul'),

        spagi: $('#hist-soft-pagi'),
        ppagi: $('#hist-plugin-pagi'),
        mpagi: $('#hist-material-pagi'),
        vpagi: $('#hist-video-pagi'),
        tpagi: $('#hist-template-pagi'),
      };

      // 账号绑定与更换
      this.phoneBindHook = {
        btn: $('#bind-change'),
        box: $('#bind-change-phone'),
        bind: $('#bind-phone'),
        change: $('#change-phone')
      };

      // 消息中心
      this.newsHook = {
        nav: $('.news-nav'),
        con: $('.news-wrap'),
        _form: $('#news-support'),
        pagi: $('#report-pagi'),
        table: $('#report-table')
      };
      // 系统消息
      this.sysHooks = {
        pagi: $('#sysinfo-pagi'),
        table: $('#sysinfo-table')
      }
      // 消费记录
      this.consumeHook = {
        form: $('#consume-form'),
        pagi: $('#consume-pagi'),
        table: $('#consume-table')
      };

      // 充值记录
      this.rechargeHook = {
        form: $('#recharge-form'),
        pagi: $('#recharge-pagi'),
        table: $('#recharge-table')
      };

      // 优惠券
      this.couponHook = {
        nav: $('#coupon-nav'),
        wrap: $('#coupon-wrap'),
        pagi: $('#coupon-pagi')
      };

      // 分享记录
      this.shareHook = {
        table: $('#share-table'),
        pagi: $('#share-pagi')
      }

      this.modelsBox = $('#model-ids');

      // 模型id
      this.modelIds = {
        mac: this.modelsBox.data('mac'),
        plugin: this.modelsBox.data('plugin'),
        template: this.modelsBox.data('template'),
        video: this.modelsBox.data('video'),
        material: this.modelsBox.data('material'),
      }

      // 公共翻页元素
      this.pagiDom = $('.ajax-pagination');
      this.loadingImg = '/assets/images/vip/loadcode.gif';
      this.captchaNum = '2050354954';
      this.initPagiEvent();
      this.initAdminEvent();
    }

    initHtmls() {
      this.noContentTrHtml = '<tr class="no-data"><td colspan="5">暂无数据</td></tr>';
      this.noContentLiHtml = '<p class="no-data-show">暂无数据</p>';
      this.reportHtml = `
				<tr>
					<td><a href="{{ url }}">{{ url }}</a></td>
					<td>{{ type }}</td>
					<td>{{ content }}</td>
					<td>{{ time }}</td>
				</tr>
			`;
      this.sysInfoHtml = `
				<tr>
					<td>{{ time }}</td>
					<td>系统消息</td>
					<td>{{ content }}</td>
				</tr>
			`;

      // 消费记录
      this.consumeHtml = `
				<tr>
					<td>{{ content }}</td>
					<td>{{ time }}</td>
					<td>{{ type }}</td>
					<td>{{ point }}积分</td>
				</tr>
			`;

      this.rechargeHtml = `
				<tr>
					<td>{ type }</td>
					<td>{ time }</td>
					<td>{ pay_type }</td>
					<td>{ price }元</td>
					<td>{ content }</td>
				</tr>
			`;

      // 收藏下载足迹模板
      this.softHtml = `
        <li data-id="{{ id }}">
          <div class="del">X</div>
          <a href="{{ url }}">
            <div class="img-wrap">
              <div class="bg"><img src="{{ thumbs }}"></div>
              <div class="img">
                <img src="{{ thumb }}">
              </div>
            </div>
            <div class="con">
              <p class="title">{{ title }}</p>
              <p class="version">{{ version }}</p>
              <span class="time">
                <i class="icon-times"></i>
                {{ time }}</span>
            </div>
          </a>
        </li>
			`;

      this.pluginHtml = `
        <li data-id="{{ id }}">
          <div class="del">X</div>
          <a href="{{ url }}">
            <div class="img-wrap">
              <div class="img">
                <img src="{{ thumb }}">
              </div>
            </div>
            <div class="con">
              <p class="title">{{ title }}</p>
              <span class="btn">下载</span>
            </div>
          </a>
        </li>
			`;

      this.materialHtml = `
				<li data-w="{{ width }}" data-h="{{ height }}" data-id="{{ id }}"><div class="del">删除</div><a href="{{ url }}">
					<div class="img"><img src="{{ thumb }}"></div>
					<p>{{ title }}</p>
				</a></li>	
			`;

      this.videoHtml = `
				<li data-id="{{ id }}"><div class="del">删除</div><a href="{{ url }}">
					<img src="{{ thumb }}">
					<video class="video-hover" data-original="{{ video }}" loop="loop"></video>
					<p><span class="common_ovh">{{ title }}</span><em class="fr"><i class="icon-video"></i> {{ time }}</em></p>
				</a></li>
			`;

      this.templateHtml = `
        <li data-id="{{ id }}">
          <div class="del">X</div>
          <a href="{{ url }}">
            <div class="img-wrap">
              <div class="img">
                <img src="{{ thumb }}">
              </div>
            </div>
            <div class="con">
              <p class="title">{{ title }}</p>
              <span class="btn">下载</span>
            </div>
          </a>
        </li>
			`;

      // 优惠券
      this.couponHtml = `
				<li class="{ type } { isover }" title="{ title }">
					<a href="/vip.html" target="_blank">
						<span class="time-over">已过期</span>
						<div class="fl price">￥ <em>{ price }</em></div>
						<div class="time-price">
							<p>满{ min_price }可用</p>
							<span>{ time }到期</span>
						</div>
					</a>
				</li>
			`;

      this.shareHtml = `
				<tr>
					<td>{ time }</td>
					<td>{ from }</td>
					<td>{ point }积分</td>
				</tr>
			`;
    }

    // hash变更切换展示
    hashChange(hash) {
      let hashs = this.navCheckHooks.asideNav.children('li').map((i, v) => {
        return v.className.split(' ')[0].replace('nav-', '');
      });

      hashs = Array.from(hashs);

      if (!hashs.includes(hash)) {
        window.location.hash = '#/' + hashs[0];
        return;
      }
      UTIL.toggleActive([
        this.navCheckHooks.asideNav.find('.nav-' + hash),
        this.navCheckHooks.articleContents.find('.article-' + hash)
      ])

      this.changeNavGetData(hash);

    }

    // 根据不同 hash 请求对应数据
    changeNavGetData(hash) {
      switch (hash) {
        case 'admin':
          if (!this.hasInitAdmin) {
            this.bindInfoCity();
            this.watchInfoChange();
            this.bindPhoneEvent();
            this.hasInitAdmin = true;
          };
          break;
        case 'collect':
          if (!this.hasGetCol.soft) {
            this.getColData();
            this.initColNavEvent();
            this.hasGetCol.soft = true;
          };
          break;
        case 'download':
          if (!this.hasGetDown.soft) {
            this.getDownData();
            this.initDownNavEvent();
            this.hasGetDown.soft = true;
          };
          break;
        case 'history':
          if (!this.hasGetHistory.soft) {
            this.getHistoryData();
            this.initHistoryNavEvent();
            this.hasGetHistory.soft = true;
          };
          break;
        case 'recharge':
          if (!this.hasGetRecharge) {
            this.initRechargeEvent();
            this.getRechargeData();
            this.hasGetRecharge = true;
          };
          break;
        case 'consume':
          if (!this.hasGetConsume) {
            this.initConsumeEvent();
            this.getConsumeData();
            this.hasGetConsume = true;
          };
          break;

        case 'coupon':
          if (!this.hasGetCoupon) {
            this.initCouponEvent();
            this.getCouponData();
            this.hasGetCoupon = true;
          };
          break;

        case 'share':
          if (!this.hasGetShare) {
            this.getShareData();
            this.hasGetShare = true;
          };
          break;

        case 'news':
          if (!this.hasGetSys) {
            this.getSysInfo();
            this.initNewsNavEvent();
            this.hasGetSys = true;
          };
          break;
        default:
          break;
      }
    }

    // 账号信息事件注册
    initAdminEvent() {
      let lottery;
      this.adminHook.sign.on('click', () => {
        if (lottery) {
          lottery.init();
          return;
        }
        lottery = new Lottery();
        this.hasGetConsume = false;
      })

      this.adminHook.renew.on('click', () => {
        this.adminHook.renewBox.show();
        this.getPayEwm();
      })

      this.adminHook.renewBox.on('click', '.close-renew', () => {
        clearInterval(this.isPayOkInterval);
        this.adminHook.renewBox.hide();
      })
    }

    //获取续费二维码
    getPayEwm() {
      let id = this.adminHook.renewBox.find('.renew-price').data('id');
      this.isPayOk();
      this.payAjax({
        id,
        renewals_status: 1,
      })
    }

    payAjax(data) {
      for (let index = 0; index < 2; index++) {
        let dom = index ?
          this.adminHook.renewBox.find('.wxpay img') :
          this.adminHook.renewBox.find('.alipay img');
        dom.attr('src', this.loadingImg);

        $.ajax({
          url: (index ? VIP_APIS.wx_pay : VIP_APIS.ali_pay),
          type: 'POST',
          data
        }).done((res) => {
          if (res.code == 200) {
            QRcode.toDataURL(res.msg, {
              width: 128,
              margin: 1
            }).then(url => {
              dom.attr('src', url)
            })
          } else {
            UTIL.alertBox(res.msg)
          }
        })
      }
    }

    isPayOk() {
      this.isPayOkInterval = setInterval(() => {
        $.ajax({
          url: VIP_APIS.pay_ok,
          type: 'GET',
          success: function (msg) {
            if (msg.code == 200) {
              UTIL.confirmBox('充值成功',  ()=> {
                window.location.reload();
              }, {
                title: '提示',
                autoClose: 'sure|5000',
                buttons: {
                  cancel: {
                    text: '返回首页',
                    action: function () {
                      window.location.href = '/';
                    }
                  },
                  sure: {
                    btnClass: 'btn-green'
                  }
                }
              })
            }
            return;
          }
        });
      }, 10000);
    }

    // 个人信息城市信息初始
    bindInfoCity() {

      let setProv = this.infoHook.prov.attr('value') || '',
        setCity = this.infoHook.city.attr('value') || '';

      this.infoHook.prov.parent().citySelect({
        url: '/assets/js/static/city.min.js',
        prov: setProv,
        city: setCity,
        required: false
      });
    }

    // 检测个人信息更改 变化按钮样式
    watchInfoChange() {
      this.infoHook.form
        .change(function () {
          $(this).find('button').removeClass('disabeld');

        })
        .submit(this.changeInfo.bind(this))
    }

    //提交用户变更信息
    changeInfo(e) {
      e.preventDefault();
      if ($(e.target).find('button').hasClass('disabeld')) return;

      let url = USER_APIS.editUrl,
        data = $(e.target).serializeObject();

      $.ajax({
        url,
        type: 'POST',
        data,
        dataType: 'json',
        success: function (msg) {
          if (msg['code'] == 200) {
            UTIL.alertBox('保存修改成功');
            $('.nickname em').add('.name-vip p').add('.user-function .infos span').text(data.nickname);
            $(e.target).find('button').addClass('disabeld');
          } else {
            UTIL.alertBox(msg.msg);
          }
        }
      });

    }

    // 手机绑定与更换点击展示
    bindPhoneEvent() {
      let _this = this;
      this.phoneBindHook.btn.on('click', function () {
        if (!$(this).prev().val()) {
          UTIL.toggleActive(_this.phoneBindHook.bind);
        } else {
          UTIL.toggleActive(_this.phoneBindHook.change);
        };
        _this.phoneBindHook.box.show();
        _this.initBindChangeEvent();
      })

      _this.phoneBindHook.box
        .on('click', '.close-bind', function () {
          _this.phoneBindHook.box.hide()
            .find('input').not('input[name="phone_old"]').val('')
            .end()
            .find('.bind-tips').text('');
        })
        .on('click', '.bind-btn', function () {
          if ($(this).hasClass('disabeld')) return;

          let tip = $(this).closest('form').find('.bind-tips'),
            data = $(this).closest('form').serializeObject(),
            type = $(this).closest('form').attr('id') == 'bind-phone' ? 'bind' : 'change';

          _this.sendCode(type, data, $(this), tip);

        })

    }

    // 发送验证码请求
    sendCode(type, datas, el, tip) {
      let url, data = {},
        _this = this;
      if (type == 'bind') {
        let captchaObj = new TencentCaptcha(this.captchaNum, function (res) {
          if (res.ret === 0) {
            url = USER_APIS.sendPhoneUrl;

            data.ticket = res.ticket;
            data.randstr = res.randstr;
            data.phone = datas.phone;

            $.ajax({
              url,
              type: 'POST',
              data,
              success: function (res) {
                if (res.code == 200) {
                  _this.sendingCode = true;
                  _this.timerInter(el);
                  return;
                } else {
                  tip.text(res.msg);
                }
              },
              error: function (error) {
                return error;
              }
            })
          }
        }, {})
        captchaObj.show()
      } else {
        url = USER_APIS.sendChangeUrl;
        data.phone_old = datas.phone_old;
        $.ajax({
          url,
          type: 'POST',
          data,
          success: function (res) {
            if (res.code == 200) {
              _this.sendingCode = true;
              _this.timerInter(el);
              return;
            } else {
              tip.text(res.msg);
            }
          },
          error: function (error) {
            return error;
          }
        })
      };

    }

    // 绑定或更绑 提交事件注册
    initBindChangeEvent() {
      let _this = this;
      // 监测改变 动态修改验证码获取状态
      this.phoneBindHook.bind.change(function (e) {

        if ($(e.target).attr('name') == 'phone') {
          if (UTIL.phoneReg($(e.target).val()) && !_this.sendingCode) {
            _this.phoneBindHook.bind.find('.bind-btn').removeClass('disabeld');
          } else {
            _this.phoneBindHook.bind.find('.bind-btn').addClass('disabeld');
          }
        }
      })

      this.phoneBindHook.bind.add(this.phoneBindHook.change)
        .on('submit', function (e) {
          e.preventDefault();
          let data = $(this).serializeObject(),
            tip = $(this).find('.bind-tips'),
            type = $(this).attr('id') == 'bind-phone' ? 'bind' : 'change';
          if (_this.regUsername(data, $(this))) {
            _this.submitBindChange(data, type, tip);
          }

        });
    }

    // 提交绑定与更改请求
    submitBindChange(datas, type, tip) {
      let url, data = {},
        _this = this;
      if (type == 'bind') {
        url = USER_APIS.bindPhoneUrl;
        data.verification_code = datas.phone_code;
        data.phone = datas.phone;
        data.password = datas.repswd;
      } else {
        url = USER_APIS.changeBindUrl;
        data.phone_new = datas.phone;
        data.verification_code = datas.phone_code;
        data.phone_old = datas.phone_old;
      };

      $.ajax({
        url,
        type: 'POST',
        data,
        success: function (res) {
          if (res.code == 200) {
            UTIL.alertBox(res.msg);
            $('#phone').add($('input[name="phone_old"]')).val(datas.phone);
            $('#bind-change-phone').hide();
          } else {
            tip.text(res.msg);
          }
        }
      })
    }

    // 获取验证倒计时
    timerInter(el) {
      var _this = this,
        timer,
        num = 60;

      _this.sendingCode = true;

      el.text(`重新发送(${num--})`).addClass('disabeld');

      timer = setInterval(function () {
        el.text(`重新发送(${num--})`);
        if (!_this.sendingCode) {
          clearInterval(timer);
          el.text('发送验证码').removeClass('disabeld');
        }
        if (num < 0) {
          clearInterval(timer);
          el.text('重新发送').removeClass('disabeld');
          _this.sendingCode = false;
        }
      }, 1000);
    };

    // 手机号表格验证
    regUsername(obj, dom) {
      let tip = dom.find('.bind-tips');
      for (let k in obj) {
        if (obj[k] === '') {
          tip.text('输入不能为空！');
          return false;
        }
      };

      if (!!obj.phone && !UTIL.phoneReg(obj.phone)) {
        tip.text('手机号格式错误！');
        return false;
      }

      if (!!obj.phone_code && !UTIL.codeReg(obj.phone_code)) {
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


    // 我的收藏切换功能
    initColNavEvent() {
      this.collectHook.nav.on('click', 'span', (e) => {
        let index = $(e.target).index();

        UTIL.toggleActive([$(e.target), this.collectHook.contBoxs.eq(index)]);

        switch (this.collectHook.contBoxs.eq(index)[0].className.split(' ')[0]) {
          case 'soft':
            break;
          case 'plugin':
            if (!this.hasGetCol.plugin) {
              this.getColData(this.modelIds.plugin, 8);
              this.hasGetCol.plugin = true;
            };
            break;
          case 'material':
            if (!this.hasGetCol.material) {
              this.getColData(this.modelIds.material, 10);
              this.hasGetCol.material = true;
            };
            break;
          case 'video':
            if (!this.hasGetCol.video) {
              this.getColData(this.modelIds.video, 6);
              this.hasGetCol.video = true;
            };
            break;
          case 'template':
            if (!this.hasGetCol.template) {
              this.getColData(this.modelIds.template, 8);
              this.hasGetCol.template = true;
            };
            break;
          default:
            break;
        }
      })

      this.collectHook.contBoxs.on('click', 'li', (e) => {
        let $target = $(e.target);

        if ($target.is('.del')) {
          let $item = $target.closest('li'),
            id = $item.data('id'),
            $wrap = $item.parent();

          UTIL.confirmBox('是否确认移除？', ()=> {
            this.delUserItems($wrap, $item, id, 'col')
          });
        }
      });
    }

    // 删除收藏
    delUserItems(box, el, id, type) {
      let $pagi = box.next('.ajax-pagination'),
        typeName = $pagi.get(0).id,
        pagiNum = $pagi.find('.active').text() || 1,
        len = box.children().length,
        _this = this,
        page_size,
        datas,
        url,
        getData,
        model_id;

      switch (typeName) {
        case type + '-soft-pagi':
          model_id = _this.modelIds.mac;
          page_size = 10
          break;
        case type + '-plugin-pagi':
          model_id = _this.modelIds.plugin;
          page_size = 8
          break;
        case type + '-material-pagi':
          model_id = _this.modelIds.material;
          page_size = 10
          break;
        case type + '-video-pagi':
          model_id = _this.modelIds.video;
          page_size = 6
          break;
        case type + '-template-pagi':
          model_id = _this.modelIds.template;
          page_size = 8
          break;
      };

      switch (type) {
        case 'col':
          datas = {
            collect_id: id
          };
          url = USER_APIS.delCollectionsUrl;
          getData = (...rest) => {
            _this.getColData(...rest)
          };
          break;

        case 'down':
          datas = {
            id,
          };
          url = USER_APIS.delDownloadUrl;
          getData = (...rest) => {
            _this.getDownData(...rest)
          };
          break;

        case 'hist':
          datas = {
            key: id,
            model_id
          };
          url = USER_APIS.delHistoryUrl;
          getData = (...rest) => {
            _this.getHistoryData(...rest)
          };
          break;

      }

      pagiNum = len > 1 ? pagiNum : pagiNum - 1;

      $.ajax({
        url,
        type: 'POST',
        data: datas,
        dataType: 'json',
        success: function (msg) {
          if (msg.code == 200) {
            $pagi.children().length > 0 ? getData(model_id, page_size, pagiNum) : el.remove();
            if (box.children().length == 0) {
              box.append(_this.noContentLiHtml)
            };
            return true;
          } else {
            UTIL.alertBox('删除失败，请重试。');
          }
        }
      });

    }

    // 获取收藏数据
    getColData(model_id = this.modelIds.mac, page_size = 10, page = 1) {
      let _this = this,
        pagi, wrap, tempHtml, isMaterial = false;

      switch (model_id) {
        case this.modelIds.mac:
          pagi = _this.collectHook.spagi;
          wrap = _this.collectHook.softUl;
          tempHtml = _this.softHtml;
          break;
        case this.modelIds.plugin:
          pagi = _this.collectHook.ppagi;
          wrap = _this.collectHook.pluginUl;
          tempHtml = _this.pluginHtml;
          break;
        case this.modelIds.template:
          pagi = _this.collectHook.tpagi;
          wrap = _this.collectHook.templateUl;
          tempHtml = _this.templateHtml;
          break;
        case this.modelIds.material:
          pagi = _this.collectHook.mpagi;
          wrap = _this.collectHook.materialUl;
          tempHtml = _this.materialHtml;
          isMaterial = true;
          break;
        case this.modelIds.video:
          pagi = _this.collectHook.vpagi;
          wrap = _this.collectHook.videoUl;
          tempHtml = _this.videoHtml;
          break;
        default:
          break;
      }

      $.ajax({
          url: USER_APIS.collectionsUrl,
          type: 'POST',
          data: {
            page,
            page_size,
            model_id,
          },
        })
        .done(function (res) {
          if (res.code == 200) {
            if (res.data && res.data.data.length > 0) {
              _this.dealHtml(res.data, page_size, page, pagi, wrap, tempHtml, isMaterial)
            } else {
              wrap.empty().append(_this.noContentLiHtml);
            }
          } else {
            wrap.empty().append(_this.noContentLiHtml);
          }
        })
        .fail(function (error) {
          wrap.empty().append(_this.noContentLiHtml);
          console.log(error);
        })
    }

    dealHtml(data, perPage, curPage, pagiHook, wrap, temp, type) {
      let _this = this,
        templateH = temp,
        html = '',
        datas = data.data,
        total = data.total,
        pagiTotal = Math.ceil(total / perPage),
        curMsgLength = pagiHook.children().length;

      total >= perPage && ((curPage % perPage == 0) || (pagiTotal != curMsgLength)) && _this.createPagi(pagiTotal, curPage, pagiHook) && pagiHook.attr('data-total', pagiTotal);

      $.each(datas, function (index, el) {
        html += templateH
          .replace('{{ url }}', el.url)
          .replace('{{ title }}', el.title)
          .replace('{{ thumb }}', el.thumb)
          .replace('{{ thumbs }}', el.thumb)
          .replace('{{ version }}', el.version)
          .replace('{{ id }}', el.collect_id ? el.collect_id : el.key)
          .replace('{{ height }}', el.height ? el.height : '')
          .replace('{{ width }}', el.width ? el.width : '')
          .replace('{{ video }}', el.video ? el.video : '')
          .replace('{{ time }}', el.time ? el.time : el.update_time)
      });

      wrap.empty().append(html)

      if (type) {
        wrap.flexImages({
          rowHeight: 200,
          container: "li",
          maxRows: 3,
        })
      }

    }

    // 我的下载 nav切换
    initDownNavEvent() {
      this.downloadHook.nav.on('click', 'span', (e) => {
        let index = $(e.target).index();

        UTIL.toggleActive([$(e.target), this.downloadHook.contBoxs.eq(index)]);

        switch (this.downloadHook.contBoxs.eq(index)[0].className.split(' ')[0]) {
          case 'soft':
            break;
          case 'plugin':
            if (!this.hasGetDown.plugin) {
              this.getDownData(this.modelIds.plugin, 8);
              this.hasGetDown.plugin = true;
            };
            break;
          case 'material':
            if (!this.hasGetDown.material) {
              this.getDownData(this.modelIds.material, 10);
              this.hasGetDown.material = true;
            };
            break;
          case 'video':
            if (!this.hasGetDown.video) {
              this.getDownData(this.modelIds.video, 6);
              this.hasGetDown.video = true;
            };
            break;
          case 'template':
            if (!this.hasGetDown.template) {
              this.getDownData(this.modelIds.template, 8);
              this.hasGetDown.template = true;
            };
            break;
          default:
            break;
        }
      })

      this.downloadHook.contBoxs.on('click', 'li', (e) => {
        let $target = $(e.target);

        if ($target.is('.del')) {
          let $item = $target.closest('li'),
            id = $item.data('id'),
            $wrap = $item.parent();

          UTIL.confirmBox('是否确认移除？', ()=> {
            this.delUserItems($wrap, $item, id, 'down')
          });

        }
      });
    }

    // 获取下载数据
    getDownData(model_id = this.modelIds.mac, page_size = 10, page = 1) {
      let _this = this,
        pagi, wrap, tempHtml, isMaterial = false;

      switch (model_id) {
        case this.modelIds.mac:
          pagi = _this.downloadHook.spagi;
          wrap = _this.downloadHook.softUl;
          tempHtml = _this.softHtml.replace('<div class="del">X</div>', '');
          break;
        case this.modelIds.plugin:
          pagi = _this.downloadHook.ppagi;
          wrap = _this.downloadHook.pluginUl;
          tempHtml = _this.pluginHtml.replace('<div class="del">删除</div>', '');
          break;
        case this.modelIds.template:
          pagi = _this.downloadHook.tpagi;
          wrap = _this.downloadHook.templateUl;
          tempHtml = _this.templateHtml.replace('<div class="del">删除</div>', '');
          break;
        case this.modelIds.material:
          pagi = _this.downloadHook.mpagi;
          wrap = _this.downloadHook.materialUl;
          tempHtml = _this.materialHtml.replace('<div class="del">删除</div>', '');
          isMaterial = true;
          break;
        case this.modelIds.video:
          pagi = _this.downloadHook.vpagi;
          wrap = _this.downloadHook.videoUl;
          tempHtml = _this.videoHtml.replace('<div class="del">删除</div>', '');
          break;
        default:
          break;
      }

      $.ajax({
          url: USER_APIS.downloadUrl,
          type: 'POST',
          data: {
            page,
            page_size,
            model_id,
          },
        })
        .done(function (res) {
          if (res.code == 200) {
            if (res.data && res.data.data.length > 0) {
              _this.dealHtml(res.data, page_size, page, pagi, wrap, tempHtml, isMaterial)
            } else {
              wrap.empty().append(_this.noContentLiHtml);
            }
          } else {
            wrap.empty().append(_this.noContentLiHtml);
          }
        })
        .fail(function (error) {
          wrap.empty().append(_this.noContentLiHtml);
          console.log(error);
        })
    }

    // 浏览足迹事件
    initHistoryNavEvent() {
      this.historyHook.nav.on('click', 'span', (e) => {
        let index = $(e.target).index();

        UTIL.toggleActive([$(e.target), this.historyHook.contBoxs.eq(index)]);

        switch (this.historyHook.contBoxs.eq(index)[0].className.split(' ')[0]) {
          case 'soft':
            break;
          case 'plugin':
            if (!this.hasGetHistory.plugin) {
              this.getHistoryData(this.modelIds.plugin, 8);
              this.hasGetHistory.plugin = true;
            };
            break;
          case 'material':
            if (!this.hasGetHistory.material) {
              this.getHistoryData(this.modelIds.material, 10);
              this.hasGetHistory.material = true;
            };
            break;
          case 'video':
            if (!this.hasGetHistory.video) {
              this.getHistoryData(this.modelIds.video, 6);
              this.hasGetHistory.video = true;
            };
            break;
          case 'template':
            if (!this.hasGetHistory.template) {
              this.getHistoryData(this.modelIds.template, 8);
              this.hasGetHistory.template = true;
            };
            break;
          default:
            break;
        }
      })

      this.historyHook.contBoxs.on('click', 'li', (e) => {
        let $target = $(e.target);

        if ($target.is('.del')) {
          let $item = $target.closest('li'),
            id = $item.data('id'),
            $wrap = $item.parent();

          UTIL.confirmBox('是否确认移除？', ()=> {
            this.delUserItems($wrap, $item, id, 'hist')
          });
        }
      });
    }

    // 获取浏览数据
    getHistoryData(model_id = this.modelIds.mac, page_size = 10, page = 1) {
      let _this = this,
        pagi, wrap, tempHtml, isMaterial = false;

      switch (model_id) {
        case this.modelIds.mac:
          pagi = _this.historyHook.spagi;
          wrap = _this.historyHook.softUl;
          tempHtml = _this.softHtml;
          break;
        case this.modelIds.plugin:
          pagi = _this.historyHook.ppagi;
          wrap = _this.historyHook.pluginUl;
          tempHtml = _this.pluginHtml;
          break;
        case this.modelIds.template:
          pagi = _this.historyHook.tpagi;
          wrap = _this.historyHook.templateUl;
          tempHtml = _this.templateHtml;
          break;
        case this.modelIds.material:
          pagi = _this.historyHook.mpagi;
          wrap = _this.historyHook.materialUl;
          tempHtml = _this.materialHtml;
          isMaterial = true;
          break;
        case this.modelIds.video:
          pagi = _this.historyHook.vpagi;
          wrap = _this.historyHook.videoUl;
          tempHtml = _this.videoHtml;
          break;
        default:
          break;
      }

      $.ajax({
          url: USER_APIS.historyUrl,
          type: 'POST',
          data: {
            page,
            page_size,
            model_id,
          },
        })
        .done(function (res) {
          if (res.code == 200) {
            if (res.data && res.data.data.length > 0) {
              _this.dealHtml(res.data, page_size, page, pagi, wrap, tempHtml, isMaterial)
            } else {
              wrap.empty().append(_this.noContentLiHtml);
            }
          } else {
            wrap.empty().append(_this.noContentLiHtml);
          }
        })
        .fail(function (error) {
          wrap.empty().append(_this.noContentLiHtml);
          console.log(error);
        })
    }


    // 获取已提交问题
    getNewsData(page = 1) {
      let _this = this,
        url = USER_APIS.hasReportUrl;

      $.ajax({
        url,
        type: 'POST',
        data: {
          page
        },
        dataType: 'json',
        success: function (msg) {
          if (msg.code == 200) {
            let data = msg.data;
            if (data && typeof data == 'object') {
              // 展示数据
              _this.newsHook.table.empty().append(_this.showReportedList(data.info));
              // 生成翻页
              let totalPage = Math.ceil(data.total / 10);
              totalPage > 1 && _this.createPagi(totalPage, page, _this.newsHook.pagi) && _this.newsHook.pagi.attr('data-total', totalPage);
            } else {
              _this.newsHook.table.empty().append(_this.noContentTrHtml);
            }
          }
        }
      });
    }
    // 获取系统消息
    getSysInfo(page = 1) {
      let _this = this,
        url = USER_APIS.sysInfo;

      $.ajax({
        url,
        type: 'POST',
        data: {
          page
        },
        dataType: 'json',
        success: function (msg) {
          if (msg.code == 200) {
            let data = msg.data;
            if (data && typeof data == 'object' && data.data) {
              // 展示数据
              _this.sysHooks.table.empty().append(_this.showsysList(data.data));
              // 生成翻页
              let totalPage = Math.ceil(data.total / 10);
              totalPage > 1 && _this.createPagi(totalPage, page, _this.sysHooks.pagi) && _this.sysHooks.pagi.attr('data-total', totalPage);
            } else {
              _this.sysHooks.table.empty().append(_this.noContentTrHtml);
            }
          }
        }
      });
    }
    // 处理展示已提交问题数据
    showReportedList(data) {
      let _this = this,
        html = '';

      $.each(data, function (i, ele) {
        html += _this.reportHtml
          .replace(/{{ url }}/g, ele.url)
          .replace('{{ type }}', ele['error_type'] || '其他')
          .replace('{{ content }}', ele.content)
          .replace('{{ time }}', ele.add_time);
      });

      return html;
    }

    // 处理展示系统数据
    showsysList(data) {
      let _this = this,
        html = '';

      $.each(data, function (i, ele) {
        html += _this.sysInfoHtml
          .replace('{{ content }}', ele.content)
          .replace('{{ time }}', ele.send_time);
      });

      return html;
    }
    // 消息中心切换
    initNewsNavEvent() {
      let _this = this;
      this.newsHook.nav.on('click', 'span', function () {
        let index = $(this).index();
        UTIL.toggleActive([$(this), _this.newsHook.con.children().eq(index)]);

        if (index == 1 && _this.reportedFlag || !_this.hasGetNews) {
          _this.getNewsData();
          _this.reportedFlag = false;
          _this.hasGetNews = true;
        }

      })

      this.supportNews();
    }

    // 问题提交功能
    supportNews() {
      let _this = this;

      this.newsHook._form.on('submit', function (e) {
        e.preventDefault();

        if (_this.reportedFlag) {
          UTIL.alertBox('请勿重复提交！');
          return;
        };

        let data = $(this).serializeObject(),
          tips = $(this).find('.news-tips');

        if (!data.error_type) {
          tips.text('请选择问题类型！');
          return;
        };
        if (data.error_type != '其他' && !UTIL.urlReg(data.url)) {
          tips.text('请填写本站正确的网址！');
          return;
        };

        if (data.content === '') {
          tips.text('请填写问题描述！');
          return;
        };

        data.content = UTIL.htmlFormat(data.content);
        tips.text('');

        _this.sendReport(data);

      });
    }
    // 发送意见
    sendReport(data) {
      let _this = this,
        url = USER_APIS.reportUrl;
      $.ajax({
        url,
        type: 'POST',
        data,
        dataType: 'json',
        success: function (msg) {
          if (msg['code'] == 200) {
            UTIL.alertBox('问题提交成功');
            _this.reportedFlag = true;
            _this.newsHook._form.find(':input').not(':radio').val('');
            _this.newsHook._form.find(':radio').removeAttr("checked");
          } else {
            UTIL.alertBox(msg.msg);
          }
        }
      });
    }

    // 获取充值记录
    getRechargeData(page = 1) {
      let _this = this,
        url = USER_APIS.rechargeUrl,
        datas = this.rechargeHook.form.serializeObject();

      datas.page = page;

      $.ajax({
        url,
        type: 'POST',
        data: datas,
        dataType: 'json',
        success: function (msg) {
          if (msg.code == 200) {
            let data = msg.data;
            if (data.data.length && typeof data == 'object') {
              // 展示数据
              _this.rechargeHook.table.empty().append(_this.showRechargeList(data.data));
              // 生成翻页
              let totalPage = Math.ceil(data.total / 10);
              totalPage > 0 && _this.createPagi(totalPage, page, _this.rechargeHook.pagi) && _this.rechargeHook.pagi.attr('data-total', totalPage);
            } else {
              _this.rechargeHook.pagi.empty();
              _this.rechargeHook.table.empty().append(_this.noContentTrHtml);
            }
          }
        }
      });
    }

    showRechargeList(data) {
      let _this = this,
        html = '';

      $.each(data, function (i, ele) {

        html += _this.rechargeHtml
          .replace('{ type }', ele.type == 1 ? '购买积分' : '升级vip')
          .replace('{ pay_type }', ele.pay_id == 1 ? '微信' : ele.pay_id == 2 ? '支付宝' : '其他充值')
          .replace('{ content }', ele.contact_name)
          .replace('{ price }', ele.money)
          .replace('{ time }', UTIL.formatDate(ele['add_time'] * 1000, 'Y-m-d'));
      });

      return html;
    }

    initRechargeEvent() {
      this.rechargeHook.form
        .on('submit change', (e) => {
          e.preventDefault();
          this.getRechargeData()
        })
    }

    // 获取消费记录
    getConsumeData(page = 1) {
      let _this = this,
        url = USER_APIS.consumeUrl,
        datas = this.consumeHook.form.serializeObject();

      datas.page = page;

      $.ajax({
        url,
        type: 'POST',
        data: datas,
        dataType: 'json',
        success: function (msg) {
          if (msg.code == 200) {
            let data = msg.data;
            if (data && typeof data == 'object') {
              // 展示数据
              _this.consumeHook.table.empty().append(_this.showConsumeList(data.info));
              // 生成翻页
              let totalPage = Math.ceil(data.total / 10);
              totalPage > 0 && _this.createPagi(totalPage, page, _this.consumeHook.pagi) && _this.consumeHook.pagi.attr('data-total', totalPage);
            } else {
              _this.consumeHook.pagi.empty();
              _this.consumeHook.table.empty().append(_this.noContentTrHtml);
            }
          }
        }
      });
    }

    //处理消费数据
    showConsumeList(data) {
      let _this = this,
        html = '';

      $.each(data, function (i, ele) {
        html += _this.consumeHtml
          .replace('{{ type }}', ele.spend_type == 2 ? '积分下载' : ele.spend_type == 3 ? '免费下载' : '积分抽奖')
          .replace('{{ content }}', ele.url ? '<a href="' + ele.url + '">' + ele.msg + '</a>' : ele.msg)
          .replace('{{ point }}', ele.value)
          .replace('{{ time }}', ele.add_time);
      });

      return html;
    }
    // 消费记录事件注册
    initConsumeEvent() {
      this.consumeHook.form
        .on('submit change', (e) => {
          e.preventDefault();
          this.getConsumeData()
        })
    }

    // 获取优惠券
    getCouponData(page = 1) {
      let _this = this,
        url = USER_APIS.couponUrl,
        coupon_status = this.couponHook.nav.find('.active').data('status');

      $.ajax({
        url,
        type: 'POST',
        data: {
          page,
          coupon_status
        },
        dataType: 'json',
        success: function (msg) {
          if (msg.code == 200) {
            let data = msg;
            if (data.coupon_info.length && typeof data.coupon_info == 'object') {
              // 展示数据
              _this.couponHook.wrap.empty().append(_this.showCouponList(data.coupon_info));
              // 生成翻页
              let totalPage = Math.ceil(data.total / 15);
              totalPage > 0 && _this.createPagi(totalPage, page, _this.couponHook.pagi) && _this.couponHook.pagi.attr('data-total', totalPage);
            } else {
              _this.couponHook.pagi.empty();
              _this.couponHook.wrap.empty().append(_this.noContentLiHtml);
            }
          }
        }
      });
    }

    //处理优惠券数据
    showCouponList(data) {
      let _this = this,
        html = '';

      $.each(data, function (index, el) {
        html += _this.couponHtml
          .replace('{ type }', el.coupon_point / 1 == 5 ? 'five' : el.coupon_point / 1 == 10 ? 'ten' : el.coupon_point / 1 == 20 ? 'twenty' : 'hundred')
          .replace('{ title }', el.coupon_name)
          .replace('{ isover }', el.status != 0 ? 'over' : '')
          .replace('{ time }', el.end_time)
          .replace('{ price }', el.coupon_point / 1)
          .replace('{ min_price }', el.min_consume / 1)
      });

      return html
    }

    initCouponEvent() {
      this.couponHook.nav.on('click', 'span', (e) => {
        UTIL.toggleActive($(e.target));
        this.getCouponData();
      })
    }

    // 获取分享记录
    getShareData(page = 1) {
      let _this = this,
        url = USER_APIS.shareUrl;

      $.ajax({
        url,
        type: 'POST',
        data: {
          page
        },
        dataType: 'json',
        success: function (msg) {
          if (msg.code == 200) {
            let data = msg;
            if (data.data.length && typeof data.data == 'object') {
              // 展示数据
              _this.shareHook.table.empty().append(_this.showShareList(data.data));
              // 生成翻页
              let totalPage = Math.ceil(data.num / 10);
              totalPage > 1 && _this.createPagi(totalPage, page, _this.shareHook.pagi) && _this.shareHook.pagi.attr('data-total', totalPage);
            } else {
              _this.shareHook.table.empty().append(_this.noContentTrHtml);
            }
          }
        }
      });
    }

    //处理分享数据
    showShareList(data) {
      let _this = this,
        html = '';

      $.each(data, function (i, ele) {
        html += _this.shareHtml
          .replace('{ point }', ele.point)
          .replace('{ from }', ele.type == 0 ? '用户注册' : '用户充值')
          .replace('{ time }', ele.add_time);
      });

      return html;
    }

    // 生成翻页页码
    createPagi(totalPage, pageNum, hook) {
      if (totalPage == 1) {
        hook.empty();
        return;
      }

      let prevTemplate = '<a  class="prev" target="_self">&lt;&lt;</a>',
        nextTemplate = '<a  class="next" target="_self">&gt;&gt;</a>';

      let pagiNumHtml = '',
        i, numActive;
      if (totalPage <= 10 || (totalPage > 10 && pageNum < 10)) {
        for (i = 1; i <= Math.min(totalPage, 10); i++) {
          i == pageNum ? numActive = 'num active' : numActive = 'num';
          let _numTemp = '<a  class="' + numActive + '" value="' + i + '" target="_self">' + i + '</a>';

          pagiNumHtml += _numTemp;
        }
      } else {
        let numFloor = Math.floor(pageNum / 10) * 10,
          numCeil = Math.min(numFloor + 10, totalPage);

        for (i = numFloor; i <= numCeil; i++) {
          i == pageNum ? numActive = 'num active' : numActive = 'num';
          let _numTemp = '<a  class="' + numActive + '" value="' + i + '" target="_self">' + i + '</a>';

          pagiNumHtml += _numTemp;
        }
      }
      hook.empty().append(prevTemplate, pagiNumHtml, nextTemplate);

      return true;
    }

    checkPage(num, context) {
      let $target = $('.num', context).filter((v) => {
        return $(v).text() == num;
      });

      switch (context) {
        //收藏翻页
        case '#col-soft-pagi':
          this.getColData(this.modelIds.mac, 10, num);
          break;
        case '#col-plugin-pagi':
          this.getColData(this.modelIds.plugin, 8, num);
          break;
        case '#col-template-pagi':
          this.getColData(this.modelIds.template, 8, num);
          break;
        case '#col-material-pagi':
          this.getColData(this.modelIds.material, 10, num);
          break;
        case '#col-video-pagi':
          this.getColData(this.modelIds.video, 6, num);
          break;
          // 足迹翻页
        case '#hist-soft-pagi':
          this.getHistoryData(this.modelIds.mac, 10, num);
          break;
        case '#hist-plugin-pagi':
          this.getHistoryData(this.modelIds.plugin, 8, num);
          break;
        case '#hist-template-pagi':
          this.getHistoryData(this.modelIds.template, 8, num);
          break;
        case '#hist-material-pagi':
          this.getHistoryData(this.modelIds.material, 10, num);
          break;
        case '#hist-video-pagi':
          this.getHistoryData(this.modelIds.video, 6, num);
          break;
          // 下载翻页
        case '#down-soft-pagi':
          this.getDownData(this.modelIds.mac, 10, num);
          break;
        case '#down-plugin-pagi':
          this.getDownData(this.modelIds.plugin, 8, num);
          break;
        case '#down-template-pagi':
          this.getDownData(this.modelIds.template, 8, num);
          break;
        case '#down-material-pagi':
          this.getDownData(this.modelIds.material, 10, num);
          break;
        case '#down-video-pagi':
          this.getDownData(this.modelIds.video, 6, num);
          break;
          //充值
        case '#recharge-pagi':
          this.getRechargeData(num);
          break;
          //消费
        case '#consume-pagi':
          this.getConsumeData(num);
          break;
          //优惠券
        case '#coupon-pagi':
          this.getCouponData(num);
          break;
          //反馈
        case '#report-pagi':
          this.getNewsData(num);
          break;
          // 系统消息
        case '#sysinfo-pagi':
          this.getSysInfo(num);
          break;
          // 分享
        case '#share-pagi':
          this.getShareData(num);
          break;
        default:
          break;
      }
      UTIL.toggleActive($target);
    }


    initPagiEvent() {
      let _this = this;
      _this.pagiDom.on('click', function (e) {
        let $target = $(e.target);

        if ($target.hasClass('active')) return;

        let len = $(this).find('.num').length,
          $num = $(this).find('.num'),
          active = $(this).find('.active'),
          curIndex = $num.index(active),
          curNum = Number(active.text()),
          context = '#' + $(this)[0].id,
          total = $(this).attr('data-total');

        switch ($target[0].className) {
          case 'prev':
            if (curNum == 1)
              return;
            _this.checkPage(curNum - 1, context);
            break;
          case 'next':
            if (curNum == total)
              return;
            _this.checkPage(curNum + 1, context);
            break;
          case 'num':
            _this.checkPage($target.text(), context);
            break;
          default:
            break;
        }

      });
    }
  };

  let operate = new PersonalOperate;

  // 获取当前hash值
  let urlChange = () => {
    let href = window.location.href,
      curHash,
      lastHashIndex = href.lastIndexOf('#/');

    if (lastHashIndex < 0 || href.length === lastHashIndex + 2) {
      window.location.hash = '#/admin';
      return;
    } else {
      curHash = href.substring(lastHashIndex + 2);
    }
    return curHash;
  };

  operate.hashChange(urlChange());

  $(window).on('hashchange', () => {
    operate.hashChange(urlChange());
  });
});