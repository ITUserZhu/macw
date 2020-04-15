let lotteryHtml = `<div class="lottery-wrap" id="lottery">
    <div class="lottery-box">
        <div class="lottery-head">
            <h1>签到抽奖</h1>
            <div class="prize-close">X</div>
        </div>
        <div class="lottery-content">
            <div class="prize-content">
                <ul class="clearfix">
                    <li class="lottery-0" data-id="{ id }" data-index="0">
                        <img src="{ src }" alt="">
                        <p>{ title }</p>
                    </li>
                    <li class="lottery-1" data-id="{ id }" data-index="1">
                        <img src="{ src }" alt="">
                        <p>{ title }</p>
                    </li>
                    <li class="lottery-2" data-id="{ id }" data-index="2">
                        <img src="{ src }" alt="">
                        <p>{ title }</p>
                    </li>
                    <li class="lottery-7" data-index="7">
                        <p class="thank">谢谢参与</p>
                    </li>
                    <li class="lottery">
                        <div class="lotter-btn"><p class="title">开始抽奖</p><span>免费次数：<em>{ times }</em>次</span></div>
                        
                    </li>
                    <li class="lottery-3" data-id="{ id }" data-index="3">
                        <img src="{ src }" alt="">
                        <p>{ title }</p>
                    </li>
                    <li class="lottery-6" data-id="{ id }" data-index="6">
                        <img src="{ src }" alt="">
                        <p>{ title }</p>
                    </li>
                    <li class="lottery-5" data-id="{ id }" data-index="5">
                        <img src="{ src }" alt="">
                        <p>{ title }</p>
                    </li>
                    <li class="lottery-4" data-id="{ id }" data-index="4">
                        <img src="{ src }" alt="">
                        <p>{ title }</p>
                    </li>
                </ul>
                <div class="prize-reason">
                    <div>
                        <span class="close-res">X</span>
                        <p class="res-title"></p>
                        <img src="">
                        <p class="res-con"></p>
                        <span class="res-btn">再抽一次</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="prize-bottom">
            <div>
                <h4>活动细则：</h4>
                <p>1、 每个用户每天可签到获得一次免费抽奖机会（ 免费机会仅当天有效 ）</p>
                <p>2、 每次抽奖所需10积分</p>
            </div>
        </div>
    </div>
</div>
`;
/**
    opts => object 
    * speed 转动速度  数值越小速度越快
    * cycle 最少转圈数
    
    fn => function 
    * return id (Number)
*/

const pointImgSrc = "/assets/images/point.png";
const couponImgSrc = "/assets/images/coupon.png";

class Lottery {
  constructor(fn = 0, opts = {}) {
    this.opts = opts;
    this.callbackId = fn;
  }

  //初始化
  init(data = [], isSign) {
    // 传入奖品数据数组对象 数组长度为7  奖品id, 奖品title, 奖品类型 1，2
    this.options = Object.assign(
      {},
      {
        speed: 40,
        cycle: 100
      },
      this.opts
    ); // 合并默认参数
    // 初始一些变量
    this._index = 0; // 当前转动位置
    this._timer = null; // 计时器
    this._count = 8; // 抽奖转动的长度
    this._prize = -1; // 中奖的位置
    this._times = 0; // 转动的次数
    this._curId = 0; // 中奖的id 后台提供
    this._speed = this.options.speed;
    this._cycle = this.options.cycle * 8;
    this._isClick = false;
    this._prizeType = 0; // 中奖类型
    this._prizeTitle;

    this.data = data; // 奖品数据  后台提供
    this.isSign = isSign;
    this._render();
  }

  // 渲染抽奖模块
  _render() {
    let html = "",
      i = 0,
      j = 0,
      k = 0; // 数组赋值索引参数

    html += lotteryHtml
      .replace(/{ src }/g, v => {
        return this.data[i++].type == 1 ? pointImgSrc : couponImgSrc;
      })
      .replace(/{ title }/g, v => {
        return this.data[j++].title;
      })
      .replace(/{ id }/g, v => {
        return this.data[k++].id;
      })
      .replace("{ times }", this.isSign == 1 ? "0" : "1");

    $("main").append(html);
    this.lotteryDom = $("#lottery"); //声明dom对象

    this._initEvent(); //初始事件
  }

