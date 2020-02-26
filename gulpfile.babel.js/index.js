import {
  src,
  dest,
  series,
  parallel,
  watch,
} from 'gulp';
import del from 'del';
// 本地服务同步刷新
import browser from 'browser-sync';
const browserSync = browser.create();
// 引入功能组件
import convertLess from './convert-less';
import convertJs from './convert-js';
import convertHtml from './convert-html';
import copyFile from './static-copy';

// 域名与站点名称
const host = {
  hostName: 'macw',
  hostTitle: 'Macw网'
};

// 开发项目类型
const devType = 'pc';

// 本地目录
const filePath = 'project/' + devType + '/';
// 生产目录
const distResourcesPath = 'xs_cms/pub_' + devType + '/assets/';
const distPagesPath = 'xs_cms/app/' + devType + '/view/';
// 资源路径
const basePath = '/assets/';

// 删除css文件
export const delCssFile = () => {
  return del([
    distResourcesPath + 'css'
  ])
}

// 删除js文件
export const delJsFile = () => {
  return del([
    distResourcesPath + 'js'
  ])
}

// 删除资源文件夹
export const delStaticFile = () => {
  return del([
    distResourcesPath + 'images',
    distResourcesPath + 'fonts',
  ])
}
// 导出任务
// 复制文件
export const copyStatic = cb => {
  copyFile(filePath, distResourcesPath);
  cb();
}

// 复制js静态文件
export const copyJs = () => {
  return src(filePath + 'es6/static/**')
    .pipe(dest(distResourcesPath + 'js/static'));
}

// 编译css
export const compileCss = series(delCssFile, cb => {
  convertLess(filePath, distResourcesPath);
  cb();
});
// 编译js
export const compileJs = series(delJsFile, cb => {
  convertJs(filePath, distResourcesPath, host);
  cb();
});

// 编译html
export const freshHtml = cb => {
  convertHtml(filePath, distPagesPath, basePath, host);
  cb();
};


// 监测文件变化
let watchFiles = () => {
  browserSync.init({});

  watch(filePath + 'less/**/*.less', compileCss);

  watch(filePath + 'es6/**/*.js', {
    delay: 500,
  }, series(compileJs, copyJs));

  watch(filePath + 'pages/**', {
    delay: 500,
  }, freshHtml);

  watch(filePath + 'mapjson/**/*.json', {
    delay: 500,
  }, freshHtml);
}

// 默认任务
exports.default = series(parallel(compileCss, series(compileJs, copyJs)), freshHtml, copyStatic, watchFiles);