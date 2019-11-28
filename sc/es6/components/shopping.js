/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-28 09:05:18 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-28 13:50:50
 * 页面添加购物车功能
 */

import {
  SHOPPING_APIS
} from '../api';
import {
  toggleActive
} from '../util';

// 格式选择模板
let checkBoxHtml = `<div class="type-choose" id="type-choose">
    <span class="type-close">X</span>
    <div class="img-info clearfix">
      <div class="cur-img fl">
        <img src="{ src }">
      </div>
      <div class="cur-info">
        <p class="common_ovh">{ title }</p>
        <p class="cur-id">图片ID：{ id }</p>
        { info }
      </div>
    </div>
    <div class="cur-type-choose">
      <p>选择格式</p>
      <div class="types">{ types }</div>
    </div>
    <div class="choose-btn">确定</div>
  </div>`;

// 购物车
class ShoppingCar {
  constructor(opts) {
    this.opts = opts;
    this.shoppingDatas = [];
    this.init();
  }

  init() {
    this.opts.isLogin && this.getShoppingData();
    this.initColEvent();
  }

  initColEvent() {
    let _this = this;

    this.opts.wrap.on('click', '.shopping', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!_this.opts.isLogin) {
        $('#login-in').trigger('click');
        return;
      }
      let $target = $(e.target).closest('li');

      _this.curImgInfo = {
        id: $target.data('id'),
        title: $target.find('img').attr('alt'),
        src: $target.find('img').attr('src')
      }

      if ($(this).hasClass('active')) {
        _this.removeShop();
      } else {
        _this.chooseType();
      }
    })
    // 若是内容页
    if ($('#shopping').length) {
      const $shopBtn = $('#shopping');
      $shopBtn.on('click', function () {
        if (!_this.opts.isLogin) {
          $('#login-in').trigger('click');
          return;
        }
        let conId = $('#content-info').data('id'),
          type = $('.download').eq(0).data('type');

        if ($(this).hasClass('active')) {
          _this.removeShop(conId);
        } else {
          _this.sureChoose(conId, type);
        }
      });
    }
  }
  // 选中格式请求
  chooseType(id = this.curImgInfo.id) {
    $.ajax({
      url: SHOPPING_APIS.type,
      type: 'POST',
      data: {
        id
      }
    }).done(res => {
      if (res.code == 200) {
        this.curType = res.data[0].format_type;
        if (res.data.length == 1) {
          this.sureChoose();
          return;
        }
        this.renderCheckBox(res.data);
      }
    })
  }
  // 渲染模板并初始化功能
  renderCheckBox(data) {
    if ($('#type-choose').length) {
      this.removeCheckBox();
    }

    $('main').append(this.htmlFormat(data));
    this.initCheckEvent();
  }

  // 处理模板
  htmlFormat(data) {
    let infoTemp = `<p class="cur-size { active }"><span>大小：{ size }</span><span>尺寸：{ width }*{ height }</span><span>DPI：{ dpi }</span></p>`,
      typesTemp = '<span class="type-item { active }"><em>{ type }</em></span>',
      html = '',
      infoHtml = '',
      typesHtml = '';

    data.forEach((v, i) => {
      infoHtml += infoTemp
        .replace('{ active }', i == 0 ? 'active' : '')
        .replace('{ size }', v.file_size)
        .replace('{ width }', v.width || '')
        .replace('{ height }', v.height || '')
        .replace('{ dpi }', v.dpi);
      typesHtml += typesTemp
        .replace('{ active }', i == 0 ? 'active' : '')
        .replace('{ type }', v.format_type)
    });

    html += checkBoxHtml
      .replace('{ id }', this.curImgInfo.id)
      .replace('{ src }', this.curImgInfo.src)
      .replace('{ title }', this.curImgInfo.title)
      .replace('{ info }', infoHtml)
      .replace('{ types }', typesHtml);

    return html;
  }

  initCheckEvent() {
    let $checkBox = $('#type-choose');
    $checkBox
      .on('click', '.type-close', this.removeCheckBox.bind(this))
      .on('click', '.type-item', this.checkType.bind(this))
      .on('click', '.choose-btn', () => {
        this.sureChoose();
      })
  }
  // 切换格式选择
  checkType(e) {
    let $target = $(e.target).closest('span'),
      $size = $('#type-choose').find('.cur-size'),
      _index = $target.index();
    if (!$target.hasClass('active')) {
      toggleActive([$target, $size.eq(_index)]);
      this.curType = $target.find('em').text();
    }
  }
  // 确认选择
  sureChoose(id = this.curImgInfo.id, type = this.curType) {
    $.ajax({
      url: SHOPPING_APIS.add,
      type: 'POST',
      data: {
        id,
        format_type: type
      }
    }).done(res => {
      if (res.code == 200) {
        this.shoppingDatas.push(id);
        this.renderActive();
        this.removeCheckBox();
      }
    })
  }
  // 关闭弹框并删除
  removeCheckBox() {
    $('#type-choose').length && $('#type-choose').unbind('click').remove();
  }
  // 从购物车去除当前图片
  removeShop(id = this.curImgInfo.id) {
    $.ajax({
      url: SHOPPING_APIS.del,
      type: 'POST',
      data: {
        ids: id,
      }
    }).done(res => {
      if (res.code == 200) {
        this.shoppingDatas.splice(this.shoppingDatas.findIndex(value => value == id), 1)
        this.renderActive();
      }
    })
  }
  // 获取所有购物车数据
  getShoppingData() {
    $.ajax({
      url: SHOPPING_APIS.get,
      type: 'POST',
    }).done(res => {
      if (res.code == 200) {
        res.data.forEach(v => {
          this.shoppingDatas.push(v.id);
        });
        this.renderActive();
      }
    })
  }

  renderActive() {
    // 页面图片列表添加状态
    this.opts.wrap.children(this.opts.child).each((i, v) => {
      let target_id = $(v).data('id');
      if ($.inArray(target_id, this.shoppingDatas) != -1) {
        $(v).find('.shopping').addClass('active');
      } else {
        $(v).find('.shopping').removeClass('active');
      }
    })
    // 如果是内容页
    if ($('#shopping').length) {
      const conId = $('#content-info').data('id');
      if ($.inArray(conId, this.shoppingDatas) != -1) {
        $('#shopping').addClass('active').attr('title', '已加入购物车');
      } else {
        $('#shopping').removeClass('active').attr('title', '加入购物车');
      }
    }
    // 头部展示数量与动画效果
    $('.header-shopping_car').find('span')
      .addClass('animation')
      .text(this.shoppingDatas.length);

    setTimeout(() => {
      $('.header-shopping_car').find('span').removeClass('animation');
    }, 400)
  }
}

export default ShoppingCar;