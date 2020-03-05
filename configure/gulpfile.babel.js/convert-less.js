/*
 * @Author: Liliang Zhu
 * @Date: 2020-01-18 18:18:52
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-02-26 14:50:57
 * 编译less
 */

// gulp模块
import { src, dest, lastRun } from "gulp";

// less语法转译
import less from "gulp-less";
// css添加前缀
import lessAutoperfix from "less-plugin-autoprefix";
// 压缩css
import mixCss from "gulp-clean-css";
// 仅编译改变的文件
import changed from "gulp-changed";
// 重命名
import rename from "gulp-rename";
// 生成版本号
import rev from "gulp-rev";
// 条件判断
import gulpif from "gulp-if";
// 移动端自动px转换rem
import postcss from "gulp-postcss";
import pxtorem from "postcss-pxtorem";
// 本地服务同步刷新
import browser from "browser-sync";
const browserSync = browser.create();

// css编译前缀
const autoprefix = new lessAutoperfix();

let convertLess = (file, dist, type) => {
  return src(`${file}less/*.less`, {
    since: lastRun(convertLess, 100)
  })
    .pipe(
      less({
        plugins: [autoprefix]
        // 生成前缀
      })
    )
    .pipe(
      gulpif(
        type === "m",
        postcss(
          pxtorem({
            rootValue: 100,
            propList: ["*"]
          })
        )
      )
    )
    .pipe(
      mixCss({
        keepSpecialComments: "*"
        //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
      })
    )
    .pipe(rename(path => (path.basename += ".min")))
    .pipe(rev())
    .pipe(dest(`${dist}css`))
    .pipe(rev.manifest())
    .pipe(dest(`${file}mapjson/css`))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
};

export default convertLess;
