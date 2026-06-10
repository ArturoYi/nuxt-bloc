---
title: Flutter面试集锦
description: Flutter面试记录
date: 2026-06-05
category: 面试
series: 面试
stage: Flutter面试
tags:
  - notes
published: true
---

# Flutter面试题集锦

提前说明，这里作为记录本人实际面试和网上记录的一些面试心得，不会区分初级，中级，高级;也不会有什么顺序，仅供温故知新。


## Flutter里的三棵树

被问频率：较高（3/5）

**初级理解：** `Flutter` 核心三棵树——`Widget` 树、`Element` 树、`RenderObject` 树。`Widget` 树描述 `UI` 的结构与外观；`Element` 树是 `Widget` 树在渲染过程中的实例，负责管理 `Widget` 的生命周期与状态；`RenderObject` 树是 `Element` 树对应的渲染对象，负责将 `UI` 绘制到屏幕上。

**深入：**

> ##### 三棵树基础定位与职责

##### 1. `Widget` 树（配置层，不可变模板）

- **本质：** 纯配置、描述信息，不可变（`immutable`）
- **类分层：**
  - `Widget`：基类，`createElement()` 生成对应 `Element`
  - `StatelessWidget`：无状态，`build()` 返回 `Widget`
  - `StatefulWidget`：携带状态容器，`createState()` 生成 `State`
  - `RenderObjectWidget`：直接对应 `RenderObject`（如 `RenderBox`、`RenderFlex` 等）
- **职责：** 只描述 `UI` 长什么样、参数、样式、回调，不参与布局与绘制
- **特点：** 重建极频繁（`setState`、`InheritedWidget`、路由切换、父组件重建都会新建 `Widget` 实例），轻量、开销极小

##### 2. `Element` 树（实例管理层，中间调度核心）

`Flutter` 的所有更新、状态、上下文、挂载与卸载，全靠 `Element` 调度——它是三棵树的粘合剂。

- **分类：**
  1. `ComponentElement`：对应 `StatelessWidget` / `StatefulWidget`
     - `StatefulElement`：持有 `State`，`setState()` 触发后标记脏元素
     - `StatelessElement`：无状态，只执行 `build()`
  2. `RenderObjectElement`：对应 `RenderObjectWidget`，持有 `RenderObject` 实例
- **核心能力：**
  - 持有上下文 `BuildContext`（`BuildContext` 本质就是 `Element` 自身）
  - 维护挂载状态：`mounted = true / false`
  - 对比新旧 `Widget`、复用节点、标记脏区域、驱动重建
  - 管理生命周期：初始化、更新、卸载、销毁

##### 3. `RenderObject` 树（渲染绘制层，真实布局绘制载体）

唯一真正执行布局、测量、绘制、点击命中与层叠的实体。

- **基类：** `RenderObject`；移动端最常用 `RenderBox`（矩形布局）
- **常见实例：**
  - `RenderFlex`（`Row` / `Column`）
  - `RenderStack`（`Stack`）
  - `RenderParagraph`（`Text`）
  - `RenderDecoratedBox`（`Container` 背景与阴影）
  - `RenderProxyBox`（`Padding`、`Align`、`Opacity` 等包装类）
- **三大核心流程：**
  1. **布局阶段（`Layout`）：** 约束传递 → 测量大小（`performLayout`）→ 设置自身位置与尺寸
  2. **绘制阶段（`Paint`）：** 生成绘制指令，写入 `PictureLayer`
  3. **命中测试（`HitTest`）：** 手势点击与事件分发的依据
- **特点：** 重量级对象，创建与销毁成本高；`Flutter` 极力复用 `RenderObject`，绝不轻易重建

> ##### 三者绑定关系

一对一绑定规则

> ##### 完整渲染管线（从 `setState` 到屏幕像素，三树联动全流程）

> ##### 分维度深度学习路线（高级→资深进阶）

> ##### 高频误区（资深踩坑避雷）

> ##### 循序渐进

## `Flutter Key` 体系

被问频率：较高（3/5）

## `Future`和`Stream` 使用和区别

被问频率：较高（3/5）

## `Flutter isolate` 的理解和使用

被问频率：较高（3/5）

## 页面卡顿以及解决方案

被问频率：一般（2/5）

## `Widget` 生命周期

被问频率：较高（3/5）