import { Component } from "@wordpress/element";
import { withInstanceId } from "@wordpress/compose";
import { Panel, PanelBody, PanelRow } from "@wordpress/components";
import { Icon, chevronDown, close } from "@wordpress/icons";

import "./editor.scss";
const {
	CheckboxControl,
	RadioControl,
	TextControl,
	TextareaControl,
	ToggleControl,
	SelectControl,
} = wp.components;
const { RichText, InspectorControls } = wp.editor;
import { __experimentalNumberControl as NumberControl } from "@wordpress/components";
import L from "leaflet";

class edit extends Component {
	constructor(props) {
		super(props);

		this.state = {
			map_marker_toggle: {
				id: null,
				isOpen: false,
			},
		};
	}
	componentDidMount() {
		this.props.setAttributes({ map_id: "wpmapblock_" + this.props.instanceId });

		const cities = L.layerGroup();
		L.marker([39.61, -105.02])
			.bindPopup("This is Littleton, CO.")
			.addTo(cities),
			L.marker([39.74, -104.99]).bindPopup("This is Denver, CO.").addTo(cities),
			L.marker([39.73, -104.8]).bindPopup("This is Aurora, CO.").addTo(cities),
			L.marker([39.77, -105.23]).bindPopup("This is Golden, CO.").addTo(cities);

		let mbAttr =
				'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
				'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			mbUrl =
				"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

		let grayscale = L.tileLayer(mbUrl, {
				id: "mapbox/light-v9",
				tileSize: 512,
				zoomOffset: -1,
				attribution: mbAttr,
			}),
			streets = L.tileLayer(mbUrl, {
				id: "mapbox/streets-v11",
				tileSize: 512,
				zoomOffset: -1,
				attribution: mbAttr,
			});

		const map = L.map("wpmapblock_" + this.props.instanceId, {
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
	}

	removeRepeater = (key) => {
		const map_marker_list = this.props.attributes.map_marker_list.filter(
			(item, index) => index != key
		);

		this.props.setAttributes({ map_marker_list: map_marker_list });
	};

	toggleRepeater = (key) => {
		this.setState((state) => {
			return {
				map_marker_toggle: {
					id: key,
					isOpen:
						state.map_marker_toggle.id === key &&
						state.map_marker_toggle.isOpen === true
							? false
							: true,
				},
			};
		});
	};
	setMarkerAttributeValue = (index, name, value) => {
		const map_marker_list = this.props.attributes.map_marker_list.map(
			(item, key) => {
				const returnValue = { ...item };

				if (index === key) {
					returnValue[name] = value;
				}

				return returnValue;
			}
		);
		this.props.setAttributes({
			map_marker_list,
		});
	};
	addMarkerHandler = () => {
		this.props.setAttributes({
			map_marker_list: [
				...this.props.attributes.map_marker_list,
				{
					lat: "",
					lon: "",
					title: "",
					content: "",
					icon_class_name: "",
					icon_image_uri: "",
					is_show_image: false,
				},
			],
		});
	};

	render() {
		// console.log(this.props.attributes);
		console.log(this.props.attributes.map_marker_list);
		return (
			<React.Fragment>
				<InspectorControls>
					<div className="ti-repeater-fields-wrapper">
						{this.props.attributes.map_marker_list.map((item, index) => (
							<div className="ti-repeatrer-fields" key={index}>
								<div className="ti-repeatrer-toggle-heading">
									<span>{item.title}</span>
									<button
										onClick={() => {
											this.toggleRepeater(index);
										}}
									>
										<Icon icon={chevronDown} />
									</button>
									<button onClick={() => this.removeRepeater(index)}>
										<Icon icon={close} />
									</button>
								</div>
								<div
									className={
										this.state.map_marker_toggle.id === index &&
										this.state.map_marker_toggle.isOpen === true
											? "ti-repeatrer-toggle-body ti-toggle-open"
											: "ti-repeatrer-toggle-body"
									}
								>
									<TextControl
										label="Latitude"
										onChange={(text) =>
											this.setMarkerAttributeValue(index, "lat", text)
										}
										value={this.props.attributes.map_marker_list[index].lat}
									/>
									<TextControl
										label="Longitude"
										onChange={(text) =>
											this.setMarkerAttributeValue(index, "lon", text)
										}
										value={this.props.attributes.map_marker_list[index].lon}
									/>
									<TextControl
										label="Title"
										onChange={(text) =>
											this.setMarkerAttributeValue(index, "title", text)
										}
										value={this.props.attributes.map_marker_list[index].title}
									/>
									<TextareaControl
										label="Content"
										onChange={(text) =>
											this.setMarkerAttributeValue(index, "content", text)
										}
										value={this.props.attributes.map_marker_list[index].content}
									/>
								</div>
							</div>
						))}

						<button onClick={() => this.addMarkerHandler()}>+ Add Item</button>
					</div>
				</InspectorControls>
				<div
					id={"wpmapblock_" + this.props.instanceId}
					className="wp-map-block"
				></div>
			</React.Fragment>
		);
	}
}

export default withInstanceId(edit);
