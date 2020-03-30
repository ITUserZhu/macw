import "../plugins/dropload";

// 列表模板
const macHtml = `<li>
      <a href="{{ item.url }}">
        <div class="img">
          <img src="{{ item.thumb }}">
        </div>
        <div class="con">
          <p class="title">{{ item.title }}</p>
          <p class="info">
            <span>{{ item.version }}</span>
            <span class="fr">更新：{{ item.update_time }}</span>
          </p>
        </div>
      </a>
    </li>`;

const pluginHtml = `<li>
        <a href="{{ item.url }}">
          <div class="img">
            <img src="{{ item.thumb }}">
          </div>
          <p class="title">{{ item.title }}</p>
          <p class="info">
            <span>{{ item.file_size }}</span>
            <span class="fr">{{ item.update_time }}</span>
          </p>
        </a>
      </li>`;

const templateHtml = `<li>
        <a href="{{ item.url }}">
          <div class="img">
            <img src="{{ item.thumb }}">
          </div>
          <p class="title">{{ item.title }}</p>
          <p class="info">
            <span>{{ item.file_size }}</span>
            <span class="fr">{{ item.update_time }}</span>
          </p>
        </a>
      </li>`;

const articleHtml = `<li>
        <a href="{{ item.url }}">
          <div class="con">
            <p class="title">{{ item.title }}</p>
            <p class="desc">{{ item.description }}</p>
            <p class="info">
              <span>浏览：{{ item.hits_total }}次</span>
              <span class="fr">更新：{{ item.update_time }}</span>
            </p>
          </div>
        </a>
      </li>`;

const wallpaperHtml = `<li>
        <a href="{{ item.url }}">
          <div class="img">
            <img src="{{ item.thumb }}">
          </div>
          <p class="title">{{ item.title }}</p>
        </a>
      </li>`;

const specialHtml = `<li>
        <a href="{{ item.url }}">
          <div class="con">
            <p class="title">{{ item.title }}</p>
            <p class="desc">{{ item.description }}</p>
            <p class="info">
              <span>共{{ item.res_num }}个内容</span>
              <span class="fr">更新：{{ item.update_time }}</span>
            </p>
          </div>
        </a>
      </li>`;

// 专题列表模板
const macTopicHtml = `<li>
        <a href="{{ item.url }}">
          <div class="img">
            <img src="{{ item.thumb_arr[0].thumb }}">
          </div>
          <div class="con">
            <p class="title">{{ item.title }}</p>
            <p class="desc">{{ item.description }}</p>
            <p class="info">
              <span>共{{ item.num }}个软件</span>
              <span class="fr">更新：{{ item.create_time }}</span>
            </p>
          </div>
        </a>
      </li>`;

const pluginTopicHtml = `<li>
        <a href="{{ item.url }}">
          <div class="img">
            <img src="{{ item.thumb_arr[0].thumb }}">
          </div>
          <p class="title">{{ item.title }}</p>
        </a>
      </li>`;

const templateTopicHtml = `<li>
        <a href="{{ item.url }}">
          <div class="img">
            <img src="{{ item.thumb_arr[0].thumb }}">
            <img src="{{ item.thumb_arr[1].thumb }}">
          </div>
          <p class="title">{{ item.title }}</p>
        </a>
      </li>`;

const articleTopicHtml = `<li>
        <a href="{{ item.url }}">
          <div class="img">
            <img src="{{ item.thumb_arr[0].thumb }}">
          </div>
          <div class="con">
            <p class="title">{{ item.title }}</p>
            <p class="desc">{{ item.description }}</p>
            <p class="info">
              <span>共{{ item.num }}篇文章</span>
              <span class="fr">更新：{{ item.create_time }}</span>
            </p>
          </div>
        </a>
      </li>`;

const wallpaperTopicHtml = `<li>
        <a href="{{ item.url }}">
          <div class="img">
            <img src="{{ item.thumb_arr[0].thumb }}">
          </div>
          <p class="title">{{ item.title }}</p>
        </a>
      </li>`;

export default ($dom, $wrap, ajaxData, dataType, ajaxUrl = "/api/list") => {
  let loadHtml =
    dataType == "mac"
      ? macHtml
      : dataType == "plugin"
      ? pluginHtml
      : dataType == "template"
      ? templateHtml
      : dataType == "article"
      ? articleHtml
      : dataType == "wallpaper"
      ? wallpaperHtml
      : dataType == "special"
      ? specialHtml
      : dataType == "mac_special"
      ? macTopicHtml
      : dataType == "plugin_special"
      ? pluginTopicHtml
      : dataType == "template_special"
      ? templateTopicHtml
      : dataType == "article_special"
      ? articleTopicHtml
      : dataType == "wallpaper_special"
      ? wallpaperTopicHtml
      : macHtml;

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
              result += loadHtml
                .replace("{{ item.url }}", v.url)
                .replace("{{ item.thumb }}", v.thumb)
                .replace("{{ item.title }}", v.title)
                .replace("{{ item.version }}", v.version || v.file_size || "")
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
                .replace("{{ item.res_num }}", v.res_num)
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
