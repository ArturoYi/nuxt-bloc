# Nuxt 4 静态博客开发计划（Markdown 扩展 + 编辑器实现）

> 本文档面向 **Nuxt 4 + @nuxt/content v3** 生态；具体 API 名称以实现时安装的 `@nuxt/content` 版本官方文档为准，下文已标注需在接入时核对之处。

---

## 一、项目核心目标

1. **纯静态托管**：使用 `nuxt generate`（等价于带完整预渲染流程的构建）产出可在任意静态服务器/CDN 上托管的文件；线上 **无 Node 运行时**，SEO 友好。
2. **Markdown 扩展**：基于 **@nuxt/content** 与 **remark/rehype** 管线扩展语法，与 Content 模块渲染链路一致。
3. **自建 Markdown 编辑器**：预览区与正式文章 **共用同一套解析与渲染配置**，最大限度避免「编辑器一套、线上一套」。
4. **无后端、无数据库**：文章与资源以仓库内文件为主（`content/**/*.md`、`public/` 等），部署流程简单。

---

## 二、核心技术选型（固定不替换）

| 功能模块 | 推荐工具/库 | 说明 |
| --- | --- | --- |
| 内容模块 | @nuxt/content | 读取 `content/`、查询、与页面集成；路由需与 `pages/` 显式配合（Content 不替代文件路由）。 |
| Markdown 管线 | remark / rehype | Content 模块内置 unified 管线；扩展语法 **优先用 remark 插件**，HTML 后处理 **用 rehype**。 |
| 编辑器预览 | Content 同源渲染 | 预览必须复用与 `nuxt.config` 中 `content.markdown` **相同的插件列表**（见第五节）。 |
| 代码高亮 | Shiki（Content 集成） | 主题与语言列表在 `content.highlight` 配置。 |
| 样式/UI | Tailwind CSS v4 | 与 Nuxt 4 集成方式以官方文档为准。 |
| 静态部署 | `nuxt generate` + Nitro 预渲染 | 部署 **`输出目录下的 public` 子目录**（见第三节）；非「把整个 `.output` 随意上传」就算完成。 |

---

## 三、项目基础配置（纯静态输出 + SEO）

### 3.1 与 Nuxt 2 / 误解配置的区别（必读）

| 误解 | 正确做法 |
| --- | --- |
| 在 `defineNuxtConfig` 根级写 `static: true`（Nuxt 2 思维） | **Nuxt 3/4 根配置无此项**。静态站依赖 **`nuxt generate`**（或 `nuxt build --prerender`）+ **`nitro.prerender`** / **`routeRules`** 等控制预渲染范围。 |
| 认为只要 `nuxt build` 就等于「纯静态站包」 | **`nuxt build`** 主要生成 **Nitro 生产构建**（默认输出在 `.output/`，用于 SSR/Serverless）。**纯静态托管**应使用 **`nuxt generate`**，并部署预渲染后的静态资源目录。 |
| 动态路由只靠爬虫一定能爬到全部文章 | 文件路由下的 **`[slug].vue`** 等若未从首页通过 `<a href>` 链到，**可能不被爬取**。必须在 **`nitro.prerender.routes`**、**`hooks['prerender:routes']`** 或构建脚本中 **枚举文章路径**（例如根据 `queryContent` 结果生成）。 |

### 3.2 `nuxt generate` 与 `nuxt build`（命令级）

| 命令 | 典型用途 | 产物说明 |
| --- | --- | --- |
| **`nuxt generate`** | 静态站点：构建并 **预渲染** 可发现的路由，生成可直接托管的 HTML/资源 | 官方说明中会部署 **`.output/public`**（见下节「产物目录」）。 |
| **`nuxt build`** | SSR / Edge / Serverless 等 **需要 Nitro 服务端** 的部署 | 使用 **`.output/`** 整体（含 server 等），不是「只拷 HTML 到静态主机」这一种形态。 |

关系：**`generate` 会触发带预渲染的构建流程**；静态博客日常发布以 **`generate`** 为准。

### 3.3 构建产物：`dist`、`.output` 与可部署的 `public`

