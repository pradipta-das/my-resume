<?php
/**
 * The template for displaying single posts
 *
 * @package Headless_WP_Theme
 * @since 1.0.0
 */

get_header(); ?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="container">
            
            <?php while (have_posts()) : the_post(); ?>

                <article id="post-<?php the_ID(); ?>" <?php post_class('single-post'); ?>>
                    
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="post-thumbnail">
                            <?php the_post_thumbnail('headless-wp-theme-large'); ?>
                        </div>
                    <?php endif; ?>
                    
                    <header class="entry-header">
                        <?php the_title('<h1 class="entry-title">', '</h1>'); ?>
                        
                        <div class="entry-meta">
                            <span class="posted-on">
                                <time class="entry-date published" datetime="<?php echo get_the_date('c'); ?>">
                                    <?php echo get_the_date(); ?>
                                </time>
                            </span>
                            
                            <span class="byline">
                                <?php _e('by', 'headless-wp-theme'); ?>
                                <span class="author vcard">
                                    <a class="url fn n" href="<?php echo esc_url(get_author_posts_url(get_the_author_meta('ID'))); ?>">
                                        <?php echo get_the_author(); ?>
                                    </a>
                                </span>
                            </span>
                            
                            <?php if (has_category()) : ?>
                                <span class="cat-links">
                                    <?php _e('in', 'headless-wp-theme'); ?>
                                    <?php the_category(', '); ?>
                                </span>
                            <?php endif; ?>
                            
                            <?php if (has_tag()) : ?>
                                <span class="tags-links">
                                    <?php the_tags('', ', ', ''); ?>
                                </span>
                            <?php endif; ?>
                        </div>
                    </header>

                    <div class="entry-content">
                        <?php the_content(); ?>
                        
                        <?php
                        wp_link_pages(array(
                            'before' => '<div class="page-links">' . __('Pages:', 'headless-wp-theme'),
                            'after' => '</div>',
                        ));
                        ?>
                    </div>

                    <footer class="entry-footer">
                        <?php
                        // Post navigation
                        the_post_navigation(array(
                            'prev_text' => '<span class="nav-subtitle">' . __('Previous:', 'headless-wp-theme') . '</span> <span class="nav-title">%title</span>',
                            'next_text' => '<span class="nav-subtitle">' . __('Next:', 'headless-wp-theme') . '</span> <span class="nav-title">%title</span>',
                        ));
                        ?>
                    </footer>
                </article>

                <?php
                // Author bio
                if (get_the_author_meta('description')) :
                    ?>
                    <div class="author-info">
                        <div class="author-avatar">
                            <?php echo get_avatar(get_the_author_meta('user_email'), 96); ?>
                        </div>
                        <div class="author-description">
                            <h3 class="author-title">
                                <?php printf(__('About %s', 'headless-wp-theme'), get_the_author()); ?>
                            </h3>
                            <p class="author-bio">
                                <?php the_author_meta('description'); ?>
                            </p>
                        </div>
                    </div>
                <?php endif; ?>

                <?php
                // Related posts
                $related_posts = get_posts(array(
                    'category__in' => wp_get_post_categories($post->ID),
                    'numberposts' => 3,
                    'post__not_in' => array($post->ID),
                ));
                
                if ($related_posts) : ?>
                    <div class="related-posts">
                        <h3><?php _e('Related Posts', 'headless-wp-theme'); ?></h3>
                        <div class="related-posts-grid">
                            <?php foreach ($related_posts as $related_post) : ?>
                                <div class="related-post-item">
                                    <?php if (has_post_thumbnail($related_post->ID)) : ?>
                                        <div class="related-post-thumbnail">
                                            <a href="<?php echo get_permalink($related_post->ID); ?>">
                                                <?php echo get_the_post_thumbnail($related_post->ID, 'headless-wp-theme-thumbnail'); ?>
                                            </a>
                                        </div>
                                    <?php endif; ?>
                                    <div class="related-post-content">
                                        <h4 class="related-post-title">
                                            <a href="<?php echo get_permalink($related_post->ID); ?>">
                                                <?php echo get_the_title($related_post->ID); ?>
                                            </a>
                                        </h4>
                                        <p class="related-post-excerpt">
                                            <?php echo wp_trim_words(get_the_excerpt($related_post->ID), 15); ?>
                                        </p>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>

                <?php
                // Comments
                if (comments_open() || get_comments_number()) :
                    comments_template();
                endif;
                ?>

            <?php endwhile; ?>
            
        </div>
    </main>
</div>

<?php
get_sidebar();
get_footer();
?>