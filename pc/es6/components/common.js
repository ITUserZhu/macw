/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-15 10:28:32 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-01-10 09:16:36
 * 全站通用板块
 */
// 引入登录注册模块
import {
  toLoginType
} from './login'
import SideBar from './sidebar';
// 判断登录状态模块
import './login-status';
// 搜索
import {
  commonSearch
} from '../util';
// 引入搜索联想
import '../plugins/jquery.autocomplete';
// 搜索接口
import {
  SEARCH
} from '../api';

$(function () {
  // 头部登录注册
  const $loginBtn = $('.header-login_btns').children('button');
  $loginBtn.on('click', function () {
    let _index = $(this).index();
    toLoginType.init().showLogin(0, _index)
  });

  // 头部搜索切换与联想
  const $headerSearchBtn = $('.header-search'),
    $headerSearchBox = $('.header-search-box'),
    $headerBox = $('.header'),
    $headerForm = $('#header-form'),
    $headerFormIpt = $headerForm.find('input');
  // 切换展示
  $headerSearchBtn.on('click', function () {
    $headerSearchBox.show().find('input').focus();
    $headerBox.hide();
  });
  // 切换隐藏
  $headerSearchBox.on('click', '.search-close', function () {
    $headerSearchBox.hide();
    $headerSearchBox.find('input').val('');
    $headerBox.show();
  });
  // 搜索
  $headerForm.on('submit', function (e) {
    e.preventDefault();
    let _val = $(this).find('input').val(),
      _model = $(this).data('model') || 'all';
    commonSearch(_val, _model);
  });
  // 联想
  $headerFormIpt.autocomplete({
    paramName: 'k',
    transformResult: function (response) {
      if (response) {
        return {
          suggestions: $.map(JSON.parse(response), function (v) {
            return {
              value: v.value.replace(/<\/?em>/g, ''),
              data: v.data
            };
          })
        };
      } else {
        return {
          suggestions: {}
        }
      }

    },
    params: {
      'm': $headerForm.data('model')
    },
    type: 'POST',
    serviceUrl: SEARCH.name,
    onSelect: function (val) {
      val.data && window.open(val.data);
      return;
    }
  });



  // 侧边栏生成
  new SideBar({
    item1: {
      selector: '/vip.html',
      iconClass: 'vip',
      cellText: 'VIP',
    },
    item2: {
      iconClass: 'qq',
      cellText: 'QQ客服',
      img: '/assets/images/sidebar/qq.jpg'
    },
    item3: {
      iconClass: 'wx',
      cellText: '微信客服',
      img: '/assets/images/sidebar/wx.png'
    },
    item4: {
      iconClass: 'wxgzh',
      cellText: '微信公众号',
      img: '/assets/images/sidebar/wxgzh.jpg'
    },
    item5: {
      iconClass: 'complaint',
      selector: '/complaint.html',
      cellText: '内容举报',
    },
    goTopIcon: {
      iconClass: 'back-top',
      cellText: '返回顶部'
    },
    goTopIconShow: 500
  });
});

// 百度推送
(function () {
  let bp = document.createElement('script');
  let curProtocol = window.location.protocol.split(':')[0];
  if (curProtocol === 'https') {
    bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
  } else {
    bp.src = 'http://push.zhanzhang.baidu.com/push.js';
  }
  let s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(bp, s);
})();

// 百度统计
// (function() {
//   const bdtjcode = 'a8714ebeafd6bbd7b7d4b3deb6c10797';
//   let hm = document.createElement("script");
//   hm.src = "https://hm.baidu.com/hm.js?" + bdtjcode;
//   let s = document.getElementsByTagName("script")[0]; 
//   s.parentNode.insertBefore(hm, s);
// })();

// 360统计
// (function(){
//   const tjcode = 'bbaf680236247d895408bb91949bc846';
//   let src = (document.location.protocol == "http:") 
//     ? "http://js.passport.qihucdn.com/11.0.1.js?"
//     :"https://jspassport.ssl.qhimg.com/11.0.1.js?";
//   document.write('<script src="' + src + tjcode + '" id="sozz"><\/script>');
// })();