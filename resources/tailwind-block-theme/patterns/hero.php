<?php
/**
 * Title: Hero
 * Slug: tailwind-block-theme/hero
 * Categories: tailwind-block-theme, featured, banner
 * Keywords: hero, banner, intro, header
 * Viewport Width: 1280
 * Description: A full-width introduction with a heading, a short line and two buttons.
 *
 * @package Tailwind_Block_Theme
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"},"margin":{"top":"0","bottom":"0"}}},"backgroundColor":"muted","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-muted-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)"><!-- wp:paragraph {"className":"font-semibold uppercase tracking-widest","textColor":"primary","fontSize":"small"} -->
<p class="font-semibold uppercase tracking-widest has-primary-color has-text-color has-small-font-size"><?php esc_html_e( 'Introducing', 'tailwind-block-theme' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"fontSize":"xxx-large"} -->
<h2 class="wp-block-heading has-xxx-large-font-size"><?php esc_html_e( 'A website that feels custom and stays fast.', 'tailwind-block-theme' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"subtle","fontSize":"large"} -->
<p class="has-subtle-color has-text-color has-large-font-size"><?php esc_html_e( 'Say what you do and who it is for in one or two sentences. Keep it short enough to read at a glance.', 'tailwind-block-theme' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#"><?php esc_html_e( 'Get started', 'tailwind-block-theme' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="#"><?php esc_html_e( 'Learn more', 'tailwind-block-theme' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->
