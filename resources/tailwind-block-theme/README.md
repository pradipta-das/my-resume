# Tailwind Block Theme

A lean WordPress block theme: full site editing, `theme.json` presets, and a Tailwind CSS build that uses those same presets. No page builder and no jQuery.

From [pradipta.online](https://pradipta.online/resources/tailwind-wordpress-block-theme).

## Install

1. In WordPress, go to Appearance › Themes › Add New Theme › Upload Theme, upload the ZIP, and activate it.
2. Open Appearance › Editor to change templates, colours, fonts and spacing.
3. Add the patterns (Hero, Features, Testimonials, Call to action) to any page from the block inserter, under Patterns › Tailwind Block Theme.

The built CSS is included, so you don't need Node.js unless you change the styles.

## How it fits together

| Path | What it is |
| --- | --- |
| `theme.json` | The design tokens (colours, fonts, font sizes, spacing, layout widths) and the block styles. **The single source of truth.** |
| `templates/`, `parts/` | Full site editing templates (blog, single post, page, archive, search, 404) and the header and footer. |
| `patterns/` | Hero, features, testimonials and call to action. Their text is translatable. |
| `src/theme.css` | The Tailwind CSS source. |
| `assets/css/theme.css` | The built CSS, loaded on the site and in the editor. |
| `functions.php` | Loads the CSS and registers the pattern category. |

Tailwind's colours and fonts point at the CSS variables WordPress generates from `theme.json` (for example `--wp--preset--color--primary`). So `bg-primary` in a pattern is always the colour editors see as "Primary", and changing it in the site editor updates both. Tailwind's own colour palette is switched off, so classes can't drift from the presets.

Tailwind's reset (preflight) is left out on purpose: WordPress styles the blocks itself, and a reset would fight it.

## Changing the styles

You need Node.js 20 or later.

```bash
npm install
npm run watch   # rebuilds as you edit
npm run build   # minified build for production
```

Tailwind only builds the classes it finds in `templates/`, `parts/` and `patterns/`. Classes typed into the editor (Advanced › Additional CSS class) are stored in the database, where Tailwind can't see them. List any you rely on in `src/theme.css`:

```css
@source inline("md:grid-cols-3 rounded-full");
```

To change a colour or font for the whole site, change it in `theme.json` (or the site editor), not in `src/theme.css`.

## Requirements

- WordPress 6.5 or later
- PHP 7.4 or later
- Node.js 20 or later, only to change the CSS

## Licence

GPL-2.0-or-later, like WordPress itself.
