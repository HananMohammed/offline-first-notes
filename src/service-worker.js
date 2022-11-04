import { precacheAndRoute } from "workbox-precaching";
 
if (!self.define) {
  let e,
    s = {};
  const i = (i, n) => (
    (i = new URL(i + ".js", n).href),
    s[i] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = i), (e.onload = s), document.head.appendChild(e);
        } else (e = i), importScripts(i), s();
      }).then(() => {
        let e = s[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, r) => {
    const o =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[o]) return;
    let t = {};
    const c = (e) => i(e, o),
      l = { module: { uri: o }, exports: t, require: c };
    s[o] = Promise.all(n.map((e) => l[e] || c(e))).then((e) => (r(...e), t));
  };
}
define(["./workbox-db5fc017"], function (e) {
  "use strict";
  e.setCacheNameDetails({ prefix: "offline-notes" }),
    self.skipWaiting(),
    e.precacheAndRoute(
        self.__WB_MANIFEST
    );
});

self.addEventListener('install', (event)=>{
    event.waitUtil(
        caches.open('offline-notes').then((cache)=>{
            return cache.addAll([
                'img/icons/favicon-16x16.png',
                'img/icons/favicon-32x32.png',
                'img/icons/android-chrome-192x192.png',
            ])
        })
    )
})
//# sourceMappingURL=service-worker.js.map
