const SCROLLBAR_IDLE_MS = 800;

const cleanups = new WeakMap<Element, () => void>();

function bindScrollbarReveal(el: Element, scrollSource: Element | Window = el) {
  let idleTimer: ReturnType<typeof setTimeout> | undefined;

  const markActive = () => {
    el.classList.add("is-scrollbar-active");
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      el.classList.remove("is-scrollbar-active");
      idleTimer = undefined;
    }, SCROLLBAR_IDLE_MS);
  };

  el.classList.add("scroll-reveal");
  scrollSource.addEventListener("scroll", markActive, { passive: true });

  return () => {
    if (idleTimer) clearTimeout(idleTimer);
    scrollSource.removeEventListener("scroll", markActive);
    el.classList.remove("scroll-reveal", "is-scrollbar-active");
  };
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("scrollbar-reveal", {
    mounted(el) {
      if (!import.meta.client) return;
      cleanups.set(el, bindScrollbarReveal(el));
    },
    unmounted(el) {
      if (!import.meta.client) return;
      cleanups.get(el)?.();
      cleanups.delete(el);
    },
  });

  if (!import.meta.client) return;

  nuxtApp.hook("app:mounted", () => {
    const html = document.documentElement;
    if (cleanups.has(html)) return;
    cleanups.set(html, bindScrollbarReveal(html, window));
  });
});
