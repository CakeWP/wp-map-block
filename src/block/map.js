const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import "./style.scss";
import edit from "./edit";

registerBlockType("wpmapblock/wp-map-block", {
	title: __("WP Map Block"),
	category: "common",
	keywords: [__("map"), __("google map"), __("openstreet map"), __("mapbox")],
	attributes: {
		map_id: {
			type: "string",
		},
		map_marker_list: {
			type: "array",
		},
	},
	edit,
	save() {
		return null;
	},
});
