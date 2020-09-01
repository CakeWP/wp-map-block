const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import Icon from "./../components/Icon";
import "./style.scss";
import edit from "./edit";

registerBlockType("wpmapblock/wp-map-block", {
	title: __("WP Map Block"),
	category: "design",
	icon: Icon,
	keywords: [__("map"), __("google map"), __("openstreet map")],
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
					iconType: "default",
					customIconUrl: "",
					customIconWidth: 25,
					customIconHeight: 40,
				},
			],
		},
		map_zoom: {
			type: "number",
			default: 10,
		},
		map_type: {
			type: "string",
			default: "GM",
		},
		map_width: {
			type: "number",
			default: 100,
		},
		map_height: {
			type: "number",
			default: 500,
		},
	},
	edit,
	save() {
		return null;
	},
});
