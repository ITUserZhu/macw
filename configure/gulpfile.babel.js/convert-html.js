/*
 * @Author: Liliang Zhu
 * @Date: 2020-01-18 18:18:31
 * @Last Modified by:   Liliang Zhu
 * @Last Modified time: 2020-01-18 18:18:31
 * 编译html
 */

// gulp模块
import { src, dest } from "gulp";

// 替换html样式与脚本路径
import revCollector from "gulp-rev-collector";
// 压缩html
import minHtml from "gulp-htmlmin";
import replace from "gulp-replace";

// twig模板编译报错处理
const regOpen = /{% if[^}]+%}/;
const regClose = /{%[^}]+endif %}/;
const regBox = [regOpen, regClose];
// 正则匹配编译多余空格问题
const removeSpaceOpen = /%}\s+{{/g;
const removeSpaceClose = /}}\s+{%/g;

let convertHtml = (file, dist, basePath, host, browserSync) =>
  src([`${file}mapjson/*/*.json`, `${file}pages/**`])
    .pipe(
      revCollector({
        replaceReved: true,
        dirReplacements: {
          js: `${basePath}js/`,
          css: `${basePath}css/`
        }
      })
    )
    .pipe(
      minHtml({
        collapseWhitespace: true,
        removeComments: false,
        removeEmptyAttributes: true,
        customAttrSurround: [regBox],
        ignoreCustomFragments: [regOpen]
      })
    )
    .pipe(replace(removeSpaceOpen, "%}{{"))
    .pipe(replace(removeSpaceClose, "}}{%"))
    .pipe(replace(/__host/g, host.hostName))
    .pipe(replace(/__netname/g, host.hostTitle))
    .pipe(dest(dist))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );

export default convertHtml;
