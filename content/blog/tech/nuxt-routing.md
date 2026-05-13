---
title: Nuxt 文件路由快速上手
description: 用一个多级 slug 页面理解 Nuxt 4 的文件路由和静态生成关系。
date: 2026-05-10
category: 路由
tags:
  - routing
  - nuxt4
  - ssg
published: true
---

# Nuxt 文件路由快速上手

当你在 `app/pages` 新建文件时，Nuxt 会自动把它映射成 URL。

## 几个最常见的映射

- `app/pages/index.vue` -> `/`
- `app/pages/blog/index.vue` -> `/blog`
- `app/pages/blog/[...slug].vue` -> `/blog/hello`、`/blog/tech/nuxt-routing`

## 为什么这里用 catch-all

:::warning
如果你以后希望文章支持多级目录，那么 `app/pages/blog/[...slug].vue` 会比 `app/pages/blog/[slug].vue` 更灵活。
:::

它可以兼容：

- `/blog/hello`
- `/blog/tech/nuxt-routing`
- `/blog/guides/content/getting-started`

## 数学公式与扩展语法

你可以继续往 Markdown 管线里叠加数学公式和自定义块：

$$
E = mc^2
$$

这类能力更适合在博客基本链路稳定后再接入。
