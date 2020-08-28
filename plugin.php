<?php

/**
 * Plugin Name: WP Map Block
 * Plugin URI: http://itushar.me/wp-map-block
 * Description: Gutenberg Map Block for Google Map and OpenStreet Map
 * Author: tusharimran
 * Author URI: http://itushar.me
 * Version: 1.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path(__FILE__) . 'src/init.php';