- **默认**：Nitro 构建输出在 **`.output/`**（应加入 `.gitignore`）。静态托管时，官方文档通常指向部署 **`.output/public`**。
- **自定义 `nitro.output.dir`**（例如设为 `dist`）：改变的是 **Nitro 输出根目录**，静态文件一般在 **`该目录下的 `public` 子目录**（例如 `dist/public`），**请以本地执行一次 `nuxt generate` 后的实际结构为准**，并在 CI/托管面板中把 **托管根目录** 指到该 `public`。
- **`_payload.json` 等**：预渲染页面可能带 payload 文件，属 Nuxt 客户端水合/导航优化机制，**一并部署**，勿手工删掉除非你知道影响。

### 3.4 `nuxt.config.ts` 示例（修正后的方向）

下列配置体现 **删除无效 `static: true`**、**静态预设 / 预渲染**、**可选自定义输出根**。插件名与 `content` 字段以当前版本文档为准。

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // 预渲染阶段需要完整渲染页面；默认 ssr: true 有利于生成完整 HTML（SEO）
  ssr: true,

  router: {
    options: {
      strict: true,
    },
  },

  modules: ['@nuxt/content'],

  nitro: {
    // 静态托管常用 preset；与 generate 配合
    preset: 'static',
    // 可选：自定义 Nitro 输出根（静态文件多在 根目录/public）
    // output: { dir: 'dist' },
    prerender: {
      crawlLinks: true,
      // 爬虫无法发现的路由在此显式列出；动态文章列表建议用 hooks 批量注入（见 3.5）
      routes: ['/'],
      // ignore: ['/draft-preview'],
    },
  },

  app: {
    head: {
      title: '我的 Nuxt 4 静态博客',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: '基于 Nuxt 4 的纯静态博客，支持 Markdown 自定义语法',
        },
      ],
    },
  },

  content: {
    markdown: {
      // remark 插件顺序会影响解析结果；directive 相关须在自定义语法插件之前（见第四节）
      remarkPlugins: {
        'remark-directive': {},
        'remark-gfm': {},
        'remark-math': {},
        './plugins/remark-callout.ts': {},
      },
      rehypePlugins: [
        'rehype-slug',
        'rehype-autolink-headings',
        'rehype-external-links',
        'rehype-katex',
      ],
    },
    highlight: {
      theme: 'github-dark',
      langs: ['js', 'ts', 'vue', 'markdown', 'bash'],
    },
  },
})
```

### 3.5 预渲染：必须覆盖全部文章路由（关键）

实现方式任选其一或组合：

- 在 **`nitro.prerender.routes`** 中列出固定路径；
- 使用 **`hooks['prerender:routes']`**（或 Nitro 文档中的等价钩子）在构建时 **`queryContent` 遍历所有文章**，把 **`/blog/xxx`** 等路径 **`add` 进预渲染列表**；
- 对部分内容使用 **`routeRules`**（如 `'/blog/**': { prerender: true }`）辅助声明（仍建议配合显式路由列表以免漏网）。

**原则**：凡 **`pages` 动态段能匹配**、但 **站内没有 `<a>` 链过去** 的 URL，都应在构建期 **显式注册**。

### 3.6 依赖安装（示例）

```bash
npm install @nuxt/content

# Markdown 扩展常用
npm install remark-gfm remark-math remark-directive rehype-katex rehype-slug rehype-autolink-headings rehype-external-links unist-util-visit
```

### 3.7 构建命令

```bash
npm run generate
# 或
npx nuxt generate
```

本地预览静态包（默认路径示例）：

```bash
npx serve .output/public
# 若自定义 nitro.output.dir，则为：<输出根>/public
```

---

## 四、Markdown 语法扩展

### 4.1 方式一：现成 remark/rehype 插件

安装后在 `content.markdown.remarkPlugins` / `rehypePlugins` 中注册（名称与顺序以各插件文档为准）：

- **remark-gfm**：表格、删除线、脚注、任务列表等；
- **remark-directive**：解析 `:::name` 指令语法树节点（常与自定义插件配合）；
- **remark-mermaid**、**remark-callouts**（GitHub Alert 风格）等：按需选用，注意 **与 GFM、directive 的顺序及兼容性**。

