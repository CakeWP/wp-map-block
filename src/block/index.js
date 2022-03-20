const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import Icon from "../components/Icon";
import attributes from "./attributes";
import edit from "./edit";

registerBlockType("wpmapblock/wp-map-block", {
	title: __("WP Map Block"),
	category: "design",
	icon: Icon,
	keywords: [__("map"), __("google map"), __("openstreet map")],
	attributes,
	edit,
	save() {
		return null;
	},
});
