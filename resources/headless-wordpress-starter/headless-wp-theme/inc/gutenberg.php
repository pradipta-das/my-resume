<?php
/**
 * Gutenberg/Block Editor Enhancements
 *
 * @package Headless_WP_Theme
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add Gutenberg theme support
 */
function headless_wp_theme_gutenberg_support() {
    // Add theme support for Gutenberg wide images
    add_theme_support('align-wide');
    
    // Add theme support for Gutenberg responsive embeds
    add_theme_support('responsive-embeds');
    
    // Add theme support for Gutenberg editor styles
    add_theme_support('editor-styles');
    
    // Add editor stylesheet
    add_editor_style('assets/css/editor-style.css');
    
    // Add theme support for dark editor style
    add_theme_support('dark-editor-style');
    
    // Add theme support for block patterns
    add_theme_support('core-block-patterns');
}
add_action('after_setup_theme', 'headless_wp_theme_gutenberg_support');

/**
 * Enqueue Gutenberg block assets
 */
function headless_wp_theme_block_assets() {
    // Enqueue block editor styles
    wp_enqueue_style(
        'headless-wp-theme-block-editor-styles',
        HEADLESS_WP_THEME_URL . '/assets/css/blocks.css',
        array(),
        HEADLESS_WP_THEME_VERSION
    );
    
    // Enqueue block editor scripts
    wp_enqueue_script(
        'headless-wp-theme-block-editor-scripts',
        HEADLESS_WP_THEME_URL . '/assets/js/blocks.js',
        array('wp-blocks', 'wp-element', 'wp-editor'),
        HEADLESS_WP_THEME_VERSION,
        true
    );
}
add_action('enqueue_block_editor_assets', 'headless_wp_theme_block_assets');

/**
 * Add custom block categories
 */
function headless_wp_theme_block_categories($categories, $post) {
    return array_merge(
        $categories,
        array(
            array(
                'slug' => 'headless-wp-theme',
                'title' => __('Headless WP Theme', 'headless-wp-theme'),
                'icon' => 'wordpress',
            ),
        )
    );
}
add_filter('block_categories_all', 'headless_wp_theme_block_categories', 10, 2);

/**
 * Register custom block styles
 */
function headless_wp_theme_register_block_styles() {
    // Button block styles
    register_block_style(
        'core/button',
        array(
            'name' => 'outline',
            'label' => __('Outline', 'headless-wp-theme'),
            'style_handle' => 'headless-wp-theme-block-styles',
        )
    );
    
    register_block_style(
        'core/button',
        array(
            'name' => 'ghost',
            'label' => __('Ghost', 'headless-wp-theme'),
            'style_handle' => 'headless-wp-theme-block-styles',
        )
    );
    
    // Quote block styles
    register_block_style(
        'core/quote',
        array(
            'name' => 'large-quote',
            'label' => __('Large Quote', 'headless-wp-theme'),
            'style_handle' => 'headless-wp-theme-block-styles',
        )
    );
    
    // Group block styles
    register_block_style(
        'core/group',
        array(
            'name' => 'card',
            'label' => __('Card', 'headless-wp-theme'),
            'style_handle' => 'headless-wp-theme-block-styles',
        )
    );
    
    register_block_style(
        'core/group',
        array(
            'name' => 'shadow',
            'label' => __('Shadow', 'headless-wp-theme'),
            'style_handle' => 'headless-wp-theme-block-styles',
        )
    );
}
add_action('init', 'headless_wp_theme_register_block_styles');

/**
 * Register custom block patterns
 */
function headless_wp_theme_register_block_patterns() {
    // Hero pattern
    register_block_pattern(
        'headless-wp-theme/hero',
        array(
            'title' => __('Hero Section', 'headless-wp-theme'),
            'description' => __('A hero section with title, subtitle, and button', 'headless-wp-theme'),
            'content' => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"4rem","bottom":"4rem"}}},"backgroundColor":"primary","textColor":"white"} -->
