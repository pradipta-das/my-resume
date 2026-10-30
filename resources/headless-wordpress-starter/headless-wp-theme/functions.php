<?php
/**
 * Headless WP Theme functions and definitions
 *
 * @package Headless_WP_Theme
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define theme constants
define('HEADLESS_WP_THEME_VERSION', '1.1.0');
define('HEADLESS_WP_THEME_PATH', get_template_directory());
define('HEADLESS_WP_THEME_URL', get_template_directory_uri());

/**
 * Theme setup function
 */
function headless_wp_theme_setup() {
    // Add theme support for various features
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));
    
    // Add support for custom background
    add_theme_support('custom-background', array(
        'default-color' => 'ffffff',
        'default-image' => '',
    ));
    
    // Add support for custom header
    add_theme_support('custom-header', array(
        'default-image' => '',
        'width' => 1920,
        'height' => 400,
        'flex-height' => true,
        'flex-width' => true,
        'header-text' => false,
    ));
    
    // Add support for custom logo
    add_theme_support('custom-logo', array(
        'height' => 100,
        'width' => 400,
        'flex-height' => true,
        'flex-width' => true,
    ));
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'headless-wp-theme'),
        'footer' => __('Footer Menu', 'headless-wp-theme'),
    ));
    
    // Add theme support for selective refresh for widgets
    add_theme_support('customize-selective-refresh-widgets');
    
    // Add theme support for editor styles
    add_theme_support('editor-styles');
    
    // Add support for wide and full alignment
    add_theme_support('align-wide');
    
    // Add support for responsive embeds
    add_theme_support('responsive-embeds');
    
    // Add support for block editor color palette
    add_theme_support('editor-color-palette', array(
        array(
            'name' => __('Primary', 'headless-wp-theme'),
            'slug' => 'primary',
            'color' => '#007cba',
        ),
        array(
            'name' => __('Secondary', 'headless-wp-theme'),
            'slug' => 'secondary',
            'color' => '#666666',
        ),
        array(
            'name' => __('Dark', 'headless-wp-theme'),
            'slug' => 'dark',
            'color' => '#333333',
        ),
        array(
            'name' => __('Light', 'headless-wp-theme'),
            'slug' => 'light',
            'color' => '#f8f9fa',
        ),
    ));
    
    // Add support for block editor font sizes
    add_theme_support('editor-font-sizes', array(
        array(
            'name' => __('Small', 'headless-wp-theme'),
            'slug' => 'small',
            'size' => 14,
        ),
        array(
            'name' => __('Regular', 'headless-wp-theme'),
            'slug' => 'regular',
            'size' => 16,
        ),
        array(
            'name' => __('Large', 'headless-wp-theme'),
            'slug' => 'large',
            'size' => 20,
        ),
        array(
            'name' => __('Extra Large', 'headless-wp-theme'),
            'slug' => 'extra-large',
            'size' => 24,
        ),
    ));
    
    // Disable custom colors and font sizes to enforce design consistency
    add_theme_support('disable-custom-colors');
    add_theme_support('disable-custom-font-sizes');
    
    // Add theme support for block patterns
    add_theme_support('core-block-patterns');
    
    // Set content width
    $GLOBALS['content_width'] = 1200;
}
add_action('after_setup_theme', 'headless_wp_theme_setup');

/**
 * Enqueue scripts and styles
 */
function headless_wp_theme_scripts() {
    // Enqueue main stylesheet
    wp_enqueue_style('headless-wp-theme-style', get_stylesheet_uri(), array(), HEADLESS_WP_THEME_VERSION);
    
    // Enqueue block editor styles
    wp_enqueue_style('headless-wp-theme-block-style', HEADLESS_WP_THEME_URL . '/assets/css/blocks.css', array(), HEADLESS_WP_THEME_VERSION);
    
    // Enqueue main JavaScript
    wp_enqueue_script('headless-wp-theme-script', HEADLESS_WP_THEME_URL . '/assets/js/main.js', array('jquery'), HEADLESS_WP_THEME_VERSION, true);
    
    // Localize script for AJAX
    wp_localize_script('headless-wp-theme-script', 'headless_wp_theme_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('headless_wp_theme_nonce'),
        'rest_url' => rest_url('wp/v2/'),
    ));
    
    // Add threaded comments script
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'headless_wp_theme_scripts');

/**
 * Enqueue block editor assets
 */
