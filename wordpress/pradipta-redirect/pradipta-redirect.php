<?php
/**
 * Plugin Name: Pradipta Redirect
 * Description: Sends visitors of this WordPress site's front end to the matching page on pradipta.online with a permanent (301) redirect. The admin, login, REST API, uploads, robots.txt and editor previews are left alone.
 * Version:     1.0.0
 * Author:      Pradipta Das
 * Requires PHP: 7.4
 *
 * Where things go:
 *   a blog post (/my-post/)                    -> pradipta.online/blog/my-post
 *   the blog index, archives, search and feeds -> pradipta.online/blog
 *   everything else (home, pages, 404s, ...)   -> pradipta.online
 *
 * The destination site can be changed in wp-config.php:
 *
 *     define( 'PRADIPTA_REDIRECT_TO', 'https://pradipta.online' );
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * Runs on template_redirect, which only fires for front-end page requests:
 * wp-admin, wp-login.php, admin-ajax, wp-cron, the REST API and files in
 * wp-content (images the Next.js site loads) never reach it.
 * Priority 0 runs it before WordPress's own canonical redirects.
 */
add_action( 'template_redirect', function () {
	// Editors preview content through front-end URLs; those must keep working.
	if ( is_preview() || is_customize_preview() || isset( $_GET['elementor-preview'] ) ) {
		return;
	}

	// Crawlers read robots.txt per domain and need it to reach the redirects.
	if ( is_robots() || ( function_exists( 'is_favicon' ) && is_favicon() ) ) {
		return;
	}

	$site = untrailingslashit( defined( 'PRADIPTA_REDIRECT_TO' ) ? PRADIPTA_REDIRECT_TO : 'https://pradipta.online' );

	if ( is_singular( 'post' ) ) {
		$target = $site . '/blog/' . get_post_field( 'post_name', get_queried_object_id() );
	} elseif ( is_front_page() && ! is_feed() ) {
		// Checked before is_home(): the front page can also be the posts page.
		$target = $site;
	} elseif ( is_home() || is_archive() || is_search() || is_feed() ) {
		$target = $site . '/blog';
	} else {
		$target = $site;
	}

	// Lets a theme or another plugin map extra content types (e.g. portfolio items).
	$target = apply_filters( 'pradipta_redirect_target', $target, get_queried_object() );

	wp_redirect( $target, 301, 'Pradipta Redirect' );
	exit;
}, 0 );
