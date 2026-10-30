/**
 * Block Editor JavaScript for Headless WP Theme
 */

(function() {
    'use strict';

    // Wait for WordPress to be ready
    wp.domReady(function() {
        // Remove unwanted block styles
        wp.blocks.unregisterBlockStyle('core/button', 'squared');
        wp.blocks.unregisterBlockStyle('core/image', 'rounded');
        
        // Add custom block styles
        wp.blocks.registerBlockStyle('core/button', {
            name: 'rounded',
            label: 'Rounded',
            isDefault: false
        });
        
        wp.blocks.registerBlockStyle('core/image', {
            name: 'bordered',
            label: 'Bordered',
            isDefault: false
        });
        
        // Modify block categories
        wp.blocks.updateCategory('headless-wp-theme', {
            icon: 'wordpress-alt'
        });
    });

    // Add custom block variations
    wp.blocks.registerBlockVariation('core/group', {
        name: 'headless-wp-theme-card',
        title: 'Card',
        description: 'A card layout with padding and border',
        icon: 'admin-post',
        category: 'headless-wp-theme',
        attributes: {
            className: 'is-style-card'
        },
        innerBlocks: [
            ['core/heading', { level: 3, placeholder: 'Card Title' }],
            ['core/paragraph', { placeholder: 'Card content goes here...' }],
            ['core/button', { text: 'Learn More' }]
        ],
        scope: ['inserter']
    });

    // Add custom block variation for hero section
    wp.blocks.registerBlockVariation('core/group', {
        name: 'headless-wp-theme-hero',
        title: 'Hero Section',
        description: 'A hero section with background and call-to-action',
        icon: 'cover-image',
        category: 'headless-wp-theme',
        attributes: {
            align: 'full',
            backgroundColor: 'primary',
            textColor: 'white',
            style: {
                spacing: {
                    padding: {
                        top: '4rem',
                        bottom: '4rem'
                    }
                }
            }
        },
        innerBlocks: [
            ['core/heading', { 
                level: 1, 
                placeholder: 'Hero Title',
                textAlign: 'center',
                fontSize: 'xx-large'
            }],
            ['core/paragraph', { 
                placeholder: 'Hero subtitle or description',
                align: 'center',
                fontSize: 'large'
            }],
            ['core/buttons', {
                layout: {
                    type: 'flex',
                    justifyContent: 'center'
                }
            }, [
                ['core/button', {
                    text: 'Get Started',
                    backgroundColor: 'white',
                    textColor: 'primary'
                }]
            ]]
        ],
        scope: ['inserter']
    });

    // Custom block editor modifications
    wp.data.subscribe(function() {
        const editPost = wp.data.select('core/edit-post');
        const editor = wp.data.select('core/editor');
        
        // Auto-save functionality
        if (editPost && editor) {
            const isAutosavingPost = editor.isAutosavingPost();
            const isSavingPost = editor.isSavingPost();
            
            if (isAutosavingPost || isSavingPost) {
                console.log('Saving post...');
            }
        }
    });

})();

/**
 * Custom block for headless features
 */
(function() {
    'use strict';

    const { registerBlockType } = wp.blocks;
    const { RichText, InspectorControls, ColorPalette } = wp.blockEditor;
    const { PanelBody, TextControl, ToggleControl } = wp.components;
    const { __ } = wp.i18n;

    // Register custom API block
    registerBlockType('headless-wp-theme/api-block', {
        title: __('API Content Block', 'headless-wp-theme'),
        description: __('A block that displays content from an API endpoint', 'headless-wp-theme'),
        icon: 'rest-api',
        category: 'headless-wp-theme',
        attributes: {
            apiUrl: {
                type: 'string',
                default: ''
            },
            displayTitle: {
                type: 'boolean',
                default: true
            },
            backgroundColor: {
                type: 'string',
                default: ''
            },
            textColor: {
                type: 'string',
                default: ''
            }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { apiUrl, displayTitle, backgroundColor, textColor } = attributes;

            return wp.element.createElement(
                'div',
                {
                    className: 'wp-block-headless-wp-theme-api-block',
                    style: {
                        backgroundColor: backgroundColor,
                        color: textColor,
                        padding: '1rem',
                        border: '1px dashed #ccc'
                    }
                },
                [
                    wp.element.createElement(
                        InspectorControls,
                        { key: 'inspector' },
                        wp.element.createElement(
                            PanelBody,
                            { title: __('API Settings', 'headless-wp-theme') },
                            wp.element.createElement(TextControl, {
                                label: __('API URL', 'headless-wp-theme'),
                                value: apiUrl,
                                onChange: function(value) {
                                    setAttributes({ apiUrl: value });
                                }
                            }),
                            wp.element.createElement(ToggleControl, {
                                label: __('Display Title', 'headless-wp-theme'),
                                checked: displayTitle,
                                onChange: function(value) {
                                    setAttributes({ displayTitle: value });
                                }
                            })
                        ),
                        wp.element.createElement(
                            PanelBody,
                            { title: __('Colors', 'headless-wp-theme') },
                            wp.element.createElement(
                                'p',
                                null,
                                __('Background Color', 'headless-wp-theme')
                            ),
                            wp.element.createElement(ColorPalette, {
                                value: backgroundColor,
                                onChange: function(value) {
                                    setAttributes({ backgroundColor: value });
                                }
                            }),
                            wp.element.createElement(
                                'p',
                                null,
                                __('Text Color', 'headless-wp-theme')
                            ),
                            wp.element.createElement(ColorPalette, {
                                value: textColor,
                                onChange: function(value) {
                                    setAttributes({ textColor: value });
                                }
                            })
                        )
                    ),
                    wp.element.createElement(
                        'div',
                        { key: 'content' },
                        wp.element.createElement(
                            'h3',
                            null,
                            __('API Content Block', 'headless-wp-theme')
                        ),
                        wp.element.createElement(
                            'p',
                            null,
                            apiUrl ? 
                                __('API URL: ', 'headless-wp-theme') + apiUrl :
                                __('Please set an API URL in the block settings', 'headless-wp-theme')
                        ),
                        wp.element.createElement(
                            'p',
                            null,
                            __('This block will display content from the specified API endpoint on the frontend.', 'headless-wp-theme')
                        )
                    )
                ]
            );
        },
        save: function(props) {
            const { attributes } = props;
            const { apiUrl, displayTitle, backgroundColor, textColor } = attributes;

            return wp.element.createElement(
                'div',
                {
                    className: 'wp-block-headless-wp-theme-api-block',
                    'data-api-url': apiUrl,
                    'data-display-title': displayTitle,
                    style: {
                        backgroundColor: backgroundColor,
                        color: textColor
                    }
                },
                wp.element.createElement(
                    'div',
                    { className: 'api-content-placeholder' },
                    __('Loading content from API...', 'headless-wp-theme')
                )
            );
        }
    });

})();