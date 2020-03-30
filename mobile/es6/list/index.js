import "../plugins/dropload";

export default ($dom, $wrap, html, ajaxData, ajaxUrl = "/api/list") => {
  $dom.dropload({
    scrollArea: window,
    loadDownFn: me => {
      ajaxData.page++;
      let result = "";
      $.ajax({
        type: "POST",
        url: ajaxUrl,
        data: ajaxData,
        success: data => {
          if (data.code === 200) {
            let newData = data.data || [];

            $.each(newData, (i, v) => {
              result += html
                .replace("{{ item.url }}", v.url)
                .replace("{{ item.thumb }}", v.thumb)
                .replace("{{ item.title }}", v.title)
                .replace("{{ item.version }}", v.version)
                .replace("{{ item.file_size }}", v.file_size)
                .replace("{{ item.update_time }}", v.update_time)
                .replace("{{ item.create_time }}", v.create_time)
                .replace(
                  "{{ item.thumb_arr[0].thumb }}",
                  (v.thumb_arr && v.thumb_arr[0].thumb) || ""
                )
                .replace(
                  "{{ item.thumb_arr[1].thumb }}",
                  (v.thumb_arr &&
                    (v.thumb_arr[1].thumb || v.thumb_arr[0].thumb)) ||
                    ""
                )
                .replace("{{ item.description }}", v.description)
                .replace("{{ item.num }}", v.num)
                .replace("{{ item.hits_total }}", v.hits_total);
            });

            $wrap.append(result);

            if (!data.next) {
              // 锁定
              me.lock();
              // 无数据
              me.noData();
            }

            me.resetload();
          }
        },
        error: (xhr, type) => {
          alert("Ajax error!");
          // 即使加载出错，也得重置
          me.resetload();
        }
      });
    }
  });
};
