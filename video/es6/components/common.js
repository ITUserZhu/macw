/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-29 10:28:32 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-27 11:57:12
 * 全站通用板块
 */
// 引入登录注册模块
import {
  toLoginType
} from './login'
// 判断登录状态模块
import './login-status';
// 引入搜索联想
import '../plugins/jquery.autocomplete';
// 搜索
import {
  commonSearch
} from '../util';

$(function () {
  // 头部登录注册
  const $loginBtn = $('.header-login_btns').children('button');
  $loginBtn.on('click', function () {
    let _index = $(this).index();
    toLoginType.init().showLogin(0, _index)
  });

  // 头部搜索
  const $headerSearchBtn = $('.header-search'),
    $headerSearchBox = $('.header-search-box'),
    $headerBox = $('.header'),
    $headerForm = $('#header-form'),
    $headerIpt = $headerForm.find('input');

  $headerSearchBtn.on('click', function () {
    $headerSearchBox.show();
    $headerBox.hide();
    $headerIpt.focus();
  });

  $headerSearchBox.on('click', '.search-close', function () {
    $headerSearchBox.hide();
    $headerBox.show();
    $headerIpt.val('');
  });

  $headerForm.on('submit', function (e) {
    e.preventDefault();
    let _val = $(this).find('input').val();
    commonSearch(_val);
  });

  $headerIpt.autocomplete({
    paramName: 'k',
    formatResult: suggestion => suggestion.value,
    transformResult: response => {
      if (response) {
        return {
          suggestions: $.map(JSON.parse(response), v => ({
            value: v.thumb && ('<img src='+ v.thumb +'>' + v.value) || v.value,
            data: v.data
          }))
        };
      } else {
        return {
          suggestions: {}
        }
      }

    },
    params: {
      'm': 'video'
    },
    deferRequestBy: 500,
    width: 1040,
    type: 'POST',
    preserveInput: true,
    serviceUrl: 'https://www.macw.com/api/search_associate',
    onSelect: val => val.data && window.open(val.data)
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