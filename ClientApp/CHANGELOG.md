
# <a href="https://gitee.com/lyt-top/vue-next-admin" target="_blank">vue-next-admin update log</a>

🎉🎉🔥 `vue-next-admin` is a background open source free template library based on vue3.x, Typescript, vite, Element plus, etc., suitable for mobile phones, tablets, and PCs (for vue2.x, please switch to the vue-prev-admin branch)

## 2.2.0

`2022.07.10`

⚡⚡⚡ Added `getApiUserInfo` under [/sec/stores/userInfo.ts](https://gitee.com/lyt-top/vue-next-admin/blob/master/src/stores/userInfo.ts) Interface simulation data `setTimeout` is 3 seconds

- 🌟 Update dependencies to update to the latest version
- 🐞 Fixed [main interface re-authorization button stuck and not jumping to the login interface #I5C3JS](https://gitee.com/lyt-top/vue-next-admin/issues/I5C3JS), thanks [@Hero-Typ ](https://gitee.com/tian_yu_peng)
- 🐞 Fixed compilation warning [#I5CVSB](https://gitee.com/lyt-top/vue-next-admin/issues/I5CVSB), replaced globally with `:deep(attr)`, thanks [@Linvas]( https://gitee.com/linvas). Reference document: [vue3 sfc-style](https://v3.cn.vuejs.org/api/sfc-style.html#style-scoped). `node_modules\print-js\dist\print.js` requires the `print-js` author to adapt or remove `"print-js": "^1.6.0"` in `package.json`
- 🐞 Fix [vue-next-admin-template-js version front-end control routing: userInfo.js request user information interface error, if the route cannot be loaded, you can write a timer to simulate the interface and the same error #I5F1HP](https:// gitee.com/lyt-top/vue-next-admin/issues/I5F1HP), thanks [@白白水](https://gitee.com/libin951223)

## 2.1.1

`2022.05.27`

- 🌟 Update dependencies to update to the latest version
- 🎯 Optimize the `:active` style in dark mode when `<el-button text></el-button>`
- 🎯 Optimization [Page cache fails after refresh #I58U75](https://gitee.com/lyt-top/vue-next-admin/issues/I58U75)), thanks [@ls0428](https://gitee. com/ls0428)
- 🎯 Optimization [SvgIcon is invalid for setting color of downloaded Svg image #I59ND0](https://gitee.com/lyt-top/vue-next-admin/issues/I59ND0)), thanks [@elus_z](https:/ /gitee.com/elus_z)
- 🎯 Optimize `/src/utils/toolsValidate.ts` tool class
- 🐞 Fix [Layout switching, one more tab will be displayed in TagsView #I58WGM](https://gitee.com/lyt-top/vue-next-admin/issues/I58WGM), thanks [@lg_boy](https: //gitee.com/lg_boy)
- 🐞 Fix [If you set the top breadcrumb navigation open icon isBreadcrumbIcon=true, there will be some problems with the style. If it is not turned on, it will be normal #I58VB8](https://gitee.com/lyt-top/vue-next-admin/issues/ I58VB8)
- 🐞 Fixed the problem that when the routing address is entered incorrectly in the address bar and the routing address is entered incorrectly again after returning to the homepage, the 404 issue will not be redirected.
- 🐞 Fix [2.1.0 version of the icon selection component fails after multiple clicks #I590TH](https://gitee.com/lyt-top/vue-next-admin/issues/I590TH), thanks [@quber] (https://gitee.com/quber)

## 2.1.0

`2022.04.18`

⚡⚡⚡ This version is a destructive update, and the optimization content is as follows: (Update with caution! Update with caution!! Update with caution!!!). Because `vuex` is replaced by `pinia`

- 🌟 Update dependencies to update to the latest version
- 🎯 Optimize the problem that some interface pictures are not displayed (replace the gitee online picture address source)
- 🎯 Optimization: Add a blank line between the introduction and logic of each interface method to facilitate the differentiation of content.
- 🎯 Optimize the icon selector [#I4YAHB](https://gitee.com/lyt-top/vue-next-admin/issues/I4YAHB), thank you [@真有你的](https://gitee.com/ sunliusen)
- 🎯 Optimize the icon selector icon type when the type is all, the type ali, ele, awe echo problem
- 🎯 Optimize and remove development environment i18n console warning, page code: [i18n/index.ts](https://gitee.com/lyt-top/vue-next-admin/blob/master/src/i18n/index. ts)
- 🎯 Optimize the `NextLoading.start()` method to prevent a brief blank when entering the interface for the first time
- 🎯 Optimization: If there are parameters in the address bar to log out, logging in again will not jump to the previous interface problem `src/layout/navBars/breadcrumb/user.vue`
- 🎯 Optimize the `SvgIcon` component to prevent the `tagsView right-click menu from closing` when `turning on the Tagsview icon`, error reporting, the workflow cannot be connected, and the close button disappears in full screen
- 🎯 Optimization [If there are special characters such as Chinese in the URL, keep-alive will be invalid when switching the tab for the first time #I55JS7](https://gitee.com/lyt-top/vue-next-admin/issues/I55JS7) ,Thanks[yuyong1566](https://gitee.com/yuyong1566)
- 🎯 Optimize [wangEditor](https://www.wangeditor.com/) updated to v5, [wangeditor rich text editor demo instance in vue3 version online example, cannot wrap line #I5565B](https://gitee.com /lyt-top/vue-next-admin/issues/I5565B), thanks @[jenchih](https://gitee.com/jenchih)
- 🎯 Optimization [When closing tagview, the height will change when refreshing, and a scroll bar will appear](https://gitee.com/lyt-top/vue-next-admin/issues/I55FHM), thanks [Zhang Song]( https://gitee.com/zs310071113)
- 🎯 Optimize [routing parameters](https://lyt-top.gitee.io/vue-next-admin-preview/#/params/common) demonstration
- 🎉 Add [vuex](https://vuex.vuejs.org/) and replace it with [pinia](https://pinia.vuejs.org/getting-started.html)
- 🎉 Added tagsView to support custom tagsView names (useful for article details), go to experience: [Routing Parameters/Common Routing](https://lyt-top.gitee.io/vue-next-admin-preview/#/ params/common). Added tagsView to support custom name internationalization, thanks [@q7but](https://gitee.com/q7but), [!22 add to add custom tagVIewName expansion, support internationalization](https://gitee.com/ lyt-top/vue-next-admin/pulls/22/files), thanks [@tony_tong_xin](https://gitee.com/tony_tong_xin)
- 🐞 Fix adaptation `"element-plus": "^2.1.9", version 2.2.0`
- 🐞 Fix [First-level menu display issue after the navigation bar is laid out horizontally#I4Z3M3](https://gitee.com/lyt-top/vue-next-admin/issues/I4Z3M3)
- 🐞 Fixed the problem of high navigation menu highlighting and inconsistent navigation height in horizontal layout of level 3 and above.
- 🐞 Fix: In column mode, the selected menu is of primary style, and the text when the mouse is moved also changes to primary color. Thanks to the group friend @古夜-流殇
- 🐞 Fix [The color is changed in vuex but it does not take effect #I4WFMA](https://gitee.com/lyt-top/vue-next-admin/issues/I4WFMA)
- 🐞 Fixed the global theme primary reporting an error after clearing the color, [#I4X0LG](https://gitee.com/lyt-top/vue-next-admin/issues/I4X0LG), thanks [BUG-oriented programming](https:// gitee.com/fhtfy)
- 🐞 Fix [.eslintrc.js file rules tag name error #I53IPK](https://gitee.com/lyt-top/vue-next-admin/issues/I53IPK), thanks [yuyong1566](https://gitee .com/yuyong1566)
- 🐞 Fixed the error issue of `tagsView right-click menu is closed` when `opening Tagsview icon`
- 🐞 Fixed the problem of error when `router.push` path cannot be found, `404, 401 interface` has been moved to `main` main layout (previously full screen)
- 🐞 Fix [Global modification of component size fails](https://gitee.com/lyt-top/vue-next-admin/issues/I551RP), thanks to [lg_boy](https://gitee.com/lg_boy)
- 🐞 Fix [When modifying the configuration, you need to clear the `window.localStorage` browser permanent cache every time before the configuration will take effect. Problem solved #I567R1](https://gitee.com/lyt-top/vue-next -admin/issues/I567R1), thanks [@lanbao123](https://gitee.com/lanbao123)
- 🐞 Fix [After marking a tab page that needs to be cached, opening it from the left menu again still displays the cached page content #I4UY3G](https://gitee.com/lyt-top/vue-next-admin/issues /I4UY3G), thank you @axcc1234, special thanks to group friend @华izai
- 🌈 Reconstruct routing (`/src/router/index.ts`) to solve the problem of No match found for location with path "xxx" (front-end control, back-end control is not resolved)

## 2.0.2

`2022.03.04`

- 🌟 更新 依赖更新最新版本
- 🎯 优化 Alert 提示添加边框
- 🎯 优化 功能 / 数字滚动 演示界面
- 🐞 修复 全局主题按钮颜色 :active 问题
- 🐞 修复 Dropdown 下拉菜单样式问题
- 🐞 修复 SvgIcon 图标组件动态切换时报警告问题，[SvgIcon 改变 name 时可能导致图像不显示](https://gitee.com/lyt-top/vue-next-admin/issues/I4VGE0)，感谢@axcc1234

## 2.0.1

`2022.02.25`

- 🌟 更新 依赖更新最新版本
- 🎯 优化 svgIcon 图标组件
- 🎯 优化 vite.config.ts 打包，感谢群友@YourObjec
- 🐞 修复 tagViews 开启图标不显示问题（风格 5），感谢群友@坏人
- 🐞 修复 [Element Plus 1.2.0-beta.6 以后的版本 el-table 在移动端无法左右滑动](https://gitee.com/lyt-top/vue-next-admin/issues/I4UPTP)，感谢@YGDada

## 2.0.0

`2022.02.21`

⚡⚡⚡ 此版本为破环性更新，优化内容如下：（谨慎更新！谨慎更新！！谨慎更新！！！）。演示界面建议直接覆盖文件。如需使用之前版本，请前往[gitee 发行版](https://gitee.com/lyt-top/vue-next-admin/releases) 进行对应版本下载。基础版会基于 `master` 分支进行修改

- 🌟 更新 依赖更新最新版本
- 🌟 更新 登录页、首页
- 💔 移除 vue-web-screen-shot
- 💔 移除 城市多级联动，完整 json 数据请去 [vue-next-admin-images/menu](https://gitee.com/lyt-top/vue-next-admin-images/tree/master/menu) 仓库查看
- 💔 移除 功能/echartsTree 树图
- 💔 移除 其它设置/Tagsview 风格 2、Tagsview 风格 3
- 💔 移除 功能/验证器
- 🚧 调整 src/api 编写方式
- 🚧 调整 自定义封装公用组件演示，更好的维护
- 🎉 新增 Volar 支持，vs code 配置参考 [Vue Language Features (Volar)](https://lyt-top.gitee.io/vue-next-admin-doc-preview/home/vscode/)
- 🎉 新增 `SvgIcon` 支持本地 svg 图标使用
- 🎉 新增 表单表格验证演示
- 🎯 优化 全局主题（移除 success、info、warning、danger）
- 🎯 优化 工作流（开源）
- 🎯 优化 element plus svg 图标，`elementXXX` 改成 `ele-XXX`
- 🌈 重构 深色模式
- 🌹 合并 [处理 parent 的 h100 由于外层有 min-height 导致失效的问题](https://gitee.com/lyt-top/vue-next-admin/pulls/20)，感谢@MaxNull、@21030442-mao
- 🐞 修复 element plus 升级 `^1.3.0-beta.5` 后 组件 size 大小问题（大改：涉及布局、演示界面）
- 🐞 修复 vs code 使用 Vue Language Features (Volar) 插件 代码报红问题（可以把公用的 ts 类型定义封装起来公用）

## 1.2.2

`2021.12.21`

- 🌟 更新 依赖更新最新版本
- 🎯 优化 iframes 滚动条问题
- 🎯 优化 部署后每次都要强制刷新清浏览器缓存问题
- 🎉 新增 工具类百分比验证演示
- 🐞 修复 [tag-view 标签右键会超出浏览器 #I4KN78](https://gitee.com/lyt-top/vue-next-admin/issues/I4KN78)

## 1.2.1

`2021.12.12`

- 🌟 更新 依赖更新最新版本
- 🎯 优化 cropper 裁剪时卡顿问题 [#I4M2VQ](https://gitee.com/lyt-top/vue-next-admin/issues/I4M2VQ)
- 🎯 优化 Wangeditor 富文本编辑器的问题 [#I4LPC1](https://gitee.com/lyt-top/vue-next-admin/issues/I4LPC1)、[#I4LM7I](https://gitee.com/lyt-top/vue-next-admin/issues/I4LM7I)
- 🐞 修复 浏览器标题问题
- 🐞 修复 element plus svg 图标引入
- 🐞 修复 工作流不可以拖线连接问题

## 1.2.0

`2021.11.28`

- 🌟 更新 依赖更新最新版本
- 🎯 优化 深色模式
- 🎯 优化 `/@/utils` 文件夹，合并删除单一内容
- 🎯 优化 系统设置：菜单管理（新增、修改）、角色管理（新增菜单权限）、用户管理、部门管理、字典管理
- 🎯 优化 登录界面逻辑、权限管理逻辑
- 🎯 优化 同步 [vue-next-admin-images](https://gitee.com/lyt-top/vue-next-admin-images/tree/master/menu) 后端控制菜单模拟数据
- 🎉 新增 适配 Font Icon 向 SVG Icon 迁移（改动大，"element-plus": "^1.2.0-beta.4" 谨慎更新）
- 🐞 修复 热更新问题，感谢@甜蜜蜜
- 🐞 修复 页面/element 字体图标演示
- 🐞 修复 功能/图标选择器演示，新增高级功能 [issues #I4GJXQ](https://gitee.com/lyt-top/vue-next-admin/issues/I4GJXQ)

## 1.1.2

`2021.10.17`

- 🌟 更新 依赖更新最新版本
- 🐞 修复 开启全屏时，刷新界面被还原成未全屏的状态
- 🎯 优化 tagsView 右键菜单关闭逻辑
- 🎯 优化 wangeditor 富文本编辑器（增加双向绑定）
- 🎉 新增 工作流（暂不开源）
- 🎉 新增 基础版 ts（不带国际化），切换 `vue-next-admin-template` 分支

## 1.1.1

`2021.09.25`

- 🌟 更新 依赖更新最新版本（`"element-plus": "^1.1.0-beta.13"` 版本运行错误，`^1.1.0-beta.16`修复横向菜单卡死问题）
- 🐞 修复 Dialog 弹窗位置错误、Drawer 抽屉内边距、el-menu 菜单收起时背景色问题
- 🎯 优化 锁屏界面自动锁屏(s/秒)必须设置至少 1 秒
- 🎉 新增 分栏布局，鼠标移入当前项时，显示当前项菜单内容
- 🎉 新增 工作流（未完成）

## 1.1.0

`2021.09.10`

- 🌟 更新 依赖更新最新版本
- 🎯 优化 小屏模式下登录页二维码遮挡标题问题
- 🎉 新增 图片验证器
- 🎉 新增 动态复杂表单
- 🎉 新增 工作流（未完成）
- 🎉 新增 深色主题(伪深色，样式变动大，谨慎更新)

## 1.0.18

`2021.08.29`

- 🌟 更新 依赖更新最新版本
- 🎯 优化 权限组件去掉顶级 div（`/src/components/auth`）
- 🎉 新增 布局配置添加恢复默认按钮
- 🐞 修复 升级 <a href="https://element-plus.gitee.io/#/zh-CN/component/changelog" target="_blank">element plus 1.1.0-beta.7</a>后项目无法启动、el-menu 菜单
- 🐞 修复 表格固定列时的层级、设置了相对定位时，遮挡左侧导航菜单问题

## 1.0.17

`2021.08.22`

- 🌟 更新 依赖更新最新版本
- 🎯 优化 去除设置布局切换，重置主题样式（initSetLayoutChange），切换布局需手动设置样式，设置的样式自动同步各布局
- 🎯 优化 Dropdown 下拉菜单用户账号靠边时换行问题
- 🎯 优化 左侧导航菜单，共用菜单树，防止 `布局配置` 设置 `菜单 / 顶栏` 时，样式丢失等问题
- 🐞 修复 固定 header 后没有回到顶部的 bug，拉取项目后运行不起来的 bug。<a href="https://gitee.com/lyt-top/vue-next-admin/pulls/14" target="_blank">!14</a>，感谢<a href="https://gitee.com/wjs0509" target="_blank">@wjs0509</a>
- 🐞 修复 tagView 右键全屏后，浏览器窗口大小发生任何变化都会导致左边菜单显示出来，并且可点击打开对应页面。<a href="https://gitee.com/lyt-top/vue-next-admin/issues/I46E6T" target="_blank">I46E6T</a>
- 🐞 修复 默认设置 `菜单 / 顶栏` 样式不生效问题（/@/src/store/modules/themeConfig.ts）

## 1.0.16

`2021.08.14`

- 🌟 更新 依赖更新最新版本
- 🎯 优化 菜单高亮（详情且详情设置了 meta.isHide 时，顶级菜单高亮），感谢群友@YourObject
- 🎯 优化 详情路径写法：如父级（/pages/filtering），那么详情为（/pages/filtering/details?id=1）。这样写可实现（详情时，父级菜单高亮），否则写成（/pages/filteringDetails?id=1）顶级菜单将不会高亮。可参考：`页面/过滤筛选组件`，点击当前图片进行测试
- 🎯 优化 tagsView 右键菜单全屏时，打开的界面高度问题
- 🎯 优化 图表批量 resize 问题
- 🐞 修复 菜单收起时（设置全局主题：primary 且有二级菜单时），文字高亮颜色不对
- 🐞 修复 国际化 <a href="https://gitee.com/lyt-top/vue-next-admin/issues/I43NPE" target="_blank">#I43NPE</a>。可参考：`页面/过滤筛选组件`，点击顶部语言切换，进行底部分页国际化查看

## 1.0.15

`2021.08.06`

- 🌟 更新 依赖更新最新版本
- 🎯 优化 tagsView 右键菜单点击时的字段名（id 已修改成 contextMenuClickId）与路由中返回的 id 名冲突问题，感谢群友@伯牙已遇钟子期
- 🎉 新增 多个 form 表单验证界面演示

## 1.0.14

`2021.07.29`

- 🌟 更新 依赖更新最新版本（vue、vuex、vue-router）,出现问题，请手动降级。版本查看：<a href="https://www.npmjs.com/" target="_blank">vnpm</a>
- 🎯 优化 数据可视化图表演示加载卡顿问题、优化有图表的演示界面
- 🎯 优化 路由参数演示界面
- 🎯 优化 tagsView 操作演示界面，由于存在相同路由多标签，必须要传全部参数值（query 或者 params）
- 🎉 新增 开启 TagsView 共用，开启时：（多个路由菜单共用一个详情组件（参数为后点击的覆盖前面点击的），tagsView 中只会出现一个（不支持同时出现多个 tagsView 标签））。关闭时：（多个路由菜单共用一个详情组件，参数不同，会同时出现多个 tagsView 标签）
- 🐞 修复 tagsView 共用（单标签）时，右键菜单功能点击，参数不对的问题（第 2n+个参数未覆盖第一个参数值）
- 🐞 修复 多 tagsView 标签（参数不同）、单个 tagsView 标签公用（参数不同）所带来的刷新功能、横向自动滚动等问题
- 🐞 修复 处理全屏若干问题，<a href="https://gitee.com/lyt-top/vue-next-admin/pulls/12" target="_blank">pr!12</a>，感谢群友@另一个前端

## 1.0.13

`2021.07.25`

- 🌟 更新 依赖更新最新版本
- 🎉 新增 数据可视化演示界面（/visualizingDemo1、/visualizingDemo2）
- 🎉 新增 登录页扫码登录

## 1.0.12

`2021.07.16`

- 🌟 更新 依赖更新最新版本
- 🎉 新增 数据可视化演示空界面（待完善）
- 🎯 优化 tagsView 动态路由（xxx/:id/:name）时的右键菜单刷新、关闭其它时参数丢失问题（2021.07.15 优化）
- 🐞 修复 路由带参数时，复制路径到登录页，跳转后参数消失的问题
- 🐞 修复 设置多个外链，点击后，页面内容停留在上一个内容（内容未改变）、国际化处理、打开新窗口 sessionStorage 共享等

## 1.0.11

`2021.07.14`

- 🌟 更新 依赖更新最新版本
- 🎉 新增 路由参数、图片懒加载界面演示
- ⚠️ 警告 Form 表单 `binding value must be a string or number`，解决：加上 `label-position="top"` 不报警告（等待官方修复）
- 🎯 优化 锁屏界面动画效果、首页图表显示
- 🎯 优化 tagsView 右键菜单 `关闭` 功能逻辑
- 🐞 修复 开启 TagsView 拖拽报错及小于 `1000px` 时自动设置禁止拖拽（<a href="https://gitee.com/lyt-top/vue-next-admin/issues/I3ZRRI" target="_blank">#I3ZRRI</a>）
- 🐞 修复 `iframe 内嵌、外链` 高度问题，使用 computed 进行计算
- 🐞 修复 默认布局开启 `侧边栏 Logo` 与关闭 `菜单水平折叠`，切换到横向布局时，菜单看不见的问题
- 🐞 修复 切换不同布局时，再去开启 `经典布局分割菜单` 功能不生效问题
- 🐞 修复 浏览器窗口标题中/英文切换不实时生效的问题
- 🐞 修复 切换布局时，某些功能不可以使用。部分界面不需要取消事件监听(proxy.mittBus.off('xxx'))
- 🐞 修复 动态路由带参数，router-link 跳转问题（<a href="hhttps://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G" target="_blank">#I3YX6G</a>）
- 🐞 修复 横向菜单有二级菜单时，点击子级菜单不高亮问题
- 🐞 修复 功能 tagsView 操作演示不生效

## 1.0.10

`2021.07.07`

- 🌟 更新 依赖更新最新版本（字体图标无问题）
- 🎯 优化 内嵌 iframe、外链，解决 tagsView 刷新问题

## 1.0.9

`2021.07.02`

- 🌟 更新 依赖更新最新版本
- 🎯 优化 图标选择器设置宽度、v-model 等问题
- 🎯 优化 滚动通知栏在手机上的体验
- 🎯 优化 系统管理/新增菜单（编辑菜单），使用 `图标选择器` 进行模拟
- 🎯 优化 字体图标(自动载入) 逻辑
- 🐞 修复 screenfull 全屏时，按键盘 esc 键图标不改变问题，感谢群友@伯牙已遇钟子期

## 1.0.8

`2021.06.29`

- 🌟 更新 依赖更新最新版本
- 🎉 新增 表单中英文切换演示
- 🎯 优化 登录页查看密码 icon 图标
- 🎯 优化 图标选择器
- 🎯 优化 拖动指令
- 🐞 修复 form 表单在页面小于 576px 时的排版问题

## 1.0.7

`2021.06.24`

- 🌟 更新 依赖更新最新版本
- 🎉 新增 拖动指令及其演示界面
- 🎯 优化 锁屏界面，解锁提示
- 🎯 优化 登录页在手机上显示的效果

## 1.0.6

`2021.06.23`

- 🎯 优化 去掉内嵌 iframe 内边距（padding）
- 🎯 优化 城市多级联动组件
- 🎯 优化 Tree 树形控件改成表格组件
- 🐞 修复 Cascader 级联选择器高度问题

## 1.0.5

`2021.06.22`

- 🌟 更新 vite 降级为@vite2.3.7，降级方法 `cnpm install vite@2.3.7`，防止 element plus 字体图标消失
- 🐞 修复 开启后端控制路由（isRequestRoutes = true）时，内嵌 iframe、外链不可使用的问题

## 1.0.4

`2021.06.19`

- 🌟 更新 依赖更新最新版本（"vite": "^2.3.7"）热更新无问题
- 🎉 新增 深克隆工具，方便开发，感谢<a href="https://gitee.com/kangert" target="_blank">@kangert</a>(<a href="https://gitee.com/lyt-top/vue-next-admin/pulls/6" target="_blank">#6</a>)
- 🎯 优化 vuex 模块自动导入。感谢<a href="https://gitee.com/kangert" target="_blank">@kangert</a>(<a href="https://gitee.com/lyt-top/vue-next-admin/pulls/4" target="_blank">#4</a>)，感谢群友@web 小学生-第五君
- 🎯 优化 类型定义提高编码体验，修复不能将类型“string | undefined”分配给类型“string”的问题。感谢<a href="https://gitee.com/kangert" target="_blank">@kangert</a>(<a href="https://gitee.com/lyt-top/vue-next-admin/pulls/5" target="_blank">#5</a>)
- 🎯 优化 `layout` 文件夹移动到与 `views` 文件夹同级（改动较大，`/@/views/layout` 变成 `/@/layout`）
- 🎯 优化 页面有 `console.log` 时 `eslint` 不生效问题
- 🎯 优化 页面、ts 中 `any` 类型问题（改动较大）
- 🎯 优化 登录页在手机上显示的效果
- 🎯 优化 多行注释信息，鼠标放到方法名即可查看，更加直观的知道方法参数等。引入方法时需去掉以 `.ts` 结尾的后缀（改动较大）
- 🎯 优化 移除 `utils/storage.ts` 下的旧写法（改动较大）
- 🎯 优化 拆分 `router` 下内容，路由、前端、后端控制分开写，方便理解
- 🐞 修复 鼠标移入顶部用户信息栏 `开/关全屏` 文字反向问题
- 🐞 修复 热更新时，NextLoading（界面 loading） 不消失问题 `window.nextLoading === undefined`
- 🐞 修复 vuex 中不可以使用 `/@/api/xxx` 下的接口调用问题

## 1.0.3

`2021.06.02`

- ❄️ 删除 G6 思维导图界面
- 🌟 更新 手动更新 vue、vue-router、vuex 到最近最多人使用的版本，出现不可预测的问题请降低版本。版本查看：<a href="https://www.npmjs.com/package/vue" target="_blank">vue 版本查看</a>
- 🐞 修复 开启后端控制路由 `isRequestRoutes` 在非首页刷新页面后，回到首页的问题，感谢群友@伯牙已遇钟子期

## 1.0.2

`2021.06.01`

- 🌟 更新 依赖更新最新版本
- 🐞 修复 菜单搜索中文不可以搜索的问题，感谢群友@逍遥天意

## 1.0.1

`2021.05.31`

- 🎉 新增 更新日志文件 `CHANGELOG.md`，以后每次更新都会在这里显示对应内容
- 🌟 更新 依赖更新最新版本
- 🐞 修复 分栏、经典布局路由设置 `meta.isHide` 为 `true` 时报错问题，感谢群友@29、@芭芭拉
- 🐞 修复 经典布局点击 `tagsView` 左侧菜单数据不变问题
