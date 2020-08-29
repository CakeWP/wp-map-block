import { Component } from "@wordpress/element";
import { withInstanceId } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
import {
	RadioControl,
	TextControl,
	TextareaControl,
	Panel,
	PanelBody,
	RangeControl,
} from "@wordpress/components";
import { Icon, chevronDown, close } from "@wordpress/icons";
const { InspectorControls } = wp.editor;
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "./editor.scss";

class edit extends Component {
	constructor(props) {
		super(props);

		this.state = {
			map_marker_toggle: {
				id: null,
				isOpen: false,
			},
		};
		this.props.setAttributes({ map_id: "wpmapblock_" + this.props.instanceId });
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
					lng: "",
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
		// this.map_init();
		const OSM = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
		const GM =
			"https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i349018013!3m9!2sen-US!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0";
		return (
			<React.Fragment>
				<InspectorControls>
					<Panel>
						<PanelBody
							title={__("Map Settings", "wp-map-block")}
							icon={chevronDown}
							initialOpen={true}
						>
							<RangeControl
								label={__("Width (%)", "wp-map-block")}
								value={this.props.attributes.map_width}
								onChange={(width) =>
									this.props.setAttributes({ map_width: width })
								}
								min={0}
								max={100}
							/>
							<RangeControl
								label={__("Height (px)", "wp-map-block")}
								value={this.props.attributes.map_height}
								onChange={(height) =>
									this.props.setAttributes({ map_height: height })
								}
								min={0}
								max={1000}
							/>
							<RadioControl
								label={__("Choose Map", "wp-map-block")}
								selected={this.props.attributes.map_type}
								options={[
									{ label: "Google Map", value: "GM" },
									{ label: "Open Street map", value: "OSM" },
								]}
								onChange={(value) =>
									this.props.setAttributes({ map_type: value })
								}
							/>
							<RangeControl
								label={__("Zoom Level", "wp-map-block")}
								value={this.props.attributes.map_zoom}
								min={0}
								max={20}
								onChange={(value) =>
									this.props.setAttributes({ map_zoom: value })
								}
							/>
						</PanelBody>
					</Panel>
					<Panel>
						<PanelBody
							title={__("Map Marker", "wp-map-block")}
							icon={chevronDown}
							initialOpen={false}
						>
							<div className="ti-repeater-fields-wrapper">
								{this.props.attributes.map_marker_list !== undefined &&
									this.props.attributes.map_marker_list.map((item, index) => (
										<div className="ti-repeater-fields" key={index}>
											<div className="ti-repeater-toggle-heading">
												<h4 className="ti-repeater-heading-title">
													{__("Marker ", "wp-map-block")} {1 + index}
												</h4>
												<div className="ti-repeater-control">
													<button
														className="btn-ti-repeater toggle"
														onClick={() => {
															this.toggleRepeater(index);
														}}
													>
														<Icon icon={chevronDown} />
													</button>
													<button
														className="btn-ti-repeater delete"
														onClick={() => this.removeRepeater(index)}
													>
														<Icon icon={close} />
													</button>
												</div>
											</div>
											<div
												className={
													this.state.map_marker_toggle.id === index &&
													this.state.map_marker_toggle.isOpen === true
														? "ti-repeater-toggle-body ti-toggle-open"
														: "ti-repeater-toggle-body"
												}
											>
												<TextControl
													label={__("Latitude", "wp-map-block")}
													onChange={(num) =>
														this.setMarkerAttributeValue(
															index,
															"lat",
															!isNaN(num) ? num : 0
														)
													}
													value={
														this.props.attributes.map_marker_list[index].lat
													}
												/>
												<TextControl
													label={__("longitude", "wp-map-block")}
													onChange={(num) =>
														this.setMarkerAttributeValue(
															index,
															"lng",
															!isNaN(num) ? num : 0
														)
													}
													value={
														this.props.attributes.map_marker_list[index].lng
													}
												/>
												<TextControl
													label={__("Title", "wp-map-block")}
													onChange={(text) =>
														this.setMarkerAttributeValue(index, "title", text)
													}
													value={
														this.props.attributes.map_marker_list[index].title
													}
												/>
												<TextareaControl
													label={__("Content", "wp-map-block")}
													onChange={(text) =>
														this.setMarkerAttributeValue(index, "content", text)
													}
													value={
														this.props.attributes.map_marker_list[index].content
													}
												/>
											</div>
										</div>
									))}

								<button
									className="ti-repeater-btn-add"
									onClick={() => this.addMarkerHandler()}
								>
									{__("+ Add Item", "wp-map-block")}
								</button>
							</div>
						</PanelBody>
					</Panel>
				</InspectorControls>
				<Map
					id={"wpmapblock_" + this.props.instanceId}
					style={{
						width: this.props.attributes.map_width + "%",
						height: this.props.attributes.map_height + "px",
					}}
					center={
						this.props.attributes.map_marker_list !== undefined &&
						this.props.attributes.map_marker_list.length > 0
							? this.props.attributes.map_marker_list[0]
							: {
									lat: 23.7806365,
									lng: 90.4193257,
							  }
					}
					zoom={this.props.attributes.map_zoom}
				>
					<TileLayer url={this.props.attributes.map_type == "OSM" ? OSM : GM} />
					{this.props.attributes.map_marker_list !== undefined &&
						this.props.attributes.map_marker_list.length > 0 &&
						this.props.attributes.map_marker_list.map((item, index) => (
							<Marker
								key={index}
								position={{
									lat: item.lat,
									lng: item.lng,
									zoom: 10,
								}}
							>
								{item.title !== "" || item.content !== "" ? (
									<Popup>
										<h6>{item.title}</h6>
										<p>{item.content}</p>
									</Popup>
								) : (
									""
								)}
							</Marker>
						))}
				</Map>
			</React.Fragment>
		);
	}
}

export default withInstanceId(edit);
