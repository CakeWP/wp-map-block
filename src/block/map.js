const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import "./style.scss";
import edit from "./edit";

registerBlockType("wpmapblock/wp-map-block", {
	title: __("WP Map Block"),
	category: "common",
	keywords: [__("map"), __("google map"), __("openstreet map"), __("mapbox")],
	edit,
	save() {
		return null;
	},
});
