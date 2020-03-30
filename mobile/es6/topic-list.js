import "./common/index";
import "./components/list-nav";
import listLoad from "./list/index";

$(() => {
  // 滚动加载
  const $dataInfo = $("#topic-infos");
  const dataTotal = $dataInfo.data("total");
  const dataType = $dataInfo.data("type");

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

  let ajaxData = {
    page: 1,
    cate_id: $dataInfo.data("id"),
    type: dataType
  };

  const $dom = $(".list-wrap"),
    $wrap = $dom.find("ul");

  let loadHtml =
    dataType == "mac_special"
      ? macTopicHtml
      : dataType == "plugin_special"
      ? pluginTopicHtml
      : dataType == "template_special"
      ? templateTopicHtml
      : dataType == "article_special"
      ? articleTopicHtml
      : dataType == "wallpaper_special"
      ? wallpaperTopicHtml
      : "";

  // 滚动加载功能调用
  listLoad($dom, $wrap, loadHtml, ajaxData);
});
