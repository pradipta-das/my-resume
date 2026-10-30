/**
 * Main JavaScript file for Headless WP Theme
 */

(function($) {
    'use strict';

    // Initialize when document is ready
    $(document).ready(function() {
        initTheme();
    });

    /**
     * Initialize theme functionality
     */
    function initTheme() {
        initMobileMenu();
        initSmoothScroll();
        initLazyLoading();
        initAccessibility();
        initSearchForm();
        initAjaxComments();
    }

    /**
     * Mobile menu functionality
     */
    function initMobileMenu() {
        const $menuToggle = $('.menu-toggle');
        const $navigation = $('.main-navigation');
        const $menu = $('.nav-menu');

        $menuToggle.on('click', function(e) {
            e.preventDefault();
            
            const isExpanded = $(this).attr('aria-expanded') === 'true';
            
            $(this).attr('aria-expanded', !isExpanded);
            $navigation.toggleClass('toggled');
            $menu.slideToggle();
        });

        // Close mobile menu when clicking outside
        $(document).on('click', function(e) {
            if (!$navigation.is(e.target) && $navigation.has(e.target).length === 0) {
                $menuToggle.attr('aria-expanded', 'false');
                $navigation.removeClass('toggled');
                $menu.slideUp();
            }
        });

        // Close mobile menu on window resize
        $(window).on('resize', function() {
            if ($(window).width() > 768) {
                $menuToggle.attr('aria-expanded', 'false');
                $navigation.removeClass('toggled');
                $menu.removeAttr('style');
            }
        });
    }

    /**
     * Smooth scrolling for anchor links
     */
    function initSmoothScroll() {
        $('a[href*="#"]:not([href="#"])').on('click', function() {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                let target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 100
                    }, 1000);
                    return false;
                }
            }
        });
    }

    /**
     * Lazy loading for images
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Accessibility improvements
     */
    function initAccessibility() {
        // Skip link focus fix
        $('.skip-link').on('click', function() {
            const target = $(this.hash);
            if (target.length) {
                target.attr('tabindex', '-1').focus();
            }
        });

        // Focus management for dropdowns
        $('.menu-item-has-children > a').on('focus blur', function() {
            $(this).parents('.menu-item-has-children').toggleClass('focus');
        });

        // Keyboard navigation for menu
        $('.nav-menu a').on('keydown', function(e) {
            if (e.key === 'Tab') {
                const $this = $(this);
                const $parent = $this.parent();
                
                if (e.shiftKey) {
                    // Shift + Tab
                    if ($parent.is(':first-child')) {
                        $parent.parents('.menu-item-has-children').removeClass('focus');
                    }
                } else {
                    // Tab
                    if ($parent.is(':last-child')) {
                        $parent.parents('.menu-item-has-children').removeClass('focus');
                    }
                }
            }
        });
    }

    /**
     * Search form enhancements
     */
    function initSearchForm() {
        const $searchForm = $('.search-form');
        const $searchField = $searchForm.find('.search-field');
        const $searchSubmit = $searchForm.find('.search-submit');

        // Auto-expand search field on focus
        $searchField.on('focus', function() {
            $searchForm.addClass('expanded');
        });

        $searchField.on('blur', function() {
            if ($(this).val() === '') {
                $searchForm.removeClass('expanded');
            }
        });

        // Submit form on Enter key
        $searchField.on('keydown', function(e) {
            if (e.key === 'Enter') {
                $searchForm.submit();
            }
        });
    }

    /**
     * AJAX comments functionality
     */
    function initAjaxComments() {
        const $commentForm = $('#commentform');
        
        if ($commentForm.length) {
            $commentForm.on('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                formData.append('action', 'submit_comment');
                
                $.ajax({
                    url: headless_wp_theme_ajax.ajax_url,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    beforeSend: function() {
                        $commentForm.find('.comment-form-submit').prop('disabled', true);
                        $commentForm.find('.comment-respond').append('<div class="comment-loading">Submitting...</div>');
                    },
                    success: function(response) {
                        if (response.success) {
                            $commentForm[0].reset();
                            $('.comment-loading').remove();
                            
                            // Show success message
                            $commentForm.before('<div class="comment-success">Comment submitted successfully!</div>');
                            
                            // Remove success message after 3 seconds
                            setTimeout(() => {
                                $('.comment-success').fadeOut();
                            }, 3000);
                        } else {
                            $('.comment-loading').remove();
                            $commentForm.before('<div class="comment-error">' + response.data + '</div>');
                        }
                    },
                    error: function() {
                        $('.comment-loading').remove();
                        $commentForm.before('<div class="comment-error">An error occurred. Please try again.</div>');
                    },
                    complete: function() {
                        $commentForm.find('.comment-form-submit').prop('disabled', false);
                    }
                });
            });
        }
    }

    /**
     * Utility functions
     */
    window.HeadlessWPTheme = {
        /**
         * Initialize specific component
         */
        init: function(component) {
            switch(component) {
                case 'mobileMenu':
                    initMobileMenu();
                    break;
                case 'smoothScroll':
                    initSmoothScroll();
                    break;
                case 'lazyLoading':
                    initLazyLoading();
                    break;
                case 'accessibility':
                    initAccessibility();
                    break;
                case 'searchForm':
                    initSearchForm();
                    break;
                case 'ajaxComments':
                    initAjaxComments();
                    break;
                default:
                    initTheme();
            }
        },

        /**
         * API helper for headless functionality
         */
        api: {
            /**
             * Get posts
             */
            getPosts: function(params = {}) {
                return $.get(headless_wp_theme_ajax.rest_url + 'posts', params);
            },

            /**
             * Get post by slug
             */
            getPostBySlug: function(slug) {
                return $.get(headless_wp_theme_ajax.rest_url + 'headless-wp-theme/v1/posts/slug/' + slug);
            },

            /**
             * Get menus
             */
            getMenus: function() {
                return $.get(headless_wp_theme_ajax.rest_url + 'headless-wp-theme/v1/menus');
            },

            /**
             * Get site settings
             */
            getSettings: function() {
                return $.get(headless_wp_theme_ajax.rest_url + 'headless-wp-theme/v1/settings');
            }
        }
    };

})(jQuery);

/**
 * Vanilla JS utilities for better performance
 */
(function() {
    'use strict';

    /**
     * Debounce function
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * Throttle function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Scroll to top functionality
     */
    function initScrollToTop() {
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑';
        scrollButton.className = 'scroll-to-top';
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: #007cba;
            color: white;
            font-size: 20px;
            cursor: pointer;
            display: none;
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(scrollButton);

        // Show/hide button on scroll
        const toggleButton = throttle(() => {
            if (window.pageYOffset > 300) {
                scrollButton.style.display = 'block';
            } else {
                scrollButton.style.display = 'none';
            }
        }, 100);

        window.addEventListener('scroll', toggleButton);

        // Scroll to top on click
        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize scroll to top when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollToTop);
    } else {
        initScrollToTop();
    }

    // Expose utilities globally
    window.HeadlessWPThemeUtils = {
        debounce: debounce,
        throttle: throttle
    };

})();