export {}

declare module '#app' {
  interface PageMeta {
    /** 是否在默认布局中显示页脚；未设置时为 false */
    showFooter?: boolean
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    showFooter?: boolean
  }
}
