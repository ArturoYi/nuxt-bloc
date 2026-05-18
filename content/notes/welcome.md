---
title: 笔记模块说明1
description: 笔记模块与博客共用同一套 Markdown 渲染与布局，内容存放在 content/notes/ 目录。
date: 2026-05-18
category: 说明
series: Markdown 入门
stage: 完整版
tags:
  - notes
published: true
---

# 笔记模块

这是 **笔记模块** 的示例页面，路由为 `/notes/welcome`。

## 与博客的区别

- 博客文章放在 `content/blog/`，路由前缀为 `/blog`
- 笔记放在 `content/notes/`，路由前缀为 `/notes`
- 列表页支持按分类筛选、按年份时间轴展示

## 如何新增笔记

在 `content/notes/` 下新建 `.md` 文件，frontmatter 字段与博客一致（`title`、`date`、`category`、`published` 等），保存后访问对应路径即可预览。
