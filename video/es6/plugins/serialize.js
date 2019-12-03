/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-21 11:31:58 
 * @Last Modified by:   Liliang Zhu 
 * @Last Modified time: 2019-11-21 11:31:58 
 * 序列化表单数据
 */

$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};