<?php
/**
 * Tailwind Block Theme.
 *
 * Almost everything lives in theme.json, the templates and the patterns. This
 * file only loads the Tailwind build (assets/css/theme.css) on the site and in
 * the editor, and registers the pattern category.
 *
 * @package Tailwind_Block_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// The built CSS, versioned by its modification time so a rebuild busts caches.
function tailwind_block_theme_css_version() {
	$file = get_theme_file_path( 'assets/css/theme.css' );
	return file_exists( $file ) ? (string) filemtime( $file ) : wp_get_theme()->get( 'Version' );
}

add_action(
	'wp_enqueue_scripts',
	function () {
		wp_enqueue_style(
			'tailwind-block-theme',
			get_theme_file_uri( 'assets/css/theme.css' ),
			array(),
			tailwind_block_theme_css_version()
		);
	}
);

add_action(
	'after_setup_theme',
	function () {
		// The same utilities in the editor, so patterns look the same there.
		add_editor_style( 'assets/css/theme.css' );
		load_theme_textdomain( 'tailwind-block-theme', get_template_directory() . '/languages' );
	}
);

add_action(
	'init',
	function () {
		register_block_pattern_category(
			'tailwind-block-theme',
			array( 'label' => __( 'Tailwind Block Theme', 'tailwind-block-theme' ) )
		);
	}
);
