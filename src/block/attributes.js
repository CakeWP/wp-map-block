const attributes = {
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
				subtitle: "Dhaka",
				content: "A Beautiful Country",
				iconType: "default",
				customIconUrl: "",
				customActiveIconUrl: "",
				customIconWidth: 25,
				customIconHeight: 40,
				images: [],
			},
		],
	},
	heading: {
		type: "string",
		default: "",
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
	scroll_wheel_zoom: {
		type: "boolean",
		default: false,
	},
	center_index: {
		type: "number",
		default: 0,
	},
};
export default attributes;
