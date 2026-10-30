/*
 * Keeps every free shipping bar on the page in step with the cart.
 *
 * Themes change the cart through Shopify's AJAX API (/cart/add, /cart/change,
 * /cart/update, /cart/clear), so the script watches for those requests and
 * reads /cart.js afterwards. That works with any theme, without hooking into
 * its own events. Bars added later (a cart drawer re-rendering, for example)
 * are filled in from the last cart seen.
 *
 * The threshold is set in the store's currency; for shoppers paying in another
 * currency it's converted with the storefront's exchange rate
 * (Shopify.currency.rate), so it can differ slightly from the converted
 * shipping rate after Shopify's rounding.
 */
(() => {
  if (window.freeShippingBar) return; // Loaded once per page, however many bars.

  const CART_CHANGE = /\/cart\/(add|change|update|clear)(\.js)?(\?|$)/;
  let lastCart = null;

  const root = () => window.Shopify?.routes?.root ?? "/";
  const rate = () => Number(window.Shopify?.currency?.rate) || 1;

  function formatMoney(cents, currency) {
    try {
      return new Intl.NumberFormat(document.documentElement.lang || undefined, {
        style: "currency",
        currency,
      }).format(cents / 100);
    } catch {
      return (cents / 100).toFixed(2);
    }
  }

  function render(cart, bars = document.querySelectorAll("[data-free-shipping-bar]")) {
    for (const bar of bars) {
      const threshold = Math.round(Number(bar.dataset.threshold) * rate());
      const left = Math.max(0, threshold - cart.total_price);
      const percent = threshold > 0 ? Math.min(100, Math.floor((cart.total_price / threshold) * 100)) : 100;
      const text =
        left === 0 ? bar.dataset.success : bar.dataset.message.replace("[amount]", formatMoney(left, cart.currency));

      const message = bar.querySelector(".free-shipping-bar__message");
      // Only when it changes, so screen readers don't repeat it.
      if (message.textContent !== text) message.textContent = text;

      bar.querySelector(".free-shipping-bar__track").setAttribute("aria-valuenow", String(percent));
      bar.querySelector(".free-shipping-bar__fill").style.width = `${percent}%`;
      bar.classList.toggle("is-complete", left === 0);
      bar.hidden = bar.dataset.hideWhenEmpty === "true" && cart.item_count === 0;
    }
  }

  async function refresh() {
    try {
      const response = await fetch(`${root()}cart.js`, { headers: { Accept: "application/json" } });
      if (!response.ok) return;
      lastCart = await response.json();
      render(lastCart);
    } catch {
      // Offline or blocked: the bar keeps what the page was rendered with.
    }
  }

  // Requests the theme makes with fetch.
  const nativeFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await nativeFetch.apply(this, args);
    const url = typeof args[0] === "string" ? args[0] : args[0]?.url;
    if (response.ok && url && CART_CHANGE.test(url)) refresh();
    return response;
  };

  // And with XMLHttpRequest, which older themes and jQuery use.
  const nativeOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (CART_CHANGE.test(String(url))) {
      this.addEventListener("load", () => {
        if (this.status >= 200 && this.status < 300) refresh();
      });
    }
    return nativeOpen.call(this, method, url, ...rest);
  };

  // Bars inserted after load, such as a re-rendered cart drawer.
  new MutationObserver((mutations) => {
    if (!lastCart) return;
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;
        const bars = node.matches("[data-free-shipping-bar]") ? [node] : node.querySelectorAll("[data-free-shipping-bar]");
        if (bars.length) render(lastCart, bars);
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  // Pages restored from the back/forward cache show an old cart.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) refresh();
  });

  window.freeShippingBar = { refresh };
  refresh();
})();
