<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Plugin Core Scripts
 * @return void
 * @since 1.0
 */
if (!function_exists('wpmapblock_plugin_core_scripts')) {
	function wpmapblock_plugin_core_scripts()
	{
		wp_enqueue_script('wpmapblock-leaflet', plugins_url('assets/js/leaflet.js', dirname(__FILE__)), array('jquery'), null, true);
		wp_enqueue_script('wpmapblock-leaflet-fullscreen', plugins_url('assets/js/Control.FullScreen.js', dirname(__FILE__)), array('jquery'), null, true);
	}
}
add_action('wp_enqueue_scripts', 'wpmapblock_plugin_core_scripts');


/**
 * Register wp map block and necessary assets
 * @return void
 * @since 1.0
 */
if (!function_exists('wpmapblock_block_assets')) {
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
}
add_action('init', 'wpmapblock_block_assets');

/**
 * WP Map Block serve side render scripts
 * @param attributes, content
 * @return void
 * @since 1.0
 */
if (!function_exists('wpmapblock_map_render_callback')) {
	function wpmapblock_map_render_callback($attributes, $content = '')
	{
		wp_add_inline_script(
			'wpmapblock-leaflet',
			sprintf(
				'jQuery(document).ready(function(){ 
				var OSM = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
				var GM =
			"https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i349018013!3m9!2sen-US!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0";
				var cities = L.layerGroup();
			var markerList = JSON.parse(JSON.stringify(%2$s));
			
			markerList.forEach(function(item, index){
				var popupHTML = "";
				if(item.title !== ""){
					popupHTML += "<h6>"+item.title+"</h6>";
				}
				if(item.content !== ""){
					popupHTML += "<p>"+item.content+"</p>";
				}
				if(item.iconType == "custom"){
					var LeafIcon = L.Icon.extend({
						options: {
							iconSize:     [item.customIconWidth, item.customIconHeight],
							popupAnchor: [0, -15],
						}
					});
					var icon = new LeafIcon({iconUrl: item.customIconUrl});
					if(item.title !== "" || item.content !== ""){
						L.marker([item.lat, item.lng], {icon: icon})
						.bindPopup(popupHTML)
						.addTo(cities);
					} else {
						L.marker([item.lat, item.lng], {icon: icon}).addTo(cities);
					}
				}else{
					if(item.title !== "" || item.content !== ""){
						L.marker([item.lat, item.lng])
						.bindPopup(popupHTML)
						.addTo(cities);
					} else {
						L.marker([item.lat, item.lng]).addTo(cities);
					}
				}
			});
			var mapType = %4$s;
			var grayscale = L.tileLayer(mapType, {
				id: "mapbox/light-v9",
				tileSize: 512,
				zoomOffset: -1,
			});

			var map = L.map(%1$s, {
			center: [markerList[0].lat, markerList[0].lng],
			zoom: %3$s,
			layers: [grayscale, cities],
			fullscreenControl: true,
			fullscreenControlOptions: {
				position: "topright"
			}
		});
		});',
				(isset($attributes['map_id']) ? $attributes['map_id'] : ''),
				json_encode((isset($attributes['map_marker_list']) ? $attributes['map_marker_list'] : [[
					'lat' 		=> 23.7806365,
					'lng' 		=> 90.4193257,
					'title'		=> 'Bangladesh',
					'content'	=> 'A Beautiful Country'
				]])),
				(isset($attributes['map_zoom']) ? $attributes['map_zoom'] : 10),
				(isset($attributes['map_type']) ? $attributes['map_type'] : 'GM')
			)
		);

		$map_width = (isset($attributes['map_width']) ? $attributes['map_width'] . '%' : '100%');
		$map_height = (isset($attributes['map_height']) ? $attributes['map_height'] . 'px' : '500px');
		$style = "
		width: {$map_width};
		height: {$map_height};
	";
		return '<div id="' . (isset($attributes['map_id']) ? $attributes['map_id'] : '') . '" style="' . $style . '"></div>';
	}
}
