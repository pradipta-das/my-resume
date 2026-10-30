<?php
/**
 * The main template file
 *
 * @package Headless_WP_Theme
 * @since 1.0.0
 */

get_header(); ?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="container">
            
            <?php if (have_posts()) : ?>

                <header class="page-header">
                    <?php
                    the_archive_title('<h1 class="page-title">', '</h1>');
                    the_archive_description('<div class="archive-description">', '</div>');
                    ?>
                </header>

                <div class="posts-container">
                    <?php
                    while (have_posts()) :
                        the_post();
                        ?>
                        <article id="post-<?php the_ID(); ?>" <?php post_class('post-item'); ?>>
                            
                            <?php if (has_post_thumbnail()) : ?>
                                <div class="post-thumbnail">
                                    <a href="<?php the_permalink(); ?>">
                                        <?php the_post_thumbnail('headless-wp-theme-featured'); ?>
                                    </a>
                                </div>
                            <?php endif; ?>
                            
                            <div class="post-content">
                                <header class="entry-header">
                                    <?php
                                    if (is_singular()) :
                                        the_title('<h1 class="entry-title">', '</h1>');
                                    else :
                                        the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>');
                                    endif;
                                    ?>
                                    
                                    <?php if ('post' === get_post_type()) : ?>
                                        <div class="entry-meta">
                                            <span class="posted-on">
                                                <?php echo get_the_date(); ?>
                                            </span>
                                            <span class="byline">
                                                <?php _e('by', 'headless-wp-theme'); ?>
                                                <span class="author vcard">
                                                    <?php the_author(); ?>
                                                </span>
                                            </span>
                                            
                                            <?php if (has_category()) : ?>
                                                <span class="cat-links">
                                                    <?php _e('in', 'headless-wp-theme'); ?>
                                                    <?php the_category(', '); ?>
                                                </span>
                                            <?php endif; ?>
                                        </div>
                                    <?php endif; ?>
                                </header>

                                <div class="entry-content">
                                    <?php
                                    if (is_singular()) :
                                        the_content();
                                    else :
                                        the_excerpt();
                                    endif;
                                    ?>
                                </div>
                                
                                <?php if (!is_singular()) : ?>
                                    <footer class="entry-footer">
                                        <a href="<?php the_permalink(); ?>" class="read-more">
                                            <?php _e('Read More', 'headless-wp-theme'); ?>
                                        </a>
                                    </footer>
                                <?php endif; ?>
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
                        <h1 class="page-title"><?php _e('Nothing here', 'headless-wp-theme'); ?></h1>
                    </header>
                    
                    <div class="page-content">
                        <p><?php _e('It looks like nothing was found at this location. Maybe try a search?', 'headless-wp-theme'); ?></p>
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