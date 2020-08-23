<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Register wp map block and necessary assets
 * @return void
 * @since 1.0
 */
function wpmapblock_block_assets()
{
	wp_register_style(
		'wp-map-block-stylesheets',
		plugins_url('dist/blocks.style.build.css', dirname(__FILE__)),
		is_admin() ? array('wp-editor') : null,
		filemtime(plugin_dir_path(__DIR__) . 'dist/blocks.style.build.css')
	);

	// Register block editor script for backend.
	wp_register_script(
		'wp-map-block-js', // Handle.
		plugins_url('/dist/blocks.build.js', dirname(__FILE__)),
		array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'),
		filemtime(plugin_dir_path(__DIR__) . 'dist/blocks.build.js'),
		true
	);

	// Register block editor styles for backend.
	wp_register_style(
		'wp-map-block-editor-css',
		plugins_url('dist/blocks.editor.build.css', dirname(__FILE__)),
		array('wp-edit-blocks'),
		filemtime(plugin_dir_path(__DIR__) . 'dist/blocks.editor.build.css')
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

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'wpmapblock/wp-map-block',
		array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'wp-map-block-stylesheets',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'wp-map-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'wp-map-block-editor-css',
			'render_callback' => 'wpmapblock_map_render_callback',
		)
	);
}
add_action('init', 'wpmapblock_block_assets');

/**
 * WP Map Block serve side render scripts
 * @param attributes, content
 * @return void
 * @since 1.0
 */
function wpmapblock_map_render_callback($attributes, $content = '')
{
	wp_add_inline_script(
		'wpmapblock-leaflet',
		sprintf('jQuery(document).ready(function(){ 
			const cities = L.layerGroup();
		L.marker([39.61, -105.02])
			.bindPopup("This is Littleton, CO.")
			.addTo(cities),
			L.marker([39.74, -104.99]).bindPopup("This is Denver, CO.").addTo(cities),
			L.marker([39.73, -104.8]).bindPopup("This is Aurora, CO.").addTo(cities),
			L.marker([39.77, -105.23]).bindPopup("This is Golden, CO.").addTo(cities);

		let mbUrl =
				"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

		let grayscale = L.tileLayer(mbUrl, {
				id: "mapbox/light-v9",
				tileSize: 512,
				zoomOffset: -1,
			}),
			streets = L.tileLayer(mbUrl, {
				id: "mapbox/streets-v11",
				tileSize: 512,
				zoomOffset: -1,
			});

		const map = L.map(%s, {
			center: [39.73, -104.99],
			zoom: 10,
			layers: [grayscale, cities],
		});

		const baseLayers = {
			Grayscale: grayscale,
			Streets: streets,
		};

		const overlays = {
			Cities: cities,
		};

		L.control.layers(baseLayers, overlays).addTo(map);
		 });', (isset($attributes['map_id']) ? $attributes['map_id'] : ''))
	);
	return '<div id="' . (isset($attributes['map_id']) ? $attributes['map_id'] : '') . '" class="wp-map-block"></div>';
}

/**
 * Plugin Scripts
 * @return void
 * @since 1.0
 */
function wpmapblock_plugin_core_scripts()
{
	wp_enqueue_script('wpmapblock-leaflet', plugins_url('assets/js/leaflet.js', dirname(__FILE__)), array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'wpmapblock_plugin_core_scripts');
