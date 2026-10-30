<?php
/**
 * Headless WordPress Support
 *
 * @package Headless_WP_Theme
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * CORS for the front end's browser requests.
 *
 * Server-side requests (Next.js fetching pages) don't need CORS at all. Only
 * when the front end calls the API from the browser does it need these
 * headers, and only for its own origin: set the Frontend URL under
 * Appearance > Customize > Headless Settings. With no URL set, no CORS headers
 * are sent and browsers on other sites can't read the API. WordPress itself
 * answers preflight (OPTIONS) requests for REST routes.
 */
function headless_wp_theme_rest_cors( $served ) {
    $frontend_url = untrailingslashit( (string) get_theme_mod( 'headless_wp_theme_frontend_url', '' ) );
    $origin       = get_http_origin();

    if ( $frontend_url && $origin && strcasecmp( untrailingslashit( $origin ), $frontend_url ) === 0 ) {
        header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $frontend_url ) );
        header( 'Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce' );
        header( 'Access-Control-Allow-Credentials: true' );
        header( 'Vary: Origin', false );
    }

    return $served;
}
add_action( 'rest_api_init', function () {
    // Replace core's permissive CORS headers with the ones above.
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
    add_filter( 'rest_pre_serve_request', 'headless_wp_theme_rest_cors' );
}, 15 );

/**
 * Add custom REST API endpoints for headless
 */
