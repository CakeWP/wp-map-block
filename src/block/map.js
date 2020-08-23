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
			default: [
				{
					lat: 23.7806365,
					lng: 90.4193257,
					title: "Bangladesh",
					content: "A Beautiful Country",
					icon_class_name: "",
					icon_image_uri: "",
					is_show_image: false,
				},
			],
		},
		map_zoom: {
			type: "number",
			default: 14,
		},
		map_type: {
			type: "string",
			default: "OSM",
		},
	},
	edit,
	save() {
		return null;
	},
});