### 4.2 方式二：自定义语法（以 `:::tip` 容器为例）

**要点**：仅编写 `visit(tree, 'containerDirective', …)` **不够**——必须先由 **`remark-directive`**（或等价解析器）把 `:::tip … :::` 解析为 **directive 节点**，自定义插件再改写 `data.hName` / `hProperties` 等。

**推荐管线顺序**：`remark-directive` →（可选 `remark-gfm`）→ `remark-math` → **`remark-callout.ts`**（转换 directive）。

示例插件骨架（类型与字段以实现时 mdast 版本为准）：

```typescript
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

const remarkCallout: Plugin = () => {
  return (tree) => {
    visit(tree, 'containerDirective', (node: any) => {
      const type = node.name || 'note'
      node.data = node.data || {}
      node.data.hName = 'div'
      node.data.hProperties = {
        class: `callout ${type}`,
      }
    })
  }
}

export default remarkCallout
```

全局样式示例（`assets/css/main.css` 等）：

```css
.callout {
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  line-height: 1.6;
}
.callout.tip {
  background: #e8f5e9;
  border-left: 4px solid #4caf50;
}
.callout.info {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
}
.callout.warning {
  background: #fff8e1;
  border-left: 4px solid #ffc107;
}
.callout.danger {
  background: #ffebee;
  border-left: 4px solid #f44336;
}
```

测试 Markdown：

```markdown
:::tip 提示
自定义提示框。
:::

:::warning 警告
警告内容。
:::
```

---

## 五、Markdown 编辑器（预览与线上一致）

### 5.1 原则

1. **`nuxt.config` 里 `content.markdown` 为单一真相来源**：编辑器预览 **不得** 另起炉灶使用 markdown-it 等并行管线。
2. **组件/API 名称随 @nuxt/content 版本变化**：接入时请在官方文档中搜索 **「Markdown 渲染」「parseMarkdown」「ContentRenderer」** 等关键词，确认：
   - 原始字符串是先 **解析为文档对象** 再交给 `<ContentRenderer>`，还是存在 **`MarkdownRenderer` / `ContentRendererMarkdown`** 等封装；
   - **服务端-only** 的解析函数不可直接在客户端滥用（若需客户端预览，按文档使用允许的 API 或仅在构建/SSR 侧解析）。
3. **性能**：长文实时预览可做 **debounce**，避免每次按键全量重解析阻塞 UI。

### 5.2 示例页面结构（实现时需替换为当前文档推荐 API）

下列代码仅表达 **布局与数据流**，占位注释处请按你所装 `@nuxt/content` 版本补全：

```vue
<template>
  <div class="max-w-6xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Markdown 编辑器</h1>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="border rounded-lg h-[80vh] overflow-hidden flex flex-col">
        <div class="bg-gray-100 px-3 py-2 text-sm">编辑区</div>
        <textarea
          v-model="md"
          class="flex-1 p-4 outline-none text-base leading-relaxed font-mono text-sm"
          placeholder="输入 Markdown..."
        />
      </div>
      <div class="border rounded-lg h-[80vh] overflow-hidden flex flex-col">
        <div class="bg-gray-100 px-3 py-2 text-sm">预览区（应与文章页同源配置）</div>
        <div class="flex-1 p-4 overflow-auto prose max-w-none">
          <!-- TODO: 按 @nuxt/content 文档使用 ContentRenderer 或等价组件 -->
          <!-- 示例：<ContentRenderer :value="parsedDocument" /> -->
        </div>
      </div>
    </div>
    <button
      type="button"
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      @click="exportMd"
    >
      导出 .md
    </button>
  </div>
</template>

<script setup lang="ts">
const md = ref(`:::tip 提示\n同源渲染配置\n:::\n`)

// TODO: 将 md 解析为 ContentRenderer 所需结构（查阅官方文档）

function exportMd() {
  const blob = new Blob([md.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.download = `post-${Date.now()}.md`
  a.href = url
  a.click()
  URL.revokeObjectURL(url)
}
</script>
```

