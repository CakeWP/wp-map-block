<?php

/**
 * Plugin Name: WP Map Block
 * Plugin URI: http://itushar.me/wp-map-block
 * Description: Gutenberg Map Block for Google Map and OpenStreet Map build with LeafletJS
 * Author: tusharimran
 * Author URI: http://itushar.me
 * Version: 1.1.6
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('WPMapBlock')) {
    final class WPMapBlock
    {
        private static $instances = [];
        protected function __construct()
        {
            $this->define_constant();
            $this->load_dependency();
            add_action('init', [$this, 'init_plugin']);
        }
        public function define_constant()
        {
            /**
             * Defines CONSTANTS for Whole plugins.
             */
            define('WPMAPBLOCK_VERSION', '1.1.6');
            define('WPMAPBLOCK_PLUGIN_FILE', __FILE__);
            define('WPMAPBLOCK_PLUGIN_BASENAME', plugin_basename(__FILE__));
            define('WPMAPBLOCK_PLUGIN_SLUG', 'wp-map-block');
            define('WPMAPBLOCK_PLUGIN_ROOT_URI', plugins_url('/', __FILE__));
            define('WPMAPBLOCK_ROOT_DIR_PATH', plugin_dir_path(__FILE__));
            define('WPMAPBLOCK_ASSETS_DIR_PATH', WPMAPBLOCK_ROOT_DIR_PATH . 'assets/');
            define('WPMAPBLOCK_ASSETS_URI', WPMAPBLOCK_PLUGIN_ROOT_URI . 'assets/');
        }

        public function load_dependency()
        {

            /**
             * Block Initializer.
             */
            require_once WPMAPBLOCK_ROOT_DIR_PATH . 'includes/Init.php';
        }

    
        public function init_plugin()
        {
            $this->load_textdomain();
        }


        public function load_textdomain()
        {
            load_plugin_textdomain('wp-map-block', false, dirname(WPMAPBLOCK_PLUGIN_BASENAME) . '/languages');
        }




        protected function __clone()
        {
        }
        public function __wakeup()
        {
            throw new \Exception("Cannot unserialize singleton");
        }
        public static function getInstance()
        {
            $subclass = static::class;
            if (!isset(self::$instances[$subclass])) {
                self::$instances[$subclass] = new static();
            }
            return self::$instances[$subclass];
        }
    }
}

/**
 * Initializes the main plugin
 *
 * @return \WPMapBlcok
 */
if (!function_exists('WPMapBlock_Start')) {
    function WPMapBlock_Start()
    {
        return WPMapBlock::getInstance();
    }
}

// Plugin Start
WPMapBlock_Start();
