<?php
/**
 * Title: Testimonials
 * Slug: tailwind-block-theme/testimonials
 * Categories: tailwind-block-theme, testimonials
 * Keywords: testimonials, quotes, reviews
 * Viewport Width: 1280
 * Description: Three quotes on cards. Replace the sample text with real words from real clients.
 *
 * @package Tailwind_Block_Theme
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"},"margin":{"top":"0","bottom":"0"}}},"backgroundColor":"muted","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-muted-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)"><!-- wp:heading {"textAlign":"center"} -->
<h2 class="wp-block-heading has-text-align-center"><?php esc_html_e( 'What clients say', 'tailwind-block-theme' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:columns {"align":"wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
<div class="wp-block-columns alignwide" style="margin-top:var(--wp--preset--spacing--50)">
<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"card-lift h-full rounded-2xl bg-base p-8 shadow-sm","layout":{"type":"default"}} -->
<div class="wp-block-group card-lift h-full rounded-2xl bg-base p-8 shadow-sm"><!-- wp:quote -->
<blockquote class="wp-block-quote"><!-- wp:paragraph -->
<p><?php esc_html_e( 'A sample testimonial. Swap in a short, specific quote from a real client.', 'tailwind-block-theme' ); ?></p>
<!-- /wp:paragraph --><cite><?php esc_html_e( 'Client name, Company', 'tailwind-block-theme' ); ?></cite></blockquote>
<!-- /wp:quote --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"card-lift h-full rounded-2xl bg-base p-8 shadow-sm","layout":{"type":"default"}} -->
<div class="wp-block-group card-lift h-full rounded-2xl bg-base p-8 shadow-sm"><!-- wp:quote -->
<blockquote class="wp-block-quote"><!-- wp:paragraph -->
<p><?php esc_html_e( 'Specific beats glowing: say what changed, such as more enquiries or a faster site.', 'tailwind-block-theme' ); ?></p>
<!-- /wp:paragraph --><cite><?php esc_html_e( 'Client name, Company', 'tailwind-block-theme' ); ?></cite></blockquote>
<!-- /wp:quote --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"card-lift h-full rounded-2xl bg-base p-8 shadow-sm","layout":{"type":"default"}} -->
<div class="wp-block-group card-lift h-full rounded-2xl bg-base p-8 shadow-sm"><!-- wp:quote -->
<blockquote class="wp-block-quote"><!-- wp:paragraph -->
<p><?php esc_html_e( 'Two or three sentences is plenty. Ask permission before you publish a name.', 'tailwind-block-theme' ); ?></p>
<!-- /wp:paragraph --><cite><?php esc_html_e( 'Client name, Company', 'tailwind-block-theme' ); ?></cite></blockquote>
<!-- /wp:quote --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->
</div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
