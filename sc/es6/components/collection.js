/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-28 09:09:35 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-28 13:46:54
 * 页面列表收藏，在登陆后初始化
 */

import {
  CONENT_APIS
} from '../api';
const MODELID = 5;

class Collection {
  constructor(opts) {
    this.opts = opts;
    this.init();
  }

  init() {
    !!this.opts.datas && this.renderActive();
    this.initEvent();
  }

  renderActive() {
    // 页面图片列表添加状态
    this.opts.wrap.children(this.opts.child).each((i, v) => {
      let target_id = $(v).data('id');
      if ($.inArray(target_id, this.opts.datas) != -1) {
        $(v).find('.collect').addClass('active');
      } else {
        $(v).find('.collect').removeClass('active');
      }
    })
    // 如果是内容页面
    if ($('#collect').length) {
      const conId = $('#content-info').data('id');
      if ($.inArray(conId, this.opts.datas) != -1) {
        $('#collect').addClass('active').attr('title', '已收藏');
      } else {
        $('#collect').removeClass('active').attr('title', '添加收藏');
      }
    }
  }

  initEvent() {
    let _this = this;
    // 点击收藏或取消
    _this.opts.wrap.on('click', '.collect', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!_this.opts.datas) {
        $('#login-in').trigger('click');
        return;
      }

      let target_id = $(e.target).closest('li').data('id');
      _this.checkCol(target_id)
    });

    // 如果在内容页
    if ($('#collect').length) {
      const $colBtn = $('#collect');
      $colBtn.on('click', function () {
        if (!_this.opts.datas) {
          $('#login-in').trigger('click');
          return;
        }

        let conId = $('#content-info').data('id');

        _this.checkCol(conId);
      });
    }
  }

  checkCol(id) {
    this.colAjax({
      model_id: MODELID,
      res_id: id,
      is_click: true
    }, (res) => {
      if (res.status == 1) {
        this.opts.datas.push(id);
      } else {
        this.opts.datas.splice(this.opts.datas.findIndex(v => v == id), 1);
      }
      this.renderActive();
    });
  }

  colAjax(data, callback) {
    $.ajax({
      url: CONENT_APIS.collect,
      type: 'POST',
      data,
    }).done(res => {
      if (res.code == 200) {
        callback(res)
      } else if (res.code == 400 || res.code == 501) {
        $('#login-in').trigger('click');
      }
    })
  }
}

export default Collection;