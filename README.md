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
│   ├── app.vue
│   ├── assets/css
│   │   ├── main.css              # 全局样式唯一入口（按顺序 @import 其余层）
│   │   ├── theme.css             # 明暗主题 CSS 变量
│   │   ├── base.css              # 盒模型、页面与排版基础
│   │   ├── layout.css            # 全站外壳、主区域等布局骨架
│   │   └── layout/site-header.css
│   ├── components
│   │   ├── AppPageChrome.vue     # 顶栏阅读进度条、回到顶部等页面级装饰
│   │   ├── ArtDotsBackground.vue # Canvas 点阵背景（随主题色变化）
│   │   ├── BlogArchivePostCard.vue
│   │   ├── MediaAsset.vue
│   │   ├── PaginationNav.vue
│   │   ├── SiteFooter.vue
│   │   ├── SiteHeader.vue
│   │   └── SiteMain.vue
│   ├── composables
│   │   ├── useNavProgress.ts
│   │   ├── useSiteSeo.ts
│   │   └── useSiteTheme.ts
│   ├── constants
│   │   └── site.ts
│   ├── layouts
│   │   └── default.vue
│   ├── pages
│   │   ├── index.vue
│   │   ├── notes.vue
│   │   ├── editor.vue
│   │   ├── blog/**
│   │   └── gallery/**
│   └── plugins
│       └── page-chrome.client.ts
├── content                       # Markdown 源：首页说明、博客、照片墙
├── packages/remark-callout-local # 本地 remark 插件包
├── public                        # 构建时原样复制的静态资源与图标
├── server
│   ├── routes                    # RSS、Sitemap、Robots 等 Nitro 路由
│   └── tsconfig.json             # 服务端 TS 工程引用（继承 .nuxt）
├── utils
│   └── content.ts
├── nuxt.config.ts
├── content.config.ts
├── tsconfig.json                 # Nuxt 推荐的工程引用入口
└── package.json
```

## 主要文件说明

下列说明按目录归类，便于对照仓库根目录浏览。`content/` 下大量 `.md` 为文章与图库数据，此处不逐文件列举。

### 根目录

| 文件 | 作用 |
| --- | --- |
| `package.json` | 依赖声明与 `dev` / `build` / `generate` / `preview` 等脚本；`postinstall` 触发 `nuxt prepare`。 |
| `package-lock.json` / `pnpm-lock.yaml` | 依赖锁文件（按你实际使用的包管理器保留其一或二者）。 |
| `nuxt.config.ts` | Nuxt 主配置：模块、`css` 入口、全局 `head`、`runtimeConfig`、预渲染与 Markdown 处理链等。 |
| `content.config.ts` | `@nuxt/content` 集合与 Zod schema，定义 frontmatter 字段与内容来源。 |
| `tsconfig.json` | TypeScript 工程引用，指向 Nuxt 生成的 `tsconfig.app` / `server` / `shared` / `node`。 |
| `.gitignore` | Git 忽略规则（如 `node_modules`、`.nuxt`、`.output` 等）。 |

### `app/`

| 文件 | 作用 |
| --- | --- |
| `app.vue` | 应用根组件，挂载 `NuxtLayout` 与 `NuxtPage`，保持入口轻量。 |
| `assets/css/main.css` | 全局样式唯一入口，按「主题 → 基础 → 布局 → 页头」顺序 `@import` 各层。 |
| `assets/css/theme.css` | 深色/浅色主题的 CSS 自定义属性（背景、文字、品牌色等）。 |
| `assets/css/base.css` | 全局重置与基础排版（`box-sizing`、链接、代码块、可访问性等）。 |
| `assets/css/layout.css` | 站点外壳（`site-shell`）、主内容区与和背景层的叠放关系。 |
| `assets/css/layout/site-header.css` | 站点头部导航、移动端菜单等专用样式。 |
| `components/AppPageChrome.vue` | 客户端页面装饰：路由切换时的顶部进度条、滚动超过阈值后的「回到顶部」。 |
| `components/ArtDotsBackground.vue` | 全屏 Canvas 点阵动效背景，颜色从主题变量读取，可传 `density`。 |
| `components/BlogArchivePostCard.vue` | 博客归档列表中的单篇文章卡片（标题、日期、摘要与链接）。 |
| `components/MediaAsset.vue` | 图片展示：懒加载占位、灯箱预览等。 |
| `components/PaginationNav.vue` | 博客与图库共用的分页控件。 |
| `components/SiteHeader.vue` | 顶栏品牌、导航链接、主题切换等。 |
| `components/SiteFooter.vue` | 页脚链接与版权信息。 |
| `components/SiteMain.vue` | 主内容区域容器，与布局配合包裹页面主体。 |
| `composables/useNavProgress.ts` | 用 `useState` 保存导航进度条进度与显隐，供插件与 `AppPageChrome` 共用。 |
| `composables/useSiteSeo.ts` | 封装 `useSeoMeta` / `useHead` 等，统一标题、描述、OG 与 canonical。 |
| `composables/useSiteTheme.ts` | 明暗主题切换、`localStorage` 持久化与切换过渡类名。 |
| `constants/site.ts` | 站点名称、描述、导航项、页脚链接等集中配置。 |
| `layouts/default.vue` | 默认全站布局：背景、Header / Main / Footer、移动端抽屉等。 |
| `pages/index.vue` | 首页，通常渲染 `content/index.md`。 |
| `pages/notes.vue` | 笔记或归档类列表页。 |
| `pages/blog/index.vue` | 博客文章列表（可按分类等筛选）。 |
| `pages/blog/page/[page].vue` | 博客列表分页路由。 |
| `pages/blog/[...slug].vue` | 单篇博客详情，按 slug 匹配 `content/blog/**`。 |
| `pages/gallery/index.vue` | 照片墙条目列表。 |
| `pages/gallery/page/[page].vue` | 图库列表分页。 |
| `pages/gallery/category/[category].vue` | 按分类筛选的图库列表。 |
| `pages/gallery/[...slug].vue` | 单条图库内容详情。 |
| `plugins/page-chrome.client.ts` | 仅在客户端：监听 `page:start` / `page:finish` / `app:error`，驱动 `useNavProgress` 与顶栏进度条。 |

### `content/`

| 路径 | 作用 |
| --- | --- |
| `index.md` | 首页展示的说明性 Markdown。 |
| `blog/**` | 博客文章与分类目录；frontmatter 需符合 `content.config.ts` 中 schema。 |
| `gallery/**` | 图库条目 Markdown 与元数据（拍摄地、设备等字段视 schema 而定）。 |

### `server/`

| 文件 | 作用 |
| --- | --- |
| `routes/rss.xml.ts` | 聚合已发布内容，输出 RSS 2.0 XML（博客与图库等条目）。 |
| `routes/sitemap.xml.ts` | 生成站点地图 URL 列表，供搜索引擎抓取。 |
| `routes/robots.txt.ts` | 输出 `robots.txt`，可声明 sitemap 位置与爬虫规则。 |
| `tsconfig.json` | 服务端代码的 TS 配置，继承 `.nuxt/tsconfig.server.json`。 |

### `utils/`、`packages/`、`public/`

| 文件 / 目录 | 作用 |
| --- | --- |
| `utils/content.ts` | 内容查询辅助：分页、分类、`contentKind`、RSS/XML 转义等与页面和服务端路由共用。 |
| `packages/remark-callout-local/` | 本地 npm 包：`index.mjs` 将 `:::tip` 等 directive 转为带 class 的 HTML 结构；由 `nuxt.config` 引入 remark 链。 |
| `public/*` | 图标（`favicon.svg`、`apple-touch-icon.svg` 等）、默认 OG 图、图库用 SVG 等构建时静态文件。 |
| `public/site.webmanifest` | PWA 清单（名称、图标等），供浏览器「安装」或书签使用。 |

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
