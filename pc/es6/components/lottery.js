/// <reference path="../../../../typings/index.d.ts" />

/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-22 15:48:54 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-25 09:26:36
 * 抽奖系统
 */
import {
  LOTTERY_APIS
} from '../api';
import {
  alertBox,
  confirmBox
} from '../util';

let lottery_html = `
  <div class="lottery">
    <div class="lottery-box">
      <span class="lottery-box_close">X</span>
      <div class="lottery-box_title">
        <img src="/assets/images/lottery/lottery-sign.png">
        <p>签到抽奖<span>( <em>{sign}</em> )</span></p>
      </div>
      <div class="lottery-box_wrap">
        <ul class="active">
          {lis}
        </ul>
      </div>
      <div class="lottery-box_tips">
        <div>抽奖说明:</div>
        <p>1. 每个用户每天签到一次可获得一次抽奖机会(抽奖机会当天有效)</p>
        <p>2. 10积分抽奖一次</p>
      </div>
      {reason}
    </div>
  </div>`;

// 图片地址 
const couponImg = '/assets/images/lottery/lottery-coupon.png';
const pointImg = '/assets/images/lottery/lottery-point.png';

let lottery_li = `
  <li>
    <div class="img-bg"></div>
    <div class="lottery-box_prize">
      <div class="img">
        <img src="${ couponImg }">
      </div>
      <p></p>
    </div>
  </li>`;

let lottery_res = `
  <div class="lottery-box_reason">
    <span class="reason-close">X</span>
    <p>恭喜你</p>
    <div><img src="${ pointImg }"></div>
    <span class="res-title"></span>
    <button>再抽一次</button>
    <a href="/mac/pm#/consume">查看抽奖记录</a>
  </div>`;

let is_sign = $('#model-ids').data('sign');

class Lottery {
  constructor() {
    this.init();
  }

  init() {
    // 存在直接展示
    if (!$('.lottery').length) {
      this.getLotteryData();
    } else {
      this.doms.$lottery_box.show();
      this.initAgain();
    }
  }

  // 获取抽奖数据
  getLotteryData() {
    let _this = this;
    $.ajax({
      url: LOTTERY_APIS.prize,
      type: 'POST',
    }).done(function (res) {
      if (res.code == 200) {
        _this.lotterData = res.data.prize_info;
        _this.lotterData.push({
          id: 0,
          title: '谢谢参与',
          type: 0
        });
        _this.renderHtml();
      }
    })
  }

  // 渲染抽奖页面
  renderHtml() {
    let lisHtml = '';
    for (let i = 0; i < 9; i++) {
      lisHtml += lottery_li;
    }
    $('main').append(lottery_html.replace('{lis}', lisHtml)
      .replace('{reason}', lottery_res)
      .replace('{sign}', is_sign == 1 ? '已签到, 免费抽奖次数0' : '签到成功, 免费抽奖1次'));

    this.initDom();
    this.initEvent();
  }

  // 初始声明dom对象
  initDom() {
    this.doms = {
      $lottery_box: $('.lottery'),
      $lottery_title: $('.lottery-box_title'),
      $lottery_close: $('.lottery-box_close'),
      $lottery_ul: $('.lottery-box_wrap ul'),
      $lottery_lis: $('.lottery-box_wrap ul').children('li'),
      $lottery_res: $('.lottery-box_reason')
    }
    this.initAgain(100);
  }

  // 初始事件
  initEvent() {
    let _this = this;
    // 关闭抽奖
    this.doms.$lottery_close.on('click', function () {
      _this.doms.$lottery_box.hide();
    })
    // 点击抽奖
    this.doms.$lottery_lis.on('click', this.getPrize.bind(this))
    // 再次抽奖
    this.doms.$lottery_res.on('click', '.reason-close', function () {
      _this.doms.$lottery_res.hide();
    }).on('click', 'button', function () {
      _this.doms.$lottery_res.hide();
      _this.initAgain();
    }).on('click', 'a', function () {
      _this.doms.$lottery_box.hide();
    })
  }

  // 获取抽奖结果
  getPrize(e) {
    let _this = this;
    // 抽奖中禁止重复点击
    if (this.lotteryLoading) {
      return;
    };
    this.lotteryLoading = true;
    let $target = $(e.target).closest('li')
    $.ajax({
      url: LOTTERY_APIS.sign,
      type: 'POST',
    }).done(function (res) {
      if (res.code == 200) {
        _this.lottery_id = res.id;
        _this.showReason($target);
      } else {
        alertBox(res.msg);
      }
    });
  }

  // 展示抽奖结果
  showReason($target) {
    let _this = this;
    let curindex = 9;
    // 数组随机打乱
    this.lotterData.sort(function () {
      return 0.5 - Math.random()
    });
    // 遍历设置奖品展示
    this.lotterData.forEach((v, i) => {
      // 根据数据声明图片与文案
      let imgSrc = v.type == 1 ? pointImg : v.type == 2 ? couponImg : '',
        curTitle = v.title;
      // 闭包保存遍历
      (function (index) {

        if (v.id == _this.lottery_id) {
          // 区分谢谢参与与中奖
          if (imgSrc) {
            $target.find('img').add(_this.doms.$lottery_res.find('img')).show().attr('src', imgSrc);
          } else {
            $target.find('img').add(_this.doms.$lottery_res.find('img')).hide();
          }

          $target.find('p').add(_this.doms.$lottery_res.find('.res-title')).text(curTitle);
          curindex = index;
        } else {
          // 当前索引大于中奖索引，奖品展示前移一位
          if (index > curindex) {
            index--;
          }
          // 同上
          if (imgSrc) {
            $target.siblings().eq(index).find('img').show().attr('src', imgSrc)
          } else {
            $target.siblings().eq(index).find('img').hide();
          }
          $target.siblings().eq(index).find('p').text(curTitle);
        }
      })(i);
    })
    // 展示当前中奖,500毫秒后展示其他
    $target.addClass('active cur');
    // 1s后弹框提示
    setTimeout(() => {
      setTimeout(() => {
        this.doms.$lottery_res.fadeIn();
      }, 1000);
      $target.siblings().addClass('active')
    }, 500);
    // 根据状态修改抽奖免费剩余
    !is_sign && this.doms.$lottery_title.find('em').text('已签到, 免费抽奖次数0');
    is_sign = 1;
  }

  // 初始抽奖
  initAgain(time = 500) {
    this.lotteryLoading = false;
    this.doms.$lottery_res.hide();
    this.doms.$lottery_lis.removeClass('active cur').find('p').text('');
    this.doms.$lottery_ul.addClass('active');

    setTimeout(() => {
      this.doms.$lottery_ul.removeClass('active');
    }, time);
  }
}

export default Lottery;