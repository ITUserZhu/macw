/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-27 17:05:58 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-11 11:52:12
 */
// 引入公用模块
import './components/common';
// 引入下载功能
import Download from './components/download-recharge';
// api引入
import {
  SHOPPING_APIS
} from './api';

import {
  confirmBox
} from './util';

let trHtml = `
  <tr data-id="{{ id }}">
    <td><i class="select icon-right {{ active }}"></i></td>
    <td><a href="{{ url }}" target="_blank">
      <div class="img"><img src="{{ src }}" alt=""></div>
      <span class="name">{{ title }}</span></a>
    </td>
    <td class="type-choose">{{ options }} </td>
    <td>{{ point }}积分</td>
    <td><i class="icon-del"></i></td>
  </tr>`;

$(function () {
  let checkShopping = {
    downShopList: [],
    datas: [],
    downTimer: null,
    // 初始方法
    init() {
      this.getShopList();
      this.bindEvents();
    },
    // 获取购物车数据
    getShopList() {
      $.ajax({
        url: SHOPPING_APIS.get,
        type: 'POST',
      }).done((res) => {
        if (res.code == 200) {
          this.datas = res.data;
          this.datas.forEach(function (v) {
            if (!v.point) {
              let point = v.types.filter(function (vi) {
                return vi.status;
              })
              $.extend(v, {
                point: point[0].point
              });
            };
            if (!v.active) {
              $.extend(v, {
                active: false
              });
            };
          });
        }
        this.render();
      })
    },
    // 绑定事件
    bindEvents() {
      $('tbody')
        .on('click', '.select', this.toggle.bind(this))
        .on('change', ':checkbox', this.changeSel.bind(this))
        .on('click', '.icon-del', this.destroy.bind(this));
      $('#toggle-all').on('click', this.toggleAll.bind(this));
      $('.del-all').on('click', this.destroyAll.bind(this));
      $('#down').on('click', this.downloadBtn.bind(this));
      $('.destroy-all').on('click', this.emptyAll.bind(this));
      $('.shop-top').on('click', function () {
        $('.table').animate({
            scrollTop: 0
          },
          300);
      });
    },
    // 获取索引
    getIndexFromEl(el) {
      let id = $(el).closest('tr').data('id');
      let datas = this.datas;
      let i = datas.length;

      while (i--) {
        if (datas[i].id == id) {
          return i;
        }
      }
    },
    // 获取没选中的数据
    getNoActiveTodos() {
      return this.datas.filter(function (data) {
        return !data.active;
      });
    },
    // 获取已选中数据
    getSelData() {
      return this.datas.filter(function (data) {
        return data.active;
      });
    },
    // 切换状态
    toggle(e) {
      let i = this.getIndexFromEl(e.target);
      this.datas[i].active = !this.datas[i].active;
      this.render();
    },
    // 全选切换
    toggleAll(e) {
      $(e.target).toggleClass('active');
      let isSelAll = $(e.target).hasClass('active') ? true : false;
      this.datas.forEach(function (data) {
        data.active = isSelAll;
      });

      this.render();
    },
    // 删除当前
    destroy(e) {
      let id = $(e.target).closest('tr').data('id');

      this.destroyAjax({
        ids: id
      }, () => {
        this.datas.splice(this.getIndexFromEl(e.target), 1);
      });
    },
    // 删除所有选中
    destroyAll() {
      let ids = [];
      if (this.getSelData().length == 0) return;
      this.getSelData().forEach(function (v) {
        ids.push(v.id)
      });
      confirmBox('确定删除所有选中？', () => {
        this.destroyAjax({
          ids: ids.join(',')
        }, () => {
          this.datas = this.getNoActiveTodos();
        });
      })

    },
    // 清空所有
    emptyAll() {
      let ids = [];
      if (this.datas.length == 0) return;

      this.datas.forEach(function (v) {
        ids.push(v.id)
      });

      confirmBox('确定清空购物车？', () => {
        this.destroyAjax({
          ids: ids.join(',')
        }, () => {
          this.datas = [];
        });
      })
    },
    // 删除请求
    destroyAjax(data, fn) {
      $.ajax({
          url: SHOPPING_APIS.del,
          type: 'POST',
          data: data
        })
        .done(() => {
          fn();
          this.render();
        });
    },
    // 改变选中
    changeSel(e) {
      let cPonit = $(e.target).val() / 1,
        cI = $(e.target).closest('label').index(),
        isChecked = $(e.target).prop('checked'),
        index = this.getIndexFromEl(e.target);

      this.datas.forEach(function (v, i) {
        if (i === index) {
          if (isChecked) {
            v.point += cPonit;
          } else {
            v.point -= cPonit;
          }
          v.types.forEach(function (vl, ci) {
            if (ci == cI) {
              vl.status = !vl.status;
            }
          })
        }
      });

      this.render();
    },
    // 渲染数据
    render() {
      let datas = this.datas;
      $('.header-shopping_car').find('span')
        .addClass('animation')
        .text(datas.length);

      setTimeout(() => {
        $('.header-shopping_car').find('span').removeClass('animation');
      }, 400);

      $('tbody').html(this.todoTemplate(datas));
      $('#toggle-all').add('#bottom-all').attr('class', (this.getNoActiveTodos().length === 0 && datas.length != 0) ? 'select icon-right active' : 'select icon-right');
      this.renderFooter();
    },
    // 渲染底部
    renderFooter() {
      let allPoints = 0;
      let datas = this.getSelData();
      datas.forEach(function (v) {
        allPoints += v.point
      });
      $('#point-num').text(allPoints);
    },
    // 处理模板
    todoTemplate(data) {
      let html = '',
        tempHtml = trHtml;
      if (data.length < 1) {
        return '<p>购物车空空！赶快去添加吧！</p>';
      };
      $.each(data, function (index, el) {
        let str = '';
        $.each(el.types, function (i, v) {
          if (v.status) {
            str += '<label><input type="checkbox" checked name="type" value="' + v.point + '"/>' + v.name + '</label>';
          } else {
            str += '<label><input type="checkbox" name="type" value="' + v.point + '"/>' + v.name + '</label>';
          }
          return str;
        });
        html += tempHtml
          .replace('{{ id }}', el.id)
          .replace('{{ title }}', el.title)
          .replace('{{ src }}', el.src)
          .replace('{{ url }}', el.url)
          .replace('{{ active }}', el.active ? 'active' : '')
          .replace('{{ point }}', el.point)
          .replace('{{ options }}', str)
      });
      return html;
    },
    // 下载按钮
    downloadBtn() {
      let _this = this,
        downData = _this.getSelData();
      if (downData.length === 0) return;
      _this.downShopList = [];
      downData.forEach(function (v) {
        v.types.forEach(function (v) {
          if (v.status) _this.downShopList.push(v.id);
        });
      });
      if (_this.downShopList.length === 0) return;
      confirmBox('确定下载并删除已选中素材吗？', () => {
        this.download(_this.downShopList);
      }, {
        title: '下载提示',
        buttons: {
          sure: {
            btnClass: 'btn-green'
          }
        }
      })
    },
    // 下载
    download(data) {
      let datas = data.join(',');
      new Download(datas, 1);
      // 轮询是否成功下载， 成功清空购物车
      let hasDownInter = setInterval(() => {
        if (window.sessionStorage.downloadOk == 'true') {
          this.downShopList = [];
          this.destroyAll();
          clearInterval(hasDownInter);
          window.sessionStorage.removeItem('pic_shop');
          window.sessionStorage.removeItem('downloadOk');
        };
      }, 1000);
      // 没能下载则在5s 后停止轮询
      setTimeout(function () {
        clearInterval(hasDownInter);
      }, 5000);
    },
  };
  // 调用初始
  checkShopping.init();
});