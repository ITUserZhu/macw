/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-21 11:35:13 
 * @Last Modified by:   Liliang Zhu 
 * @Last Modified time: 2019-11-21 11:35:13 
 * 举报页面
 */
import './components/common';
// 引入工具
import {
  toggleActive
} from './util';

$(function () {
  var $form = $('#form-report'),
    $contact_type = $('#contact_type'),
    $connectType = $('.connect').children('input'),
    $submit = $('#submit'),
    $sucTip = $('.suc-tip'),
    $errorTips = $form.children('fieldset').find('p.fr'),
    isReport = false;
  var urlFrom = '',
    urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/,
    phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/,
    emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    qqReg = /[1-9][0-9]{4,14}/;
  if (document.referrer !== '') {
    urlFrom = document.referrer;
    $('#url').val(urlFrom);
  };
  $contact_type.change(function (event) {
    var _index = $(this).val() === '2' ? 2 : $(this).val() === '3' ? 3 : 1;
    $connectType.val('');
    toggleActive($connectType.eq(_index - 1));
  });

  $submit.click(function (event) {
    event.preventDefault();
    var formArr = $form.serializeArray(),
      formData = {},
      data = {};
    $.each(formArr, function () {
      formData[this.name] = this.value;
    });
    $errorTips.empty();
    if (formData.url === '') {
      $errorTips.eq(0).text('请填写举报的页面地址')
      return;
    } else if (!urlReg.test(formData.url) || formData.url.indexOf('__host.com') < 0) {
      $errorTips.eq(0).text('请输入本网站有效页面地址')
      return;
    };
    if (formData.content.length < 10) {
      $errorTips.eq(1).text('描述文字不得少于10个字符')
      return;
    };
    console.log(formData)
    if (formData.contact_way_e === '' && formData.contact_way_q === '' && formData.contact_way_p === '') {
      $errorTips.eq(2).text('请填写正确的联系方式')
      return;
    } else {
      if (formData.contact_way_e !== '' && !emailReg.test(formData.contact_way_e)) {
        $errorTips.eq(2).text('请填写正确邮箱格式')
      };
      if (formData.contact_way_q !== '' && !qqReg.test(formData.contact_way_q)) {
        $errorTips.eq(2).text('请填写正确qq号码格式')
      }
      if (formData.contact_way_p !== '' && !phoneReg.test(formData.contact_way_p)) {
        $errorTips.eq(2).text('请填写正确手机号码格式')
      }
    }
    data.url = formData.url;
    data.content = formData.content;
    data.contact_type = formData.contact_type;
    data.contact_way = formData.contact_way_e !== '' ? formData.contact_way_e : formData.contact_way_q !== '' ? formData.contact_way_q : formData.contact_way_p;
    !isReport && sendReport(data);
  });

  function sendReport(data) {
    $.ajax({
      url: '/api/error_report',
      type: 'POST',
      data: data,
      success: function (res) {
        if (res.code == 200) {
          $sucTip.text(res.msg);
        } else {
          $sucTip.addClass('active').text(res.msg)
        };
        isReport = true;
      }
    })
  }
});