function headless_wp_theme_register_rest_endpoints() {
    // Get navigation menus
    register_rest_route('headless-wp-theme/v1', '/menus', array(
        'methods' => 'GET',
        'callback' => 'headless_wp_theme_get_menus',
        'permission_callback' => '__return_true',
    ));
    
    // Get specific menu
    register_rest_route('headless-wp-theme/v1', '/menus/(?P<location>[a-zA-Z0-9_-]+)', array(
        'methods' => 'GET',
        'callback' => 'headless_wp_theme_get_menu',
        'permission_callback' => '__return_true',
    ));
    
    // Get site settings
    register_rest_route('headless-wp-theme/v1', '/settings', array(
        'methods' => 'GET',
        'callback' => 'headless_wp_theme_get_settings',
        'permission_callback' => '__return_true',
    ));
    
    // Get theme customizer settings
    register_rest_route('headless-wp-theme/v1', '/customizer', array(
        'methods' => 'GET',
        'callback' => 'headless_wp_theme_get_customizer_settings',
        'permission_callback' => '__return_true',
    ));
    
    // Get post by slug
    register_rest_route('headless-wp-theme/v1', '/posts/slug/(?P<slug>[a-zA-Z0-9_-]+)', array(
        'methods' => 'GET',
        'callback' => 'headless_wp_theme_get_post_by_slug',
        'permission_callback' => '__return_true',
    ));
    
    // Get page by slug
    register_rest_route('headless-wp-theme/v1', '/pages/slug/(?P<slug>[a-zA-Z0-9_-]+)', array(
        'methods' => 'GET',
        'callback' => 'headless_wp_theme_get_page_by_slug',
        'permission_callback' => '__return_true',
    ));
    
    // Get all posts with pagination
    register_rest_route('headless-wp-theme/v1', '/posts/all', array(
        'methods' => 'GET',
        'callback' => 'headless_wp_theme_get_all_posts',
        'permission_callback' => '__return_true',
    ));
    
    // Get categories with posts count
    register_rest_route('headless-wp-theme/v1', '/categories/with-count', array(
        'methods' => 'GET',
        'callback' => 'headless_wp_theme_get_categories_with_count',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'headless_wp_theme_register_rest_endpoints');

/**
 * Get navigation menus
 */
function headless_wp_theme_get_menus($request) {
    $menu_locations = get_nav_menu_locations();
    $menus = array();
    
    foreach ($menu_locations as $location => $menu_id) {
        $menu = wp_get_nav_menu_object($menu_id);
        if ($menu) {
            $menus[$location] = array(
                'name' => $menu->name,
                'items' => headless_wp_theme_get_menu_items($menu_id),
            );
        }
    }
    
    return rest_ensure_response($menus);
}

/**
 * Get specific menu
 */
function headless_wp_theme_get_menu($request) {
    $location = $request->get_param('location');
    $menu_locations = get_nav_menu_locations();
    
    if (!isset($menu_locations[$location])) {
        return new WP_Error('menu_not_found', 'Menu not found', array('status' => 404));
    }
    
    $menu_id = $menu_locations[$location];
    $menu = wp_get_nav_menu_object($menu_id);
    
    if (!$menu) {
        return new WP_Error('menu_not_found', 'Menu not found', array('status' => 404));
    }
    
    return rest_ensure_response(array(
        'name' => $menu->name,
        'items' => headless_wp_theme_get_menu_items($menu_id),
    ));
}

/**
 * Get menu items
 */
function headless_wp_theme_get_menu_items($menu_id) {
    $menu_items = wp_get_nav_menu_items($menu_id);
    $items = array();
    
    if ($menu_items) {
        foreach ($menu_items as $item) {
            $items[] = array(
                'id' => $item->ID,
                'title' => $item->title,
                'url' => $item->url,
                'target' => $item->target,
                'parent' => $item->menu_item_parent,
                'order' => $item->menu_order,
                'classes' => $item->classes,
            );
        }
    }
    
    return $items;
}

/**
 * Get site settings
 */
function headless_wp_theme_get_settings($request) {
    $settings = array(
        'site_title' => get_bloginfo('name'),
        'site_description' => get_bloginfo('description'),
        'site_url' => home_url(),
        'date_format' => get_option('date_format'),
        'time_format' => get_option('time_format'),
        'start_of_week' => get_option('start_of_week'),
        'language' => get_locale(),
        'timezone' => get_option('timezone_string'),
        'posts_per_page' => get_option('posts_per_page'),
        'default_category' => get_option('default_category'),
        'default_comment_status' => get_option('default_comment_status'),
        'default_ping_status' => get_option('default_ping_status'),
    );
    
    // Add custom logo if available
    if (has_custom_logo()) {
        $custom_logo_id = get_theme_mod('custom_logo');
        $settings['custom_logo'] = wp_get_attachment_url($custom_logo_id);
    }
    
    return rest_ensure_response($settings);
}

/**
 * Get customizer settings
 */
function headless_wp_theme_get_customizer_settings($request) {
    $settings = array(
        'header_layout' => get_theme_mod('headless_wp_theme_header_layout', 'default'),
        'show_tagline' => get_theme_mod('headless_wp_theme_show_tagline', true),
        'footer_text' => get_theme_mod('headless_wp_theme_footer_text', 'All rights reserved.'),
        'show_wp_credit' => get_theme_mod('headless_wp_theme_show_wp_credit', true),
        'container_width' => get_theme_mod('headless_wp_theme_container_width', '1200'),
        'sidebar_position' => get_theme_mod('headless_wp_theme_sidebar_position', 'right'),
        'body_font_size' => get_theme_mod('headless_wp_theme_body_font_size', '16'),
        'headless_mode' => get_theme_mod('headless_wp_theme_headless_mode', false),
        'frontend_url' => get_theme_mod('headless_wp_theme_frontend_url', ''),
        'api_prefix' => get_theme_mod('headless_wp_theme_api_prefix', 'wp-json'),
    );
    
    return rest_ensure_response($settings);
}

/**
 * Get post by slug
 */
function headless_wp_theme_get_post_by_slug($request) {
    $slug = $request->get_param('slug');
    $post = get_page_by_path($slug, OBJECT, 'post');
    
    if (!$post) {
        return new WP_Error('post_not_found', 'Post not found', array('status' => 404));
    }
    
    $rest_request = new WP_REST_Request('GET', '/wp/v2/posts/' . $post->ID);
    $rest_response = rest_do_request($rest_request);
    
    return $rest_response;
}

/**
 * Get page by slug
 */
function headless_wp_theme_get_page_by_slug($request) {
    $slug = $request->get_param('slug');
    $page = get_page_by_path($slug);
    
    if (!$page) {
        return new WP_Error('page_not_found', 'Page not found', array('status' => 404));
    }
    
    $rest_request = new WP_REST_Request('GET', '/wp/v2/pages/' . $page->ID);
    $rest_response = rest_do_request($rest_request);
    
    return $rest_response;
}

/**
 * Get all posts with enhanced data
 */
function headless_wp_theme_get_all_posts($request) {
    // Whole numbers only, and at most 100 posts a request, like core's endpoints.
    $page = max(1, (int) $request->get_param('page'));
    $per_page = absint($request->get_param('per_page'));
    $per_page = $per_page ? min(100, $per_page) : 10;
    $category = sanitize_title((string) $request->get_param('category'));
    $tag = sanitize_title((string) $request->get_param('tag'));
    $search = sanitize_text_field((string) $request->get_param('search'));
    
    $args = array(
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => $per_page,
        'paged' => $page,
    );
    
    if ($category) {
        $args['category_name'] = $category;
    }
    
    if ($tag) {
        $args['tag'] = $tag;
    }
    
    if ($search) {
        $args['s'] = $search;
    }
    
    $query = new WP_Query($args);
    $posts = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $posts[] = array(
                'id' => get_the_ID(),
                'title' => get_the_title(),
                'slug' => get_post_field('post_name'),
                'content' => post_password_required() ? '' : apply_filters('the_content', get_the_content()),
                'excerpt' => get_the_excerpt(),
                'date' => get_the_date('c'),
                'modified' => get_the_modified_date('c'),
                'author' => array(
                    'name' => get_the_author(),
                    'id' => get_the_author_meta('ID'),
                ),
                'categories' => wp_get_post_categories(get_the_ID(), array('fields' => 'all')),
                'tags' => wp_get_post_tags(get_the_ID(), array('fields' => 'all')),
                'featured_image' => has_post_thumbnail() ? wp_get_attachment_url(get_post_thumbnail_id()) : null,
                'comment_count' => get_comments_number(),
                'comment_status' => get_post_field('comment_status'),
            );
        }
    }
    
    wp_reset_postdata();
    
    return rest_ensure_response(array(
        'posts' => $posts,
        'pagination' => array(
            'current_page' => $page,
            'total_pages' => $query->max_num_pages,
            'total_posts' => $query->found_posts,
            'per_page' => $per_page,
        ),
    ));
}

