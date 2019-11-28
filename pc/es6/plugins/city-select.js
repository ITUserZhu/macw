// 城市省级联动
! function (u) {
  u.fn.citySelect = function (e) {
    if (!(this.length < 1)) {
      e = u.extend({
        url: "js/city.min.js",
        prov: null,
        city: null,
        dist: null,
        nodata: null,
        required: !0
      }, e);
      var s, i = this,
        l = i.find(".prov"),
        d = i.find(".city"),
        o = i.find(".dist"),
        c = (e.prov, e.city, e.dist, e.required ? "" : "<option value=''>请选择</option>"),
        t = function () {
          var i = l.get(0).selectedIndex;
          if (e.required || i--, d.empty().attr("disabled", !0), o.empty().attr("disabled", !0), i < 0 || void 0 === s.citylist[i].c) "none" == e.nodata ? (d.css("display", "none"), o.css("display", "none")) : "hidden" == e.nodata && (d.css("visibility", "hidden"), o.css("visibility", "hidden"));
          else {
            var n = c;
            u.each(s.citylist[i].c, function (i, t) {
              n += "<option value='" + t.n + "'>" + t.n + "</option>"
            }), d.html(n).attr("disabled", !1).css({
              display: "",
              visibility: ""
            }), a()
          }
        },
        a = function () {
          var i = l.get(0).selectedIndex,
            t = d.get(0).selectedIndex;
          if (e.required || (i--, t--), o.empty().attr("disabled", !0), i < 0 || t < 0 || void 0 === s.citylist[i].c[t].a) "none" == e.nodata ? o.css("display", "none") : "hidden" == e.nodata && o.css("visibility", "hidden");
          else {
            var n = c;
            u.each(s.citylist[i].c[t].a, function (i, t) {
              n += "<option value='" + t.s + "'>" + t.s + "</option>"
            }), o.html(n).attr("disabled", !1).css({
              display: "",
              visibility: ""
            })
          }
        },
        n = function () {
          var n = c;
          u.each(s.citylist, function (i, t) {
            n += "<option value='" + t.p + "'>" + t.p + "</option>"
          }), l.html(n), setTimeout(function () {
            null != e.prov && (l.val(e.prov), t(), setTimeout(function () {
              null != e.city && (d.val(e.city), a(), setTimeout(function () {
                null != e.dist && o.val(e.dist)
              }, 1))
            }, 1))
          }, 1), l.bind("change", function () {
            t()
          }), d.bind("change", function () {
            a()
          })
        };
      "string" == typeof e.url ? u.getJSON(e.url, function (i) {
        s = i, n()
      }) : (s = e.url, n())
    }
  }
}(jQuery);