function headless_wp_theme_block_editor_assets() {
    wp_enqueue_style('headless-wp-theme-block-editor-style', HEADLESS_WP_THEME_URL . '/assets/css/editor.css', array(), HEADLESS_WP_THEME_VERSION);
    wp_enqueue_script('headless-wp-theme-block-editor-script', HEADLESS_WP_THEME_URL . '/assets/js/editor.js', array('wp-blocks', 'wp-dom-ready', 'wp-edit-post'), HEADLESS_WP_THEME_VERSION, true);
}
add_action('enqueue_block_editor_assets', 'headless_wp_theme_block_editor_assets');

/**
 * Register widget areas
 */
function headless_wp_theme_widgets_init() {
    register_sidebar(array(
        'name' => __('Primary Sidebar', 'headless-wp-theme'),
        'id' => 'primary-sidebar',
        'description' => __('Add widgets here to appear in your sidebar.', 'headless-wp-theme'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget' => '</section>',
        'before_title' => '<h2 class="widget-title">',
        'after_title' => '</h2>',
    ));
    
    register_sidebar(array(
        'name' => __('Footer Widget Area', 'headless-wp-theme'),
        'id' => 'footer-widgets',
        'description' => __('Add widgets here to appear in your footer.', 'headless-wp-theme'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));
}
add_action('widgets_init', 'headless_wp_theme_widgets_init');

/**
 * Include additional theme files
 */
require_once HEADLESS_WP_THEME_PATH . '/inc/theme-settings.php';
require_once HEADLESS_WP_THEME_PATH . '/inc/gutenberg.php';
require_once HEADLESS_WP_THEME_PATH . '/inc/woocommerce.php';
require_once HEADLESS_WP_THEME_PATH . '/inc/headless.php';

/**
 * Custom excerpt length
 */
function headless_wp_theme_excerpt_length($length) {
    return 25;
}
add_filter('excerpt_length', 'headless_wp_theme_excerpt_length');

/**
 * Custom excerpt more
 */
function headless_wp_theme_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'headless_wp_theme_excerpt_more');

/**
 * Add custom image sizes
 */
function headless_wp_theme_image_sizes() {
    add_image_size('headless-wp-theme-featured', 800, 400, true);
    add_image_size('headless-wp-theme-thumbnail', 300, 200, true);
    add_image_size('headless-wp-theme-large', 1200, 600, true);
}
add_action('after_setup_theme', 'headless_wp_theme_image_sizes');

/**
 * Add custom image sizes to media library
 */
function headless_wp_theme_custom_image_sizes($sizes) {
    return array_merge($sizes, array(
        'headless-wp-theme-featured' => __('Featured Image', 'headless-wp-theme'),
        'headless-wp-theme-thumbnail' => __('Thumbnail', 'headless-wp-theme'),
        'headless-wp-theme-large' => __('Large', 'headless-wp-theme'),
    ));
}
add_filter('image_size_names_choose', 'headless_wp_theme_custom_image_sizes');

/**
 * Security enhancements
 */
function headless_wp_theme_security() {
    // Remove WordPress version from head
    remove_action('wp_head', 'wp_generator');
    
    // Remove RSD link
    remove_action('wp_head', 'rsd_link');
    
    // Remove wlwmanifest.xml
    remove_action('wp_head', 'wlwmanifest_link');
    
    // Remove shortlink
    remove_action('wp_head', 'wp_shortlink_wp_head');
    
    // Remove feed links
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);
}
add_action('init', 'headless_wp_theme_security');

/**
 * Optimize WordPress for headless usage
 */
function headless_wp_theme_optimize_for_headless() {
    // Disable emoji scripts
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');
    
    // Remove unnecessary WordPress features for headless
    remove_action('wp_head', 'wp_resource_hints', 2);
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
    remove_action('wp_head', 'wp_oembed_add_host_js');
    
    // Clean up wp_head
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10);
    remove_action('wp_head', 'wp_generator');
}
add_action('init', 'headless_wp_theme_optimize_for_headless');

/**
 * Add theme support for automatic feed links
 */
add_theme_support('automatic-feed-links');

/**
 * Enable support for Post Formats
 */
add_theme_support('post-formats', array(
    'aside',
    'gallery',
    'link',
    'image',
    'quote',
    'status',
    'video',
    'audio',
    'chat',
));

/**
 * Filter to add custom classes to body
 */
function headless_wp_theme_body_classes($classes) {
    // Add class for admin bar
    if (is_admin_bar_showing()) {
        $classes[] = 'admin-bar-showing';
    }
    
    // Add class for singular pages
    if (is_singular()) {
        $classes[] = 'singular';
    }
    
    return $classes;
}
add_filter('body_class', 'headless_wp_theme_body_classes');