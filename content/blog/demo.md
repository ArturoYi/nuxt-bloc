---
title: Markdown 全部语法汇总（Nuxt Content 完整版）
description: 严格按 Nuxt Content 渲染规范整理的 Markdown 语法大全，每种语法均附原生写法与实时渲染效果，可直接作为博客教程发布。
date: 2026-05-17
category: 教程
series: Markdown 入门
stage: 完整版
tags:
  - markdown
  - nuxt-content
  - 教程
published: true
---

# Markdown 全部语法汇总

> 本文档严格遵循 **Nuxt Content** 渲染链编写。每个语法条目均包含 **「原生写法」** 与 **「渲染效果」** 两部分，复制写法即可在本项目中直接生效。

---

## 目录

1. [Frontmatter 配置](#1-frontmatter-配置)
2. [标题 H1～H6](#2-标题-h1h6)
3. [文字样式](#3-文字样式)
4. [列表](#4-列表)
5. [引用](#5-引用)
6. [水平分割线](#6-水平分割线)
7. [代码](#7-代码)
8. [代码高亮进阶](#8-代码高亮进阶)
9. [链接](#9-链接)
10. [图片](#10-图片)
11. [表格](#11-表格)
12. [任务列表](#12-任务列表)
13. [脚注](#13-脚注)
14. [锚点跳转](#14-锚点跳转)
15. [Emoji 表情](#15-emoji-表情)
16. [隐藏注释](#16-隐藏注释)

---

## 1. Frontmatter 配置

Frontmatter 写在 `.md` 文件**最顶部**，用 `---` 包裹 YAML，供 Nuxt Content 读取元数据，**不会渲染到正文**。

**原生写法**

```yaml
---
title: 文章标题
description: 文章摘要，用于 SEO
date: 2026-05-17
category: 教程
tags:
  - markdown
  - nuxt-content
published: true
---
```

**渲染效果**

- 页面标题、描述、分类、标签由站点框架读取
- 正文中不可见；可在浏览器标签页与文章列表中看到 `title` 等字段效果

---

## 2. 标题 H1～H6

使用 `#` 数量表示 1～6 级标题；标题前后建议留空行。

**原生写法**

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

**渲染效果**

## 二级标题（示例）

### 三级标题（示例）

#### 四级标题（示例）

##### 五级标题（示例）

###### 六级标题（示例）

> 本项目中 H2～H4 会自动生成锚点 ID（`rehype-slug`），可配合目录与页内跳转使用。

---

## 3. 文字样式

### 3.1 加粗

**原生写法**

```markdown
**这是加粗文字**
__这也是加粗文字__
```

**渲染效果**

**这是加粗文字**

__这也是加粗文字__

---

### 3.2 斜体

**原生写法**

```markdown
*这是斜体文字*
_这也是斜体文字_
```

**渲染效果**

*这是斜体文字*

_这也是斜体文字_

---

### 3.3 删除线

**原生写法**

```markdown
~~这是删除线文字~~
```

**渲染效果**

~~这是删除线文字~~

---

### 3.4 行内高亮

> 需启用 `remark-flexible-markers`（本项目已启用）。

**原生写法**

```markdown
==这是行内高亮文字==
```

**渲染效果**

==这是行内高亮文字==

---

### 3.5 下标

> Markdown 允许内嵌 HTML。GitHub 亦支持 `H~2~O` 写法；在 Nuxt Content 中推荐使用 `<sub>`，保证稳定渲染。

**原生写法**

```markdown
水的化学式 H<sub>2</sub>O
```

**渲染效果**

水的化学式 H<sub>2</sub>O

---

### 3.6 上标

**原生写法**

```markdown
质能方程 E = mc<sup>2</sup>，序数 19<sup>th</sup>
```

**渲染效果**

质能方程 E = mc<sup>2</sup>，序数 19<sup>th</sup>

---

### 3.7 组合样式

**原生写法**

```markdown
**加粗** 与 *斜体* 和 ~~删除~~ 以及 `代码` 和 ==高亮== 可混用。
```

**渲染效果**

**加粗** 与 *斜体* 和 ~~删除~~ 以及 `代码` 和 ==高亮== 可混用。

---

## 4. 列表

### 4.1 无序列表

**原生写法**

```markdown
- 苹果
- 香蕉
- 橙子
```

**渲染效果**

- 苹果
- 香蕉
- 橙子

---

### 4.2 有序列表

**原生写法**

```markdown
1. 第一步：安装依赖
2. 第二步：启动开发服务器
3. 第三步：预览页面
```

**渲染效果**

1. 第一步：安装依赖
2. 第二步：启动开发服务器
3. 第三步：预览页面

---

### 4.3 多级嵌套列表

**原生写法**

```markdown
- 前端
  - Vue
  - Nuxt
- 后端
  1. Node.js
  2. Nitro
- 部署
  - 静态生成
    - `nuxt generate`
```

**渲染效果**

- 前端
  - Vue
  - Nuxt
- 后端
  1. Node.js
  2. Nitro
- 部署
  - 静态生成
    - `nuxt generate`

---

## 5. 引用

### 5.1 块状引用

**原生写法**

```markdown
> 这是一段块状引用，适合摘录、提示或名言。
> 引用内可使用 **加粗**、`行内代码` 等样式。
```

**渲染效果**

> 这是一段块状引用，适合摘录、提示或名言。
> 引用内可使用 **加粗**、`行内代码` 等样式。

---

### 5.2 多层嵌套引用

**原生写法**

```markdown
> 第一层引用内容。
>
> > 第二层嵌套引用内容。
>
> > > 第三层嵌套引用内容。
```

**渲染效果**

> 第一层引用内容。
>
> > 第二层嵌套引用内容。
>
> > > 第三层嵌套引用内容。

---

## 6. 水平分割线

以下三种写法等价，渲染结果均为 `<hr>`。

**原生写法**

```markdown
---

***

___
```

**渲染效果**

---

（上方为 `---` 渲染的分割线）

***

（上方为 `***` 渲染的分割线）

___

（上方为 `___` 渲染的分割线）

---

## 7. 代码

### 7.1 行内代码

**原生写法**

```markdown
使用 `npm run dev` 启动项目，变量名如 `count`。
```

**渲染效果**

使用 `npm run dev` 启动项目，变量名如 `count`。

---

### 7.2 普通代码块

**原生写法**

````
```
无语言标识的纯文本代码块
第二行内容
```
````

**渲染效果**

```
无语言标识的纯文本代码块
第二行内容
```

---

### 7.3 指定编程语言代码块

**原生写法**

````markdown
```javascript
const greeting = 'Hello, Markdown!'
console.log(greeting)
```

```typescript
const count: number = 42
```

```bash
npm install
npm run dev
```

```vue
<script setup lang="ts">
const title = ref('Nuxt Blog')
</script>
```
````

**渲染效果**

```javascript
const greeting = 'Hello, Markdown!'
console.log(greeting)
```

```typescript
const count: number = 42
```

```bash
npm install
npm run dev
```

```vue
<script setup lang="ts">
const title = ref('Nuxt Blog')
</script>
```

---

## 8. 代码高亮进阶

> 以下语法由本项目 Shiki Transformers 支持。

### 8.1 代码块行号

**原生写法**

````markdown
```js:line-numbers
console.log('第一行')
console.log('第二行')
console.log('第三行')
```
````

**渲染效果**

```js:line-numbers
console.log('第一行')
console.log('第二行')
console.log('第三行')
```

---

### 8.2 行号高亮 `{}` 语法

**原生写法**

````markdown
```js{2,4,6-8}
export default {
  data() {
    return {
      msg: '第 2 行高亮',
      plain: '普通行',
      block: '第 4 行高亮',
      more: '第 6-8 行高亮',
      end: '第 6-8 行高亮',
      tail: '第 6-8 行高亮',
    }
  },
}
```
````

**渲染效果**

```js{2,4,6-8}
export default {
  data() {
    return {
      msg: '第 2 行高亮',
      plain: '普通行',
      block: '第 4 行高亮',
      more: '第 6-8 行高亮',
      end: '第 6-8 行高亮',
      tail: '第 6-8 行高亮',
    }
  },
}
```

---

### 8.3 代码注释标记高亮（error / warning）

**原生写法**

````markdown
```js
export default {
  data() {
    return {
      err: 'Error', // [!code error]
      warn: 'Warning', // [!code warning]
    }
  },
}
```
````

**渲染效果**

```js
export default {
  data() {
    return {
      err: 'Error', // [!code error]
      warn: 'Warning', // [!code warning]
    }
  },
}
```

---

### 8.4 新增 / 删除标记（Diff）

**原生写法**

````markdown
```js
export default {
  data() {
    return {
      old: 'Removed line', // [!code --]
      neu: 'Added line', // [!code ++]
    }
  },
}
```
````

**渲染效果**

```js
export default {
  data() {
    return {
      old: 'Removed line', // [!code --]
      neu: 'Added line', // [!code ++]
    }
  },
}
```

---

### 8.5 代码聚焦（focus）

**原生写法**

````markdown
```js
export default {
  data() {
    return {
      focus: '这一行聚焦', // [!code focus]
      dim1: '变暗',
      dim2: '变暗',
    }
  },
}
```

```js
export default {
  data() {
    return {
      a: '普通',
      b: '聚焦起点', // [!code focus:3]
      c: '连续 3 行聚焦',
      d: '连续 3 行聚焦',
    }
  },
}
```
````

**渲染效果**

```js
export default {
  data() {
    return {
      focus: '这一行聚焦', // [!code focus]
      dim1: '变暗',
      dim2: '变暗',
    }
  },
}
```

```js
export default {
  data() {
    return {
      a: '普通',
      b: '聚焦起点', // [!code focus:3]
      c: '连续 3 行聚焦',
      d: '连续 3 行聚焦',
    }
  },
}
```

---

### 8.6 带文件名的代码块

**原生写法**

````markdown
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/content'],
})
```
````

**渲染效果**

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/content'],
})
```

---

## 9. 链接

### 9.1 普通链接

**原生写法**

```markdown
[Nuxt 官网](https://nuxt.com)
```

**渲染效果**

[Nuxt 官网](https://nuxt.com)

---

### 9.2 悬浮提示链接

**原生写法**

```markdown
[悬停查看提示](https://vuejs.org "Vue.js 官方文档")
```

**渲染效果**

[悬停查看提示](https://vuejs.org "Vue.js 官方文档")

---

### 9.3 站内跳转链接

**原生写法**

```markdown
[返回首页](/)
[博客列表](/blog)
[本篇锚点：脚注章节](#13-脚注)
```

**渲染效果**

[返回首页](/)

[博客列表](/blog)

[本篇锚点：脚注章节](#13-脚注)

---

### 9.4 裸链接（自动链接）

**原生写法**

```markdown
<https://nuxt.com>
```

**渲染效果**

<https://nuxt.com>

---

### 9.5 引用式链接

**原生写法**

```markdown
查阅 [Nuxt 文档][nuxt] 了解更多。

[nuxt]: https://nuxt.com
```

**渲染效果**

查阅 [Nuxt 文档][nuxt] 了解更多。

[nuxt]: https://nuxt.com

---

## 10. 图片

### 10.1 本地图片

> 图片放在 `public/` 目录，以 `/` 开头引用。

**原生写法**

```markdown
![本地站点默认 OG 图](/og-default.svg)
```

**渲染效果**

![本地站点默认 OG 图](/og-default.svg)

---

### 10.2 网络图片

**原生写法**

```markdown
![网络示例图](https://picsum.photos/640/240)
```

**渲染效果**

![网络示例图](https://picsum.photos/640/240)

---

### 10.3 带标题的图片

**原生写法**

```markdown
![带标题的图片](https://picsum.photos/640/200 "鼠标悬停显示此标题")
```

**渲染效果**

![带标题的图片](https://picsum.photos/640/200 "鼠标悬停显示此标题")

---

### 10.4 图片嵌套超链接

**原生写法**

```markdown
[![点击图片跳转 Nuxt](https://picsum.photos/200/80)](https://nuxt.com)
```

**渲染效果**

[![点击图片跳转 Nuxt](https://picsum.photos/200/80)](https://nuxt.com)

---

### 10.5 引用式图片

**原生写法**

```markdown
![引用式风景图][pic-ref]

[pic-ref]: https://picsum.photos/600/180
```

**渲染效果**

![引用式风景图][pic-ref]

[pic-ref]: https://picsum.photos/600/180

---

## 11. 表格

### 11.1 基础表格

**原生写法**

```markdown
| 名称   | 类型    | 说明         |
| ------ | ------- | ------------ |
| title  | string  | 文章标题     |
| date   | string  | 发布日期     |
| published | boolean | 是否发布  |
```

**渲染效果**

| 名称   | 类型    | 说明         |
| ------ | ------- | ------------ |
| title  | string  | 文章标题     |
| date   | string  | 发布日期     |
| published | boolean | 是否发布  |

---

### 11.2 表格左右 / 居中对齐

**原生写法**

```markdown
| 左对齐 | 居中对齐 | 右对齐 |
| :----- | :------: | -----: |
| A      |    B     |     100 |
| 长文本 |   居中   |   3.14 |
```

**渲染效果**

| 左对齐 | 居中对齐 | 右对齐 |
| :----- | :------: | -----: |
| A      |    B     |     100 |
| 长文本 |   居中   |   3.14 |

> 分隔行中冒号位置：`:---` 左对齐、`:---:` 居中、`---:` 右对齐。

---

## 12. 任务列表

**原生写法**

```markdown
- [x] 已完成：编写 Markdown 教程
- [x] 已完成：配置 Nuxt Content
- [ ] 待办：发布到生产环境
- [ ] 待办：配置自定义域名
```

**渲染效果**

- [x] 已完成：编写 Markdown 教程
- [x] 已完成：配置 Nuxt Content
- [ ] 待办：发布到生产环境
- [ ] 待办：配置自定义域名

---

## 13. 脚注

**原生写法**

```markdown
Vue 3 基于 Composition API 构建[^vue]，Nuxt 在其上提供全栈能力[^nuxt]。

[^vue]: Vue 3 官方文档：https://vuejs.org
[^nuxt]: Nuxt 官方文档：https://nuxt.com
```

**渲染效果**

Vue 3 基于 Composition API 构建[^vue]，Nuxt 在其上提供全栈能力[^nuxt]。

[^vue]: Vue 3 官方文档：https://vuejs.org
[^nuxt]: Nuxt 官方文档：https://nuxt.com

---

## 14. 锚点跳转

标题会自动生成 `id`，可用链接跳转到任意章节。

**原生写法**

```markdown
[跳转到「代码高亮进阶」](#8-代码高亮进阶)
[跳转到「任务列表」](#12-任务列表)
[跳转到文首目录](#目录)
```

**渲染效果**

- [跳转到「代码高亮进阶」](#8-代码高亮进阶)
- [跳转到「任务列表」](#12-任务列表)
- [跳转到文首目录](#目录)

---

## 15. Emoji 表情

### 15.1 短代码写法

**原生写法**

```markdown
:smile: :rocket: :tada: :heart:
```

**渲染效果**

:smile: :rocket: :tada: :heart:

---

### 15.2 Unicode 直接输入

**原生写法**

```markdown
😀 🚀 🎉 ❤️ 👍
```

**渲染效果**

😀 🚀 🎉 ❤️ 👍

---

## 16. 隐藏注释

注释内容**不会**出现在页面 HTML 中，适合写审稿备注或 TODO。

**原生写法**

```markdown
<!-- 读者看不到这段注释 -->

段落正文正常显示。
```

**渲染效果**

段落正文正常显示。（上方 `<!-- ... -->` 注释不可见）

---

## 附录 A：自定义容器（进阶）

> 本项目已启用 `remark-container-compat`，支持 `:::` 容器语法。

**原生写法**

```markdown
::: tip
这是一条 Tip 提示。
:::

::: warning
这是一条 Warning 警告。
:::

::: details 点击展开
隐藏的正文内容。
:::
```

**渲染效果**

::: tip
这是一条 Tip 提示。
:::

::: warning
这是一条 Warning 警告。
:::

::: details 点击展开
隐藏的正文内容。
:::

---

## 附录 B：GitHub Alert 引用（进阶）

**原生写法**

```markdown
> [!NOTE]
> 重要说明信息。

> [!TIP]
> 实用技巧建议。
```

**渲染效果**

> [!NOTE]
> 重要说明信息。

> [!TIP]
> 实用技巧建议。

---

## 附录 C：代码组（进阶）

**原生写法**

````markdown
::: code-group

```js [app.js]
export default { name: 'demo' }
```

```ts [app.ts]
export default { name: 'demo' as const }
```

:::
````

**渲染效果**

::: code-group

```js [app.js]
export default { name: 'demo' }
```

```ts [app.ts]
export default { name: 'demo' as const }
```

:::

---

## 附录 D：平台差异速查

| 语法 | 本项目 | GitHub 网页预览 |
| --- | :---: | :---: |
| `==高亮==` | ✅ | ❌ |
| ` ```js{2}` 行高亮 | ✅ | ❌ |
| `// [!code focus]` | ✅ | ❌ |
| `::: tip` 容器 | ✅ | ❌ |
| `> [!NOTE]` | ✅ | ✅ |
| 脚注 `[^1]` | ✅ | ✅ |
| 下标 `<sub>` / 上标 `<sup>` | ✅ | ✅ |
| 下标 `H~2~O` / 上标 `m^2^`（GFM 新扩展） | 视解析器版本 | ✅ |
| 任务列表 `- [x]` | ✅ | ✅ |

---

**文档说明**：本文所有「渲染效果」均在 Nuxt Content + Shiki + remark-gfm 环境下实测可用。本地执行 `npm run dev`，访问 `/blog/demo` 即可预览完整排版。
