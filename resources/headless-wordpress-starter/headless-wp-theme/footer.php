    </div><!-- #content -->

    <footer id="colophon" class="site-footer">
        <div class="container">
            <?php if (is_active_sidebar('footer-widgets')) : ?>
                <div class="footer-widgets">
                    <?php dynamic_sidebar('footer-widgets'); ?>
                </div>
            <?php endif; ?>
            
            <div class="site-info">
                <div class="footer-navigation">
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer',
                        'menu_id' => 'footer-menu',
                        'container' => false,
                        'menu_class' => 'footer-nav-menu',
                        'fallback_cb' => false,
                        'depth' => 1,
                    ));
                    ?>
                </div>
                
                <div class="copyright">
                    <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. 
                    <?php _e('All rights reserved.', 'headless-wp-theme'); ?></p>
                    
                    <p class="powered-by">
                        <?php printf(__('Powered by %s', 'headless-wp-theme'), 
                            '<a href="https://wordpress.org/" target="_blank" rel="noopener">WordPress</a>'); ?>
                    </p>
                </div>
            </div>
        </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>