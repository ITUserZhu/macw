/*
 * @Author: Liliang Zhu
 * @Date: 2020-01-18 18:19:07
 * @Last Modified by:   Liliang Zhu
 * @Last Modified time: 2020-01-18 18:19:07
 * 编译js
 */

// gulp模块
import { src, dest } from "gulp";

import named from "vinyl-named";
// webpack包管理
import webpack from "webpack";
import gulpWebpack from "webpack-stream";
// 仅编译改变的文件
import changed from "gulp-changed";
// 重命名
import rename from "gulp-rename";
// 生成版本号
import rev from "gulp-rev";
// 替换host地址
import replace from "gulp-replace";
// 本地服务同步刷新
import browser from "browser-sync";
const browserSync = browser.create();

import webpackConfig from "../webpack.config";

let convertJs = (file, dist, host) => {
  return src(`${file}es6/*.js`)
    .pipe(
      changed(`${dist}js`, {
        extension: ".js"
      })
    )
    .pipe(named())
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(rename(path => (path.basename += ".min")))
    .pipe(rev())
    .pipe(replace(/__host/g, host.hostName))
    .pipe(replace(/__netname/g, host.hostTitle))
    .pipe(dest(`${dist}js`))
    .pipe(rev.manifest())
    .pipe(dest(`${file}mapjson/js`))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
};

export default convertJs;
