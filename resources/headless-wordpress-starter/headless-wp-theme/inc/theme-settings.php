<?php
/**
 * Theme Settings and Customizer Options
 *
 * @package Headless_WP_Theme
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add theme customizer options
 */
function headless_wp_theme_customize_register($wp_customize) {
    
    // Theme Options Panel
    $wp_customize->add_panel('headless_wp_theme_options', array(
        'title' => __('Theme Options', 'headless-wp-theme'),
        'description' => __('Configure your theme settings', 'headless-wp-theme'),
        'priority' => 30,
    ));
    
    // Header Section
    $wp_customize->add_section('headless_wp_theme_header', array(
        'title' => __('Header Settings', 'headless-wp-theme'),
        'panel' => 'headless_wp_theme_options',
        'priority' => 10,
    ));
    
    // Header Layout
    $wp_customize->add_setting('headless_wp_theme_header_layout', array(
        'default' => 'default',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('headless_wp_theme_header_layout', array(
        'label' => __('Header Layout', 'headless-wp-theme'),
        'section' => 'headless_wp_theme_header',
        'type' => 'select',
        'choices' => array(
            'default' => __('Default', 'headless-wp-theme'),
            'centered' => __('Centered', 'headless-wp-theme'),
            'minimal' => __('Minimal', 'headless-wp-theme'),
        ),
    ));
    
    // Show/Hide Site Description
    $wp_customize->add_setting('headless_wp_theme_show_tagline', array(
        'default' => true,
        'sanitize_callback' => 'headless_wp_theme_sanitize_checkbox',
    ));
    
    $wp_customize->add_control('headless_wp_theme_show_tagline', array(
        'label' => __('Show Site Tagline', 'headless-wp-theme'),
        'section' => 'headless_wp_theme_header',
        'type' => 'checkbox',
    ));
    
    // Footer Section
    $wp_customize->add_section('headless_wp_theme_footer', array(
        'title' => __('Footer Settings', 'headless-wp-theme'),
        'panel' => 'headless_wp_theme_options',
        'priority' => 20,
    ));
    
    // Footer Copyright Text
    $wp_customize->add_setting('headless_wp_theme_footer_text', array(
        'default' => __('All rights reserved.', 'headless-wp-theme'),
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('headless_wp_theme_footer_text', array(
        'label' => __('Footer Copyright Text', 'headless-wp-theme'),
        'section' => 'headless_wp_theme_footer',
        'type' => 'text',
    ));
    
    // Show/Hide WordPress Credit
    $wp_customize->add_setting('headless_wp_theme_show_wp_credit', array(
        'default' => true,
        'sanitize_callback' => 'headless_wp_theme_sanitize_checkbox',
    ));
    
    $wp_customize->add_control('headless_wp_theme_show_wp_credit', array(
        'label' => __('Show WordPress Credit', 'headless-wp-theme'),
        'section' => 'headless_wp_theme_footer',
        'type' => 'checkbox',
    ));
    
    // Layout Section
    $wp_customize->add_section('headless_wp_theme_layout', array(
        'title' => __('Layout Settings', 'headless-wp-theme'),
        'panel' => 'headless_wp_theme_options',
        'priority' => 30,
    ));
    
    // Container Width
    $wp_customize->add_setting('headless_wp_theme_container_width', array(
        'default' => '1200',
        'sanitize_callback' => 'absint',
    ));
    
    $wp_customize->add_control('headless_wp_theme_container_width', array(
        'label' => __('Container Width (px)', 'headless-wp-theme'),
        'section' => 'headless_wp_theme_layout',
        'type' => 'number',
        'input_attrs' => array(
            'min' => 960,
            'max' => 1920,
            'step' => 10,
        ),
    ));
    
    // Sidebar Layout
    $wp_customize->add_setting('headless_wp_theme_sidebar_position', array(
        'default' => 'right',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('headless_wp_theme_sidebar_position', array(
        'label' => __('Sidebar Position', 'headless-wp-theme'),
        'section' => 'headless_wp_theme_layout',
        'type' => 'select',
        'choices' => array(
            'left' => __('Left', 'headless-wp-theme'),
            'right' => __('Right', 'headless-wp-theme'),
            'none' => __('No Sidebar', 'headless-wp-theme'),
        ),
    ));
    
    // Typography Section
    $wp_customize->add_section('headless_wp_theme_typography', array(
        'title' => __('Typography', 'headless-wp-theme'),
        'panel' => 'headless_wp_theme_options',
        'priority' => 40,
    ));
    
    // Body Font Size
    $wp_customize->add_setting('headless_wp_theme_body_font_size', array(
        'default' => '16',
        'sanitize_callback' => 'absint',
    ));
    
    $wp_customize->add_control('headless_wp_theme_body_font_size', array(
        'label' => __('Body Font Size (px)', 'headless-wp-theme'),
        'section' => 'headless_wp_theme_typography',
        'type' => 'number',
        'input_attrs' => array(
            'min' => 12,
            'max' => 24,
            'step' => 1,
        ),
    ));
    
    // Headless Settings Section
    $wp_customize->add_section('headless_wp_theme_headless', array(
        'title' => __('Headless Settings', 'headless-wp-theme'),
        'panel' => 'headless_wp_theme_options',
        'priority' => 50,
    ));
    
    // Enable Headless Mode
    $wp_customize->add_setting('headless_wp_theme_headless_mode', array(
        'default' => false,
        'sanitize_callback' => 'headless_wp_theme_sanitize_checkbox',
    ));
    
    $wp_customize->add_control('headless_wp_theme_headless_mode', array(
        'label' => __('Enable Headless Mode', 'headless-wp-theme'),
        'description' => __('Optimize theme for headless WordPress setup', 'headless-wp-theme'),
        'section' => 'headless_wp_theme_headless',
        'type' => 'checkbox',
    ));
    
    // Frontend URL
    $wp_customize->add_setting('headless_wp_theme_frontend_url', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control('headless_wp_theme_frontend_url', array(
        'label' => __('Frontend URL', 'headless-wp-theme'),
        'description' => __('URL of your React/Next.js frontend application', 'headless-wp-theme'),
        'section' => 'headless_wp_theme_headless',
        'type' => 'url',
    ));
    
    // API Settings
    $wp_customize->add_setting('headless_wp_theme_api_prefix', array(
        'default' => 'wp-json',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('headless_wp_theme_api_prefix', array(
        'label' => __('REST API Prefix', 'headless-wp-theme'),
        'section' => 'headless_wp_theme_headless',
        'type' => 'text',
    ));
}
add_action('customize_register', 'headless_wp_theme_customize_register');

/**
 * Sanitize checkbox
 */
function headless_wp_theme_sanitize_checkbox($checked) {
    return ((isset($checked) && true == $checked) ? true : false);
}

/**
 * Generate custom CSS from customizer options
 */
function headless_wp_theme_customizer_css() {
    $container_width = absint(get_theme_mod('headless_wp_theme_container_width', '1200'));
    $body_font_size = absint(get_theme_mod('headless_wp_theme_body_font_size', '16'));
    
    $css = "
        .container {
            max-width: {$container_width}px;
        }
        
        body {
            font-size: {$body_font_size}px;
        }
    ";
    
    return $css;
}

/**
 * Enqueue customizer CSS
 */
function headless_wp_theme_customizer_styles() {
    wp_add_inline_style('headless-wp-theme-style', headless_wp_theme_customizer_css());
}
add_action('wp_enqueue_scripts', 'headless_wp_theme_customizer_styles');

/**
 * Add custom admin menu for theme options
 */
function headless_wp_theme_admin_menu() {
    add_theme_page(
        __('Theme Options', 'headless-wp-theme'),
        __('Theme Options', 'headless-wp-theme'),
        'edit_theme_options',
        'headless-wp-theme-options',
        'headless_wp_theme_options_page'
    );
}
add_action('admin_menu', 'headless_wp_theme_admin_menu');

/**
 * Theme options page
 */
function headless_wp_theme_options_page() {
    ?>
    <div class="wrap">
        <h1><?php _e('Headless WP Theme Options', 'headless-wp-theme'); ?></h1>
        
        <div class="theme-options-grid">
            <div class="theme-option-card">
                <h2><?php _e('Customizer', 'headless-wp-theme'); ?></h2>
                <p><?php _e('Use the WordPress Customizer to configure your theme settings.', 'headless-wp-theme'); ?></p>
                <a href="<?php echo esc_url(admin_url('customize.php')); ?>" class="button button-primary">
                    <?php _e('Open Customizer', 'headless-wp-theme'); ?>
                </a>
            </div>
            
            <div class="theme-option-card">
                <h2><?php _e('Documentation', 'headless-wp-theme'); ?></h2>
                <p><?php _e('Learn how to use this theme with headless WordPress setups.', 'headless-wp-theme'); ?></p>
                <a href="https://pradipta.online/resources/headless-wordpress-starter" class="button" target="_blank" rel="noopener">
                    <?php _e('View Documentation', 'headless-wp-theme'); ?>
                </a>
            </div>
            
            <div class="theme-option-card">
                <h2><?php _e('Support', 'headless-wp-theme'); ?></h2>
                <p><?php _e('Need help with your headless setup? Book a free call.', 'headless-wp-theme'); ?></p>
                <a href="https://pradipta.online/free-consultation" class="button" target="_blank" rel="noopener">
                    <?php _e('Get Support', 'headless-wp-theme'); ?>
                </a>
            </div>
        </div>
        
        <style>
            .theme-options-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .theme-option-card {
                background: #fff;
                border: 1px solid #ccd0d4;
                padding: 20px;
                border-radius: 4px;
            }
            
            .theme-option-card h2 {
                margin-top: 0;
                color: #23282d;
            }
            
            .theme-option-card p {
                color: #666;
                margin-bottom: 20px;
            }
        </style>
    </div>
    <?php
}