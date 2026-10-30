# Free Shipping Progress Bar for Shopify

A theme section that shows shoppers how close they are to free shipping, and updates as they add to the cart, without a page reload. No app, no outside scripts and no tracking.

From [pradipta.online](https://pradipta.online/resources/shopify-free-shipping-bar).

## What's inside

| File | What it does |
| --- | --- |
| `sections/free-shipping-bar.liquid` | The section you add in the theme editor, with its settings |
| `snippets/free-shipping-bar.liquid` | The bar itself, which you can also place in a cart drawer |
| `assets/free-shipping-bar.js` | Keeps every bar on the page up to date as the cart changes |
| `assets/free-shipping-bar.css` | The styles, coloured from the section settings |

It works with Online Store 2.0 themes, such as Dawn, that change the cart through Shopify's AJAX cart API, which most do.

## Install

1. **Back up your theme first:** in Online Store › Themes, open the theme's menu (…) and choose Duplicate.
2. On the theme you're changing, choose … › Edit code.
3. Add the four files:
   - Under **Sections**, choose "Add a new section", name it `free-shipping-bar`, and replace its contents with `sections/free-shipping-bar.liquid`.
   - Under **Snippets**, add `free-shipping-bar` the same way, with `snippets/free-shipping-bar.liquid`.
   - Under **Assets**, choose "Add a new asset" and upload `free-shipping-bar.js` and `free-shipping-bar.css`.
4. Open **Customize**, and add the **Free shipping bar** section where you want it:
   - on the **Cart** page template, or
   - in the **Header** area, so it shows on every page.
5. Set **Free shipping minimum** to match your free shipping rate in Settings › Shipping and delivery, and adjust the messages and colours.
6. Save, then test with a cart below and above the minimum.

### In the cart drawer

Sections can't be added to a cart drawer from the theme editor, so place the snippet there yourself. In Dawn, open `snippets/cart-drawer.liquid` and add this line just after the drawer's header (`<div class="drawer__header">…</div>`):

```liquid
{% render 'free-shipping-bar', threshold: 50 %}
```

Use the same minimum as your shipping rate. The snippet accepts the same options as the section:

```liquid
{% render 'free-shipping-bar',
  threshold: 50,
  message: "Spend [amount] more for free delivery",
  success_message: "Free delivery unlocked",
  bar_color: '#1a7f37',
  track_color: '#e6e6e6',
  hide_when_empty: true
%}
```

## Good to know

- **The minimum is in your store's currency.** Shoppers paying in another currency see it converted at the storefront's exchange rate. Shopify may round your converted shipping rate slightly differently, so the bar can be a little off near the line.
- **The bar counts the cart total after discounts.**
- **Screen readers announce the message** when it changes, and the bar is a labelled progress bar.
- **To remove it,** delete the section in the theme editor (and the snippet line from the cart drawer, if you added it), then delete the four files.

## Licence

MIT. Use it, change it, ship it. See `LICENSE`.
