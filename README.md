# Nuxt Bloc

`Nuxt Bloc` 是一个基于 `Nuxt 4`、`@nuxt/content` 和静态生成能力构建的内容站模板，当前包含博客、笔记归档、照片墙、Markdown 编辑器、RSS / Sitemap / Robots 生成等能力。

项目目标不是只做一个“能跑起来”的 Nuxt 示例，而是提供一个更接近真实内容站的基础骨架：

- 内容优先：博客与照片内容都来自 `content/`
- 结构清晰：页面、布局、组合式函数、服务端路由按 Nuxt 约定拆分
- 可静态部署：支持 `nuxt generate` 输出纯静态站点
- 可继续扩展：可以继续接入 CMS、更多内容模型或主题能力

## 技术栈

- `Nuxt 4`
- `Vue 3`
- `@nuxt/content`
- `@nuxtjs/mdc`
- `KaTeX`
- `remark` / `rehype` Markdown 扩展链

## 项目结构

```text
.
├── app
│   ├── app.vue                    # 应用入口，仅负责挂载布局与页面
│   ├── assets/css                 # 全局样式入口、主题变量、布局与组件样式
│   ├── components
│   │   ├── MediaAsset.vue         # 图片资源组件（骨架屏、灯箱预览）
│   │   ├── PaginationNav.vue      # 通用分页组件
│   │   ├── SiteFooter.vue         # 站点页脚
│   │   ├── SiteHeader.vue         # 站点头部与导航
│   │   └── SiteMain.vue           # 主内容容器
│   ├── composables
│   │   ├── useSiteSeo.ts          # SEO 元信息封装
│   │   └── useSiteTheme.ts        # 明暗主题与过渡动画
│   ├── constants
│   │   └── site.ts                # 站点名称、导航、页脚等全局配置
│   ├── layouts
│   │   └── default.vue            # 默认站点布局，负责整体骨架与移动端菜单
│   └── pages
│       ├── index.vue              # 首页
│       ├── notes.vue              # 笔记归档页
│       ├── editor.vue             # Markdown 编辑器
│       ├── blog/**                # 博客列表、分类、分页、详情
│       └── gallery/**             # 照片墙列表、分类、分页、详情
├── content                        # 博客、照片与首页说明内容
├── packages/remark-callout-local  # 本地自定义 remark 插件
├── public                         # 静态资源、图标、封面图、照片素材
├── server/routes                  # RSS、Sitemap、Robots 等服务端输出
├── utils/content.ts               # 内容查询辅助函数与分页工具
├── nuxt.config.ts                 # Nuxt 配置、模块、样式入口、预渲染策略
└── content.config.ts              # Nuxt Content 配置入口
```

## 当前项目大纲

### 1. 应用层

- `app/app.vue` 保持轻量，只负责 `NuxtLayout` 与 `NuxtPage`
- `app/layouts/default.vue` 统一承载全站 Header / Main / Footer
- 站点级配置集中在 `app/constants/site.ts`，避免散落在入口文件

### 2. 内容层

- `content/blog` 存放博客文章
- `content/gallery` 存放照片内容与元数据
- `content/index.md` 用作首页的项目说明内容
- 页面通过 `queryCollection('content')` 获取内容，并结合 `utils/content.ts` 中的分页、分类、封面辅助函数进行渲染

### 3. 展示层

- `MediaAsset.vue` 负责图片懒加载态、预览弹层与展示一致性
- `PaginationNav.vue` 统一博客和照片墙分页交互
- `assets/css/main.css` 作为唯一全局样式入口，按主题、基础、布局、组件、内容顺序聚合

### 4. 站点能力

- `useSiteSeo.ts` 统一生成页面 SEO、Open Graph 与 canonical
- `useSiteTheme.ts` 管理明暗模式和视图切换动画
- `server/routes` 生成 `rss.xml`、`sitemap.xml` 和 `robots.txt`
- `nuxt.config.ts` 中配置静态预渲染、Markdown 扩展链和全局 head 信息

## 开发约定

- 页面级公共骨架放在 `layouts/`，不要继续堆回 `app.vue`
- 站点常量、导航配置、全局文案优先放到 `app/constants/`
- 组合式逻辑优先放到 `app/composables/`
- 内容数据优先来源于 `content/`，页面只负责查询与展示
- 全局样式统一从 `app/assets/css/main.css` 进入，避免页面直接引入零散样式

## 开发命令

```bash
npm install
npm run dev
npm run build
npm run generate
npm run preview
```

## 后续可继续扩展的方向

- 增加内容 schema 校验与字段约束
- 为页面组件继续拆分更细的内容卡片组件
- 为博客与照片内容增加标签页、搜索、订阅入口等能力
