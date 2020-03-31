let picHtml = `<li class="item">
          <a href="{{ item.url }}">
            <div class="img">
              <img src="{{ item.thumb }}" alt="{{ item.title }}">
            </div>
          </a>
        </li>`;
let curPage = 1;

export default (ajaxData, callback, ajaxUrl = "/api/list") => {
  ajaxData.page = ++curPage;
  $.ajax({
    url: ajaxUrl,
    type: "POST",
    data: ajaxData
  })
    .done(res => {
      let str = "";
      if (res.code == 200 && res.data) {
        $.each(res.data, function(index, el) {
          str += picHtml
            .replace("{{ item.thumb }}", el.thumb)
            .replace("{{ item.url }}", el.url)
            .replace("{{ item.title }}", el.title);
        });
      }

      callback(res, str);
    })
    .fail(function(error) {
      console.log(error);
    });
};
