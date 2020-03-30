import "./common/index";
import "./components/list-nav";
import listLoad from "./list/index";

$(() => {
  // 滚动加载
  const $dataInfo = $("#list-infos");
  const dataTotal = $dataInfo.data("total");
  const dataType = $dataInfo.data("type");

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

  let ajaxData = {
    page: 1,
    cate_id: $dataInfo.data("id"),
    vip: $dataInfo.data("vip") || 0,
    type: dataType
  };

  const $dom = $(".list-wrap"),
    $wrap = $dom.find("ul");

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
      : "";

  // 滚动加载功能调用
  listLoad($dom, $wrap, loadHtml, ajaxData);
});
