<?php
/**
 * WooCommerce Integration
 *
 * @package Headless_WP_Theme
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add WooCommerce theme support
 */
function headless_wp_theme_woocommerce_support() {
    // Add WooCommerce support
    add_theme_support('woocommerce');
    
    // Add support for WooCommerce product gallery features
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
    
    // Add support for WooCommerce 3.0+ features
    add_theme_support('woocommerce', array(
        'thumbnail_image_width' => 300,
        'single_image_width' => 600,
        'product_grid' => array(
            'default_rows' => 3,
            'min_rows' => 2,
            'max_rows' => 8,
            'default_columns' => 3,
            'min_columns' => 2,
            'max_columns' => 5,
        ),
    ));
}
add_action('after_setup_theme', 'headless_wp_theme_woocommerce_support');

/**
 * WooCommerce wrapper start
 */
function headless_wp_theme_woocommerce_wrapper_start() {
    echo '<div id="primary" class="content-area">';
    echo '<main id="main" class="site-main woocommerce-main">';
    echo '<div class="container">';
}
add_action('woocommerce_before_main_content', 'headless_wp_theme_woocommerce_wrapper_start', 10);

/**
 * WooCommerce wrapper end
 */
function headless_wp_theme_woocommerce_wrapper_end() {
    echo '</div>'; // .container
    echo '</main>'; // .site-main
    echo '</div>'; // #primary
}
add_action('woocommerce_after_main_content', 'headless_wp_theme_woocommerce_wrapper_end', 10);

/**
 * Remove WooCommerce default sidebar
 */
remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);

/**
 * Enqueue WooCommerce styles
 */
function headless_wp_theme_woocommerce_scripts() {
    if (class_exists('WooCommerce')) {
        wp_enqueue_style('headless-wp-theme-woocommerce-style', HEADLESS_WP_THEME_URL . '/assets/css/woocommerce.css', array(), HEADLESS_WP_THEME_VERSION);
    }
}
add_action('wp_enqueue_scripts', 'headless_wp_theme_woocommerce_scripts');

/**
 * Modify WooCommerce loop columns
 */
function headless_wp_theme_woocommerce_loop_columns() {
    return 3;
}
add_filter('loop_shop_columns', 'headless_wp_theme_woocommerce_loop_columns');

/**
 * Modify WooCommerce products per page
 */
function headless_wp_theme_woocommerce_products_per_page() {
    return 12;
}
add_filter('loop_shop_per_page', 'headless_wp_theme_woocommerce_products_per_page');

/**
 * Add WooCommerce REST API enhancements for headless
 */
function headless_wp_theme_woocommerce_rest_api() {
    // Add custom fields to product REST API
    register_rest_field(
        'product',
        'featured_image_url',
        array(
            'get_callback' => 'headless_wp_theme_get_featured_image_url',
            'schema' => array(
                'description' => __('Featured image URL', 'headless-wp-theme'),
                'type' => 'string',
                'context' => array('view', 'edit'),
            ),
        )
    );
    
    // Add gallery images to product REST API
    register_rest_field(
        'product',
        'gallery_images',
        array(
            'get_callback' => 'headless_wp_theme_get_gallery_images',
            'schema' => array(
                'description' => __('Product gallery images', 'headless-wp-theme'),
                'type' => 'array',
                'context' => array('view', 'edit'),
            ),
        )
    );
    
    // Add product categories to REST API
    register_rest_field(
        'product',
        'product_categories',
        array(
            'get_callback' => 'headless_wp_theme_get_product_categories',
            'schema' => array(
                'description' => __('Product categories', 'headless-wp-theme'),
                'type' => 'array',
                'context' => array('view', 'edit'),
            ),
        )
    );
    
    // Add product tags to REST API
    register_rest_field(
        'product',
        'product_tags',
        array(
            'get_callback' => 'headless_wp_theme_get_product_tags',
            'schema' => array(
                'description' => __('Product tags', 'headless-wp-theme'),
                'type' => 'array',
                'context' => array('view', 'edit'),
            ),
        )
    );
}
add_action('rest_api_init', 'headless_wp_theme_woocommerce_rest_api');

/**
 * Get featured image URL
 */
function headless_wp_theme_get_featured_image_url($object, $field_name, $request) {
    if (has_post_thumbnail($object['id'])) {
        return wp_get_attachment_url(get_post_thumbnail_id($object['id']));
    }
    return null;
}

/**
 * Get gallery images
 */
function headless_wp_theme_get_gallery_images($object, $field_name, $request) {
    $product = wc_get_product($object['id']);
    if (!$product) {
        return array();
    }
    
    $gallery_images = array();
    $attachment_ids = $product->get_gallery_image_ids();
    
    foreach ($attachment_ids as $attachment_id) {
        $gallery_images[] = array(
            'id' => $attachment_id,
            'url' => wp_get_attachment_url($attachment_id),
            'alt' => get_post_meta($attachment_id, '_wp_attachment_image_alt', true),
        );
    }
    
    return $gallery_images;
}

/**
 * Get product categories
 */
function headless_wp_theme_get_product_categories($object, $field_name, $request) {
    $terms = get_the_terms($object['id'], 'product_cat');
    if (empty($terms) || is_wp_error($terms)) {
        return array();
    }
    
    $categories = array();
    foreach ($terms as $term) {
        $categories[] = array(
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'description' => $term->description,
        );
    }
    
    return $categories;
}

/**
 * Get product tags
 */
function headless_wp_theme_get_product_tags($object, $field_name, $request) {
    $terms = get_the_terms($object['id'], 'product_tag');
    if (empty($terms) || is_wp_error($terms)) {
        return array();
    }
    
    $tags = array();
    foreach ($terms as $term) {
        $tags[] = array(
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'description' => $term->description,
        );
    }
    
    return $tags;
}

/*
 * Cart and checkout: use WooCommerce's own Store API (/wp-json/wc/store/v1/cart,
 * /cart/add-item, /checkout and so on). It handles sessions, nonces and stock
 * checks, which custom cart endpoints can't do reliably: WooCommerce doesn't
 * load the cart for REST requests. https://developer.woocommerce.com/docs/apis/store-api/
 */