<div class="wp-block-group alignfull has-white-color has-primary-background-color has-text-color has-background" style="padding-top:4rem;padding-bottom:4rem"><!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"textAlign":"center","level":1,"fontSize":"xx-large"} -->
<h1 class="has-text-align-center has-xx-large-font-size">Welcome to Our Website</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">This is a hero section with a call-to-action button</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"white","textColor":"primary"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-primary-color has-white-background-color has-text-color has-background wp-element-button">Get Started</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->',
            'categories' => array('headless-wp-theme'),
        )
    );
    
    // Two column feature pattern
    register_block_pattern(
        'headless-wp-theme/two-column-feature',
        array(
            'title' => __('Two Column Feature', 'headless-wp-theme'),
            'description' => __('A two-column layout with image and text', 'headless-wp-theme'),
            'content' => '<!-- wp:columns {"verticalAlignment":"center"} -->
<div class="wp-block-columns are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img alt=""/></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:heading {"level":2} -->
<h2>Feature Title</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>This is a description of the feature. You can add more details about what makes this feature special and how it benefits your users.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Learn More</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->',
            'categories' => array('headless-wp-theme'),
        )
    );
    
    // Card grid pattern
    register_block_pattern(
        'headless-wp-theme/card-grid',
        array(
            'title' => __('Card Grid', 'headless-wp-theme'),
            'description' => __('A three-column card grid layout', 'headless-wp-theme'),
            'content' => '<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"style":{"border":{"radius":"8px"},"spacing":{"padding":{"top":"2rem","right":"2rem","bottom":"2rem","left":"2rem"}}},"backgroundColor":"light","className":"is-style-card"} -->
<div class="wp-block-group is-style-card has-light-background-color has-background" style="border-radius:8px;padding-top:2rem;padding-right:2rem;padding-bottom:2rem;padding-left:2rem"><!-- wp:heading {"level":3} -->
<h3>Card Title 1</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>This is the content of the first card. You can add any content here.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"style":{"border":{"radius":"8px"},"spacing":{"padding":{"top":"2rem","right":"2rem","bottom":"2rem","left":"2rem"}}},"backgroundColor":"light","className":"is-style-card"} -->
<div class="wp-block-group is-style-card has-light-background-color has-background" style="border-radius:8px;padding-top:2rem;padding-right:2rem;padding-bottom:2rem;padding-left:2rem"><!-- wp:heading {"level":3} -->
<h3>Card Title 2</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>This is the content of the second card. You can add any content here.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"style":{"border":{"radius":"8px"},"spacing":{"padding":{"top":"2rem","right":"2rem","bottom":"2rem","left":"2rem"}}},"backgroundColor":"light","className":"is-style-card"} -->
<div class="wp-block-group is-style-card has-light-background-color has-background" style="border-radius:8px;padding-top:2rem;padding-right:2rem;padding-bottom:2rem;padding-left:2rem"><!-- wp:heading {"level":3} -->
<h3>Card Title 3</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>This is the content of the third card. You can add any content here.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->',
            'categories' => array('headless-wp-theme'),
        )
    );
}
add_action('init', 'headless_wp_theme_register_block_patterns');

/**
 * Modify block editor settings
 */
function headless_wp_theme_block_editor_settings($settings) {
    // Add custom font sizes
    $settings['fontSizes'] = array(
        array(
            'name' => __('Small', 'headless-wp-theme'),
            'size' => 14,
            'slug' => 'small'
        ),
        array(
            'name' => __('Regular', 'headless-wp-theme'),
            'size' => 16,
            'slug' => 'regular'
        ),
        array(
            'name' => __('Large', 'headless-wp-theme'),
            'size' => 20,
            'slug' => 'large'
        ),
        array(
            'name' => __('Extra Large', 'headless-wp-theme'),
            'size' => 24,
            'slug' => 'extra-large'
        ),
    );
    
    // Add custom color palette
    $settings['colors'] = array(
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
    );
    
    // Disable custom colors
    $settings['disableCustomColors'] = true;
    
    // Disable custom font sizes
    $settings['disableCustomFontSizes'] = true;
    
    return $settings;
}
add_filter('block_editor_settings_all', 'headless_wp_theme_block_editor_settings');

/**
 * Add REST API fields for blocks
 */
function headless_wp_theme_register_rest_fields() {
    // The rendered HTML is core's content.rendered; no extra field needed.

    // Add blocks field
    register_rest_field(
        array('post', 'page'),
        'blocks',
        array(
            'get_callback' => 'headless_wp_theme_get_blocks',
            'schema' => array(
                'description' => __('The blocks data for headless applications', 'headless-wp-theme'),
                'type' => 'array',
                'context' => array('view', 'edit'),
            ),
        )
    );
}
add_action('rest_api_init', 'headless_wp_theme_register_rest_fields');

/**
 * Get blocks data
 */
function headless_wp_theme_get_blocks($object, $field_name, $request) {
    // content.raw only exists in the edit context, so read the post itself,
    // and never for password-protected posts.
    $post = get_post($object['id']);
    if (!$post || post_password_required($post)) {
        return array();
    }
    return parse_blocks($post->post_content);
}