### 5.3 编辑器能力小结

| 能力 | 说明 |
| --- | --- |
| 预览一致性 | 与正式文章共用 remark/rehype 与 Content 配置；新增插件只需改一处。 |
| 离线/无后端 | 导出 `.md` 后放入 `content/` 即可纳入站点；可选本地缓存（localStorage）草稿（注意隐私与配额）。 |
| 可扩展 | 标签页、目录、搜索页、评论（如 Giscus）可在不动 Markdown 核心的前提下叠加。 |

---

## 六、项目目录结构（目标形态）

```text
your-blog/
├── assets/css/main.css
├── components/
├── content/
│   └── blog/
│       ├── hello.md
│       └── tech/nuxt.md
├── plugins/
│   └── remark-callout.ts
├── pages/
│   ├── blog/
│   │   ├── [...slug].vue   # 或 [slug].vue，需与预渲染路由一致
│   │   └── index.vue
│   └── editor.vue
├── public/
├── nuxt.config.ts
└── package.json
```

说明：**Content 模块不会自动为你的 `.md` 创建 URL**；需在 `pages/` 中定义与 `queryContent` 匹配的路由，并在预渲染中注册对应路径。

---

## 七、文件路由与可选「照片墙」

### 7.1 上手与定制

- **规则**：`pages/` 目录即文件路由；动态段 `[slug].vue`、捕获 `[...slug].vue`、索引 `index.vue` 等与 Vue Router 一致。
- **定制**：`middleware/`、`definePageMeta`、`routeRules`（缓存、重定向、是否预渲染等）、`navigateTo` 等组合使用即可。

### 7.2 照片墙（无后端、与静态目标一致）

任选一种或混合：

1. **`public/gallery/`** 固定目录 + **构建期或手写的 manifest（JSON）** 列出图片元数据，页面用 CSS Grid / Masonry 布局；
2. **`import.meta.glob`** 引入 `assets` 下图片（数量很大的注意打包体积与按需）；
3. **`content/gallery/*.md`** 每图一篇 frontmatter（标题、拍摄日期、原图路径），列表页 `queryContent`，与博客体系一致。

---

## 八、关键注意事项（修订版）

1. **不要用 markdown-it 替代 Content 的主 Markdown 管线**，以免 AST、安全策略与 SEO 与官方链路不一致。
2. **静态站发布路径**：部署 **`generate` 产物的 `public` 目录**（默认在 `.output/public` 或自定义输出根之下），不是含糊的「整个 dist 根目录」。
3. **`ssr: false` 与纯静态**：若改为 SPA 为主，预渲染与 SEO 行为会变化；博客场景建议保持 **`ssr: true` + `generate`**，除非你清楚自己在做什么。
4. **remark 插件顺序**：directive、GFM、数学、自定义——顺序错误会导致节点类型不匹配或解析失败。
5. **数学公式**：`remark-math` + `rehype-katex` 需在构建环境可运行；避免在 rehype 阶段引入 **仅浏览器存在** 的全局对象。
6. **维护清单**：升级 `nuxt`、`@nuxt/content`、remark 插件大版本时，重跑 **`generate`** 与编辑器预览对比页。

---

## 九、总结

| 亮点 | 说明 |
| --- | --- |
| 静态托管友好 | `nuxt generate` + 正确部署 `public` + 预渲染路由齐全。 |
| Markdown 可扩展 | unified 生态 + Content 配置单一来源。 |
| 编辑器可维护 | 预览与线上同源配置；版本升级时按官方迁移指南核对渲染 API。 |
| 可演进 | 标签/分类/搜索/RSS/评论/照片墙等均可在当前架构上增量添加。 |

---

> 修订说明：已对齐 Nuxt 3/4 中 **无根级 `static: true`**、**generate 与 build 分工**、**`.output/public` 部署习惯**、**预渲染必须覆盖动态文章路由**、**directive 类语法需 `remark-directive` 等前置插件**，并弱化「100% 一致」的绝对表述，改为 **同源配置 + 版本核对** 的可执行原则。
