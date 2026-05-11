---
title: 第一篇文章：把最小闭环跑通
description: 先确认 Nuxt 项目、内容系统、页面路由和 generate 都能工作，再继续扩展。
date: 2026-05-11
category: 起步
tags:
  - nuxt
  - content
  - static
published: true
cover: /blog/bootstrap-cover.svg
---

# 第一篇文章：把最小闭环跑通

做内容型站点时，第一目标不是“功能很多”，而是 **从开发到生成静态站的链路可验证**。

## 为什么先做最小闭环

:::info
如果一上来同时加编辑器、图库、自定义语法、搜索和评论，你很难判断问题究竟出在哪一层。
:::

- 先让 `app/pages` 路由工作
- 再让 `content/**/*.md` 能被读取
- 然后渲染文章列表和详情
- 最后跑 `nuxt generate`

## 一个简单代码块

```ts
export function bootstrapBlog() {
  return 'start small, verify fast'
}
```

## 验收清单

1. 首页能打开
2. `/blog` 能看到文章列表
3. `/blog/hello` 能看到正文
4. `npm run generate` 能产出静态页面
