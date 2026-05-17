export {}

declare module '#app' {
  interface PageMeta {
    /** 是否在默认布局中显示页脚；未设置时为 false */
    showFooter?: boolean
    /** 编辑器全屏布局：主内容区占满站点头部以下的视口 */
    editorFullscreen?: boolean
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    showFooter?: boolean
    editorFullscreen?: boolean
  }
}
