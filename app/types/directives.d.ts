import type { Directive } from "vue";

declare module "vue" {
  interface GlobalDirectives {
    scrollbarReveal: Directive<HTMLElement>;
  }
}

export {};