  _initEvent() {
    this.lotteryDom
      .on("click", ".prize-close", () => {
        this.lotteryDom.hide();
      })
      .on("click", ".close-res", () => {
        this.lotteryDom.find(".prize-reason").fadeOut();
      })
      .on("click", ".lottery, .res-btn", this.startGame.bind(this));
  }

  startGame() {
    this.lotteryDom.find(".prize-reason").fadeOut();
    // 清除免费抽奖次数
    if (this.lotteryDom.find(".lottery em").text() == 1) {
      this.lotteryDom.find(".lottery em").text(0);
    }

    if (!this._isClick) {
      // 后台请求中奖id
      this.callbackId()
        .then(val => {
          this._curId = val;
          this._roll();
        })
        .catch(msg => {
          alert(msg);
          return;
        });
    }
  }

  _getPrizeIndex() {
    let dom = this.lotteryDom.find("li").filter((i, v) => {
      return $(v).data("id") == this._curId;
    });

    this._prizeType =
      dom
        .find("p")
        .text()
        .indexOf("积分") > 0
        ? 1
        : dom
            .find("p")
            .text()
            .indexOf("优惠券") > 0
        ? 2
        : 0;
    if (this._prizeType) {
      this._prizeTitle = dom.find("p").text();
    }

    if (!dom.length) return 7; // 全都不符合返回谢谢惠顾

    return dom.data("index") / 1;
  }

  _roll() {
    this._isClick = true; // 控制暴力点击

    this.lotteryDom.find(".lottery-" + this._index).removeClass("active");
    this._index++;

    if (this._index > this._count - 1) {
      this._index = 0;
    }

    this.lotteryDom.find(".lottery-" + this._index).addClass("active");

    this._times++;
    if (this._times > this._cycle + 10 && this._prize == this._index) {
      // 转动圈数超过基数+10 并且当前位置等于中奖结果位置

      clearTimeout(this._timer); // 清除定时器

      this._showPrize(); // 展示中奖结果
    } else {
      if (this._times < this._cycle) {
        // 圈数小于设置的基数 速度边快
        this._speed -= 10;
      } else if (this._times == this._cycle) {
        this._prize = this._getPrizeIndex(); // 转动到达基数时候 获取中奖结果的索引
      } else {
        if (
          this._times > this._cycle + 10 &&
          ((this._prize == 0 && this._index == 6) ||
            this._prize == this._index + 2)
        ) {
          // 转动位置在中奖位置前一个时候 减速
          this._speed += 120;
        } else {
          this._speed += 25;
        }
        // this._speed += 25;
      }

      if (this._speed < 30) {
        // 设置最快速度
        this._speed = 30;
      }

      this._timer = setTimeout(() => {
        // 重复执行
        this._roll();
      }, this._speed);
    }
  }

  _showPrize() {
    //展示中奖结果

    let reizeDon = this.lotteryDom.find(".prize-reason");

    setTimeout(() => {
      reizeDon.fadeIn();
    }, 500);

    if (this._prizeType) {
      reizeDon
        .find("img")
        .attr("src", this._prizeType == 1 ? pointImgSrc : couponImgSrc);
      reizeDon.find(".res-title").text("恭喜获得");
      reizeDon
        .find(".res-con")
        .text(this._prizeTitle)
        .removeClass("no");
    } else {
      reizeDon.find(".res-title").text("谢谢参与");
      reizeDon
        .find(".res-con")
        .text("哎呀, 没抽中, 换个姿势, 再来一次吧~")
        .addClass("no");
      reizeDon.find("img").attr("src", "");
    }

    // 初始点击与动画
    this._isClick = false;
    this._prize = -1;
    this._times = 0;
    this._speed = this.options.speed;
  }
}

export default Lottery;
