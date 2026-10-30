<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @package Headless_WP_Theme
 * @since 1.0.0
 */

get_header(); ?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="container">
            
            <section class="error-404 not-found">
                <header class="page-header">
                    <h1 class="page-title"><?php _e('404 - Page Not Found', 'headless-wp-theme'); ?></h1>
                </header>
                
                <div class="page-content">
                    <p><?php _e('It looks like nothing was found at this location. Maybe try one of the links below or a search?', 'headless-wp-theme'); ?></p>
                    
                    <div class="error-404-content">
                        <div class="widget-area">
                            <div class="widget widget_search">
                                <h2 class="widget-title"><?php _e('Search', 'headless-wp-theme'); ?></h2>
                                <?php get_search_form(); ?>
                            </div>
                            
                            <div class="widget">
                                <h2 class="widget-title"><?php _e('Recent Posts', 'headless-wp-theme'); ?></h2>
                                <ul>
                                    <?php
                                    wp_list_pages(array(
                                        'title_li' => '',
                                        'number' => 5,
                                        'sort_order' => 'DESC',
                                        'sort_column' => 'post_date',
                                    ));
                                    ?>
                                </ul>
                            </div>
                            
                            <div class="widget">
                                <h2 class="widget-title"><?php _e('Categories', 'headless-wp-theme'); ?></h2>
                                <ul>
                                    <?php
                                    wp_list_categories(array(
                                        'orderby' => 'count',
                                        'order' => 'DESC',
                                        'show_count' => 1,
                                        'title_li' => '',
                                        'number' => 10,
                                    ));
                                    ?>
                                </ul>
                            </div>
                            
                            <div class="widget">
                                <h2 class="widget-title"><?php _e('Archives', 'headless-wp-theme'); ?></h2>
                                <ul>
                                    <?php
                                    wp_get_archives(array(
                                        'type' => 'monthly',
                                        'limit' => 12,
                                    ));
                                    ?>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
        </div>
    </main>
</div>

<?php
get_footer();
?>