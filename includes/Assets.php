<?php
namespace WPMapBlock;

class Assets
{
    public static function init()
    {
        $self = new self();
        add_action('wp_enqueue_scripts', [$self, 'wpmapblock_plugin_core_scripts']);
        add_action('init', [$self, 'register_block_assets']);
    }
    public function wpmapblock_plugin_core_scripts()
    {
        wp_enqueue_script('wpmapblock-leaflet', plugins_url('assets/js/leaflet.js', dirname(__FILE__)), array('jquery'), null, true);
        wp_enqueue_script('wpmapblock-leaflet-fullscreen', plugins_url('assets/js/Control.FullScreen.js', dirname(__FILE__)), array('jquery'), null, true);
    }
    public function register_block_assets()
    {
        $frontend_dependencies = include_once WPMAPBLOCK_ASSETS_DIR_PATH . 'dist/wpmapblock-frontend.core.min.asset.php';
        wp_register_style(
            'wp-map-block-stylesheets',
            WPMAPBLOCK_ASSETS_URI . 'css/wpmapblock-frontend.css',
            is_admin() ? array('wp-editor') : null,
            $frontend_dependencies['version']
        );
        // Register block script for frontend.
        wp_register_script(
            'wp-map-block-frontend-js', // Handle.
            WPMAPBLOCK_ASSETS_URI . 'dist/wpmapblock-frontend.core.min.js',
            array_merge(array('jquery'), $frontend_dependencies['dependencies']),
            $frontend_dependencies['version'],
            true
        );

        $backend_dependencies = include_once WPMAPBLOCK_ASSETS_DIR_PATH . 'dist/wpmapblock.core.min.asset.php';
        // Register block editor styles for backend.
        wp_register_style(
            'wp-map-block-editor-css',
            WPMAPBLOCK_ASSETS_URI . 'css/wpmapblock-editor.css',
            array('wp-edit-blocks'),
            $backend_dependencies['version']
        );

        // Register block editor script for backend.
        wp_register_script(
            'wp-map-block-js', // Handle.
            WPMAPBLOCK_ASSETS_URI . 'dist/wpmapblock.core.min.js',
            $backend_dependencies['dependencies'],
            $backend_dependencies['version'],
            true
        );

        // WP Localized globals. Use dynamic PHP stuff in JavaScript via `wpmapblockGlobal` object.
        wp_localize_script(
            'wp-map-block-js',
            'wpmapblockGlobal', // Array containing dynamic data for a JS Global.
            [
                'pluginDirPath' => plugin_dir_path(__DIR__),
                'pluginDirUrl'  => plugin_dir_url(__DIR__),
                // Add more data here that you want to access from `wpmapblockGlobal` object.
            ]
        );
    }
}
