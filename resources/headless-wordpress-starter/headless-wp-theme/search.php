<?php
/**
 * The template for displaying search results pages
 *
 * @package Headless_WP_Theme
 * @since 1.0.0
 */

get_header(); ?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="container">
            
            <header class="page-header">
                <h1 class="page-title">
                    <?php
                    printf(
                        esc_html__('Search Results for: %s', 'headless-wp-theme'),
                        '<span>' . get_search_query() . '</span>'
                    );
                    ?>
                </h1>
            </header>

            <?php if (have_posts()) : ?>

                <div class="search-results">
                    <?php
                    while (have_posts()) :
                        the_post();
                        ?>
                        <article id="post-<?php the_ID(); ?>" <?php post_class('search-result-item'); ?>>
                            
                            <?php if (has_post_thumbnail()) : ?>
                                <div class="post-thumbnail">
                                    <a href="<?php the_permalink(); ?>">
                                        <?php the_post_thumbnail('headless-wp-theme-thumbnail'); ?>
                                    </a>
                                </div>
                            <?php endif; ?>
                            
                            <div class="post-content">
                                <header class="entry-header">
                                    <?php the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>'); ?>
                                    
                                    <div class="entry-meta">
                                        <span class="post-type">
                                            <?php echo get_post_type(); ?>
                                        </span>
                                        <span class="posted-on">
                                            <?php echo get_the_date(); ?>
                                        </span>
                                    </div>
                                </header>

                                <div class="entry-summary">
                                    <?php the_excerpt(); ?>
                                </div>
                                
                                <footer class="entry-footer">
                                    <a href="<?php the_permalink(); ?>" class="read-more">
                                        <?php _e('Read More', 'headless-wp-theme'); ?>
                                    </a>
                                </footer>
                            </div>
                        </article>
                        <?php
                    endwhile;
                    ?>
                </div>

                <?php
                // Pagination
                the_posts_pagination(array(
                    'prev_text' => __('Previous', 'headless-wp-theme'),
                    'next_text' => __('Next', 'headless-wp-theme'),
                ));
                ?>

            <?php else : ?>

                <section class="no-results not-found">
                    <header class="page-header">
                        <h1 class="page-title"><?php _e('Nothing found', 'headless-wp-theme'); ?></h1>
                    </header>
                    
                    <div class="page-content">
                        <p><?php _e('Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'headless-wp-theme'); ?></p>
                        <?php get_search_form(); ?>
                    </div>
                </section>

            <?php endif; ?>
            
        </div>
    </main>
</div>

<?php
get_sidebar();
get_footer();
?>