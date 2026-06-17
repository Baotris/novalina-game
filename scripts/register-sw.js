"use strict";
// Service worker disabled — always load fresh. Also clean up any previously-installed SW + caches.
window.C3_RegisterSW = async function () {};
(async () => {
  try {
    if (navigator.serviceWorker) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if (self.caches) { const keys = await caches.keys(); await Promise.all(keys.map(k => caches.delete(k))); }
  } catch (e) {}
})();
