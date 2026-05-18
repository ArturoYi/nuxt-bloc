---
title: Nuxt Bloc 起步站
description: 从零搭建 Nuxt 4 静态博客的最小可运行闭环。
navigation:
  title: 首页
---

# Nuxt Bloc 起步站

这是一个从零启动的 **Nuxt 4 静态博客** 示例工程，目标是先跑通最小闭环，再逐步加入 Markdown 扩展与编辑器。

## 你现在已经具备的能力

- 使用 `nuxt dev` 启动开发环境
- 使用 `@nuxt/content` 从 `content/` 读取 Markdown
- 使用文件路由创建 `/blog` 与 `/blog/...` 页面
- 使用 `nuxt generate` 生成可部署的静态产物

## 当前技术路线

:::tip
正式文章使用 `@nuxt/content` 渲染，Markdown 扩展与构建配置集中在 `nuxt.config.ts`。
:::

## 下一步建议

1. 先写几篇文章熟悉目录与路由。
2. 再增加分类、标签、照片墙等内容入口。
3. 最后做更完整的编辑器体验，例如草稿缓存、拖拽上传图片、快捷插入块。