/**
 * Get categories with posts count
 */
function headless_wp_theme_get_categories_with_count($request) {
    $categories = get_categories(array(
        'hide_empty' => false,
    ));
    
    $category_data = array();
    foreach ($categories as $category) {
        $category_data[] = array(
            'id' => $category->term_id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'count' => $category->count,
            'parent' => $category->parent,
        );
    }
    
    return rest_ensure_response($category_data);
}

/**
 * Add featured image URL to REST API responses
 */
function headless_wp_theme_add_featured_image_to_rest() {
    register_rest_field(
        array('post', 'page'),
        'featured_image_url',
        array(
            'get_callback' => 'headless_wp_theme_get_featured_image_url_rest',
            'schema' => array(
                'description' => __('Featured image URL', 'headless-wp-theme'),
                'type' => 'string',
                'context' => array('view', 'edit'),
            ),
        )
    );
    
    register_rest_field(
        array('post', 'page'),
        'author_info',
        array(
            'get_callback' => 'headless_wp_theme_get_author_info_rest',
            'schema' => array(
                'description' => __('Author information', 'headless-wp-theme'),
                'type' => 'object',
                'context' => array('view', 'edit'),
            ),
        )
    );
}
add_action('rest_api_init', 'headless_wp_theme_add_featured_image_to_rest');

/**
 * Get featured image URL for REST API
 */
function headless_wp_theme_get_featured_image_url_rest($object, $field_name, $request) {
    if (has_post_thumbnail($object['id'])) {
        return wp_get_attachment_url(get_post_thumbnail_id($object['id']));
    }
    return null;
}

/**
 * Get author info for REST API
 */
function headless_wp_theme_get_author_info_rest($object, $field_name, $request) {
    $author_id = $object['author'];
    return array(
        'id' => $author_id,
        'name' => get_the_author_meta('display_name', $author_id),
        'url' => get_the_author_meta('url', $author_id),
        'description' => get_the_author_meta('description', $author_id),
        'avatar' => get_avatar_url($author_id),
    );
}

/**
 * Disable WordPress admin bar for headless mode
 */
function headless_wp_theme_disable_admin_bar() {
    if (get_theme_mod('headless_wp_theme_headless_mode', false)) {
        show_admin_bar(false);
    }
}
add_action('after_setup_theme', 'headless_wp_theme_disable_admin_bar');

/**
 * Redirect to frontend URL if in headless mode
 */
