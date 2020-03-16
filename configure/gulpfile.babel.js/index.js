/*
 * @Author: Liliang Zhu
 * @Date: 2020-02-28 18:18:52
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-03-05 14:50:57
 * 编译less
 */

import { src, dest, series, parallel, watch } from "gulp";

// 本地服务同步刷新
import browser from "browser-sync";
const browserSync = browser.create();
// 引入功能组件
import del from "del";
import convertLess from "./convert-less";
import convertJs from "./convert-js";
import convertHtml from "./convert-html";
import copyFile from "./static-copy";

// 域名与站点名称
const host = {
  hostName: "macw",
  hostTitle: "MacW网"
};

// 开发项目类型 pc sc video mobile
const devType = "mobile";

// 本地目录
const filePath = `project/${devType}/`;
// 生产目录
const distResourcesPath = `xs_cms/pub_${devType}/assets/`;
const distPagesPath = `xs_cms/app/${devType}/view/`;
// 资源路径
const baseProjectPath = "/assets/";

// 打印提示颜色
const word_color = "\x1b[91m"; // 橘黄

// 删除css文件
export const delCssFile = () => {
  console.log(word_color, `${new Date()} 清除css`);
  return del([`${distResourcesPath}css`]);
};

// 删除js文件
export const delJsFile = () => {
  console.log(word_color, `${new Date()} 清除js`);
  return del([`${distResourcesPath}js`]);
};

// 删除资源文件夹
export const delStaticFile = () => {
  console.log(word_color, `${new Date()} 清除资源`);
  return del([`${distResourcesPath}images`, `${distResourcesPath}fonts`]);
};
// 导出任务
// 复制文件
export const copyStatic = cb => {
  console.log(word_color, `${new Date()} copy资源`);
  copyFile(filePath, distResourcesPath);
  cb();
};

// 复制js静态文件
export const copyJs = () => {
  console.log(word_color, `${new Date()} copy静态js`);
  return src(`${filePath}es6/static/**`).pipe(
    dest(`${distResourcesPath}js/static`)
  );
};

// 编译css
export const compileCss = series(delCssFile, cb => {
  console.log(word_color, `${new Date()} 编译css`);
  convertLess(filePath, distResourcesPath, devType, browserSync);
  cb();
});
// 编译js
export const compileJs = series(delJsFile, cb => {
  console.log(word_color, `${new Date()} 编译js`);
  convertJs(filePath, distResourcesPath, host, browserSync);
  cb();
});

// 编译html
export const freshHtml = cb => {
  console.log(word_color, `${new Date()} 编译html`);
  convertHtml(filePath, distPagesPath, baseProjectPath, host, browserSync);
  cb();
};

// 监测文件变化
let watchFiles = () => {
  browserSync.init({});

  watch(
    `${filePath}less/**/*.less`,
    {
      delay: 500
    },
    compileCss
  );

  watch(
    `${filePath}es6/**/*.js`,
    {
      delay: 500
    },
    series(compileJs, copyJs)
  );

  watch(
    `${filePath}pages/**`,
    {
      delay: 500
    },
    freshHtml
  );

  watch(
    `${filePath}mapjson/**/*.json`,
    {
      delay: 500
    },
    freshHtml
  );
};

// 默认任务
exports.default = series(
  parallel(compileCss, series(compileJs, copyJs)),
  freshHtml,
  series(delStaticFile, copyStatic),
  watchFiles
);
