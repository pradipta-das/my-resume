<?php
/**
 * The sidebar containing the main widget area
 *
 * @package Headless_WP_Theme
 * @since 1.0.0
 */

if (!is_active_sidebar('primary-sidebar')) {
    return;
}
?>

<aside id="secondary" class="widget-area">
    <div class="sidebar-inner">
        <?php dynamic_sidebar('primary-sidebar'); ?>
    </div>
</aside><!-- #secondary -->