function headless_wp_theme_redirect_to_frontend() {
    if (get_theme_mod('headless_wp_theme_headless_mode', false) && !is_admin() && !is_feed() && !wp_doing_ajax()) {
        $frontend_url = get_theme_mod('headless_wp_theme_frontend_url', '');
        if (!empty($frontend_url)) {
            wp_redirect($frontend_url);
            exit;
        }
    }
}
add_action('template_redirect', 'headless_wp_theme_redirect_to_frontend');

/**
 * Add JWT authentication support
 */
function headless_wp_theme_jwt_auth_expire($expire, $user_id) {
    return time() + (7 * DAY_IN_SECONDS); // 7 days
}
add_filter('jwt_auth_expire', 'headless_wp_theme_jwt_auth_expire', 10, 2);

/**
 * Add custom meta fields to REST API
 */
function headless_wp_theme_add_meta_to_rest() {
    register_rest_field(
        array('post', 'page'),
        'meta_fields',
        array(
            'get_callback' => 'headless_wp_theme_get_meta_fields',
            'schema' => array(
                'description' => __('Custom meta fields', 'headless-wp-theme'),
                'type' => 'object',
                'context' => array('view', 'edit'),
            ),
        )
    );
}
add_action('rest_api_init', 'headless_wp_theme_add_meta_to_rest');

/**
 * Get meta fields for REST API
 *
 * Only the keys you list are published, since post meta often holds plugin
 * data that was never meant to be public. Add keys with the filter, e.g.:
 *
 *     add_filter( 'headless_wp_theme_rest_meta_keys', fn () => array( 'subtitle', 'reading_time' ) );
 *
 * (Meta registered with register_post_meta( ..., array( 'show_in_rest' => true ) )
 * is already available in the core `meta` field.)
 */
function headless_wp_theme_get_meta_fields($object, $field_name, $request) {
    $keys = (array) apply_filters('headless_wp_theme_rest_meta_keys', array());
    $filtered_meta = array();

    if (empty($object['id']) || post_password_required($object['id'])) {
        return $filtered_meta;
    }

    foreach ($keys as $key) {
        if (metadata_exists('post', $object['id'], $key)) {
            $filtered_meta[$key] = get_post_meta($object['id'], $key, true);
        }
    }

    return $filtered_meta;
}

/**
 * Tell the front end when content changes, so it refreshes straight away
 * instead of waiting for its cache to expire. Off until both constants are
 * set in wp-config.php:
 *
 *     define( 'HEADLESS_REVALIDATE_URL', 'https://your-site.com/api/revalidate' );
 *     define( 'HEADLESS_REVALIDATE_SECRET', 'a-long-random-string' ); // = REVALIDATE_SECRET in Next.js
 *
 * The request is sent in the background, so saving in the editor never waits
 * for it.
 */
function headless_wp_theme_notify_frontend( $payload ) {
    if ( ! defined( 'HEADLESS_REVALIDATE_URL' ) || ! defined( 'HEADLESS_REVALIDATE_SECRET' ) || '' === HEADLESS_REVALIDATE_SECRET ) {
        return;
    }

    wp_remote_post(
        HEADLESS_REVALIDATE_URL,
        array(
            'blocking' => false,
            'timeout'  => 3,
            'headers'  => array(
                'Content-Type'        => 'application/json',
                'X-Revalidate-Secret' => HEADLESS_REVALIDATE_SECRET,
            ),
            'body'     => wp_json_encode( $payload ),
        )
    );
}

// Published content was saved, published, or unpublished.
add_action( 'wp_after_insert_post', function ( $post_id, $post, $update, $post_before ) {
    if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) || ! is_post_type_viewable( $post->post_type ) ) {
        return;
    }
    $was_public = $post_before && 'publish' === $post_before->post_status;
    if ( 'publish' !== $post->post_status && ! $was_public ) {
        return; // Drafts and private posts never reached the front end.
    }

    headless_wp_theme_notify_frontend( array(
        'type' => $post->post_type,
        'id'   => $post_id,
        'slug' => $post->post_name,
    ) );
}, 10, 4 );

add_action( 'trashed_post', function ( $post_id ) {
    $post = get_post( $post_id );
    if ( $post && is_post_type_viewable( $post->post_type ) ) {
        headless_wp_theme_notify_frontend( array( 'type' => $post->post_type, 'id' => $post_id, 'slug' => $post->post_name ) );
    }
} );

add_action( 'wp_update_nav_menu', function ( $menu_id ) {
    headless_wp_theme_notify_frontend( array( 'type' => 'menu', 'id' => $menu_id ) );
} );
