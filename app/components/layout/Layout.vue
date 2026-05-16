<template>
  <!-- 核心布局容器 -->
  <div class="layout-wrap">
    <!-- 左侧边栏：<aside> 语义标签 -->
    <LayoutSidebar>
      <slot name="sidebar" />
    </LayoutSidebar>

    <!-- 中间内容区：<main> 语义标签 -->
    <LayoutContent>
      <LayoutMain>
        <slot name="main" />
      </LayoutMain>
    </LayoutContent>
    <!-- 右侧大纲：<aside> 语义标签 -->
    <LayoutAside>
      <slot name="aside" />
    </LayoutAside>
  </div>
</template>
