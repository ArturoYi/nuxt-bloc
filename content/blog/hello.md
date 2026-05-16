---
title: 第一篇文章：把最小闭环跑通
description: 先确认 Nuxt 项目、内容系统、页面路由和 generate 都能工作，再继续扩展。
date: 2027-05-11
category: 起步
series: 
stage: 
tags:
  - nuxt
  - content
  - static
published: true
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

[显示文字](目标地址)
[Nuxt官网](https://nuxt.com)


::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
```

```ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
```

:::

## 高级语法测试

### Diff 效果
```js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```

### 错误与警告
```js
export default {
  data () {
    return {
      msg: 'Error', // [!code error]
      msg: 'Warning' // [!code warning]
    }
  }
}
```

## 一个简单代码块

```js:line-numbers {1}
export default {
  data () {
    return {
      msg: 'Focused!' // [!code focus]
    }
  }
}
```

```js
export default {
  data () {
    return {
      msg: 'Next 3 lines focused!' // [!code focus:3]
    }
  }
}
```

```js{1,4,6-8}
export default { // Highlighted
  data () {
    return {
      msg: `Highlighted!
      This line isn't highlighted,
      but this and the next 2 are.`,
      motd: 'VitePress is awesome',
      lorem: 'ipsum'
    }
  }
}
```

```js
export default {
  data () {
    return {
      msg: 'Focused!' // [!code focus]
    }
  }
}
```


```ts{2-3}
console.log('hello')
export function bootstrapBlog() {
  return 'start small, verify fast'
}
```

---
3243434
---

| Key | Type      | Description |
| --- | --------- | ----------- |
| 1   | Wonderful | Table       |
| 2   | Wonderful | Data        |
| 3   | Wonderful | Website     |




676



# Markdown 语法完整测试
## 二级标题测试
### 三级标题测试
#### 四级标题测试

日常开发中最常用的**加粗文本**、*斜体文本*、~~删除线~~、`行内代码`都能正常渲染。

更有进阶语法：==文字高亮== 测试，以及脚注测试[^1]。

[^1]: 这里是脚注的详细说明内容。

## 1. 图文展示
### 风景配图


日常写教程配图非常方便，直接插入网络图片即可自适应页面宽度。

### 桌面壁纸图


## 2. 列表格式
- 无序列表第一项
- 无序列表第二项
  - 嵌套子列表
  - 多层嵌套内容
- 无序列表第三项

1. 有序列表步骤一
2. 有序列表步骤二
3. 有序列表步骤三

## 3. 引用文案
> 这是一段引用文本，适合放提示、知识点总结
>> 双层嵌套引用内容


23

```vue
<script setup>
const name = 'Nuxt3 测试页面'
</script>
```
2323