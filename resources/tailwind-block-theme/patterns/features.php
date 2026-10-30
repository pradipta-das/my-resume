<?php
/**
 * Title: Features
 * Slug: tailwind-block-theme/features
 * Categories: tailwind-block-theme, featured, columns
 * Keywords: features, services, cards, columns
 * Viewport Width: 1280
 * Description: A heading and three cards that lift on hover.
 *
 * @package Tailwind_Block_Theme
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)"><!-- wp:heading {"textAlign":"center"} -->
<h2 class="wp-block-heading has-text-align-center"><?php esc_html_e( 'What you get', 'tailwind-block-theme' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:columns {"align":"wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
<div class="wp-block-columns alignwide" style="margin-top:var(--wp--preset--spacing--50)">
<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"card-lift h-full rounded-2xl border border-border bg-base p-8","layout":{"type":"default"}} -->
<div class="wp-block-group card-lift h-full rounded-2xl border border-border bg-base p-8"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php esc_html_e( 'Fast by default', 'tailwind-block-theme' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"subtle"} -->
<p class="has-subtle-color has-text-color"><?php esc_html_e( 'No page builder and no jQuery. Pages ship only the CSS they use.', 'tailwind-block-theme' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"card-lift h-full rounded-2xl border border-border bg-base p-8","layout":{"type":"default"}} -->
<div class="wp-block-group card-lift h-full rounded-2xl border border-border bg-base p-8"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php esc_html_e( 'Easy to edit', 'tailwind-block-theme' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"subtle"} -->
<p class="has-subtle-color has-text-color"><?php esc_html_e( 'Every template, colour and font can be changed in the site editor.', 'tailwind-block-theme' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"card-lift h-full rounded-2xl border border-border bg-base p-8","layout":{"type":"default"}} -->
<div class="wp-block-group card-lift h-full rounded-2xl border border-border bg-base p-8"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php esc_html_e( 'Built to grow', 'tailwind-block-theme' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"subtle"} -->
<p class="has-subtle-color has-text-color"><?php esc_html_e( 'Patterns you can mix and match as the site gets bigger.', 'tailwind-block-theme' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->
</div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
