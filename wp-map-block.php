<?php

/**
 * Plugin Name: WP Map Block
 * Plugin URI: http://itushar.me/wp-map-block
 * Description: Gutenberg Map Block for Google Map and OpenStreet Map build with LeafletJS
 * Author: tusharimran
 * Author URI: http://itushar.me
 * Version: 1.1.5
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Load textdomain.
 * @since 1.0
 */
add_action('init', 'wpmapblock_load_textdomain');
if (!function_exists('wpmapblock_load_textdomain')) {
	function wpmapblock_load_textdomain()
	{
		load_plugin_textdomain('wp-map-block', false, dirname(plugin_basename(__FILE__)) . '/languages');
	}
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path(__FILE__) . 'includes/Init.php';
