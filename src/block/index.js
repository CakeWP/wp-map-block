const { __ } = wp.i18n;

import { registerBlockType } from '@wordpress/blocks';

import Icon from "../components/Icon";
import attributes from "./attributes";
import edit from "./edit";

registerBlockType("wpmapblock/wp-map-block", {
	title: __("WP Map Block", "wp-map-block"),
	description: __("Map solution by Academy LMS", "wp-map-block"),
	category: "design",
	icon: Icon,
	keywords: [
		__("map", "wp-map-block"),
		__("google map", "wp-map-block"),
		__("openstreet map", "wp-map-block"),
		__("map block", "wp-map-block"),
		__("api", "wp-map-block"),
		__("maps", "wp-map-block"),
	],
	supports: {
		align: [ 'wide', 'full' ]
	},
	attributes,
	edit,
	save() {
		return null;
	},
});
