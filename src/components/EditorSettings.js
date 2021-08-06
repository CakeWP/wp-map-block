import React, { useState } from "react";
import {
	RadioControl,
	TextControl,
	TextareaControl,
	Button,
	Panel,
	PanelBody,
	RangeControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Icon, chevronDown, close } from "@wordpress/icons";
const { InspectorControls } = wp.blockEditor;
import PropTypes from "prop-types";

const propTypes = {};

const defaultProps = {};

export default function EditorSettings({ attributes, setAttributes }) {
	const [mapMarkerToggle, setMapMarkerToggle] = useState({
		id: null,
		isOpen: false,
	});
	const toggleRepeater = (key) => {
		setMapMarkerToggle({
			id: key,
			isOpen:
				mapMarkerToggle.id === key && mapMarkerToggle.isOpen === true
					? false
					: true,
		});
	};
	const removeRepeater = (key) => {
		const map_marker_list = attributes.map_marker_list.filter(
			(item, index) => index != key
		);

		setAttributes({ map_marker_list: map_marker_list });
	};
	const setMarkerAttributeValue = (index, name, value) => {
		const map_marker_list = attributes.map_marker_list.map((item, key) => {
			const returnValue = { ...item };

			if (index === key) {
				returnValue[name] = value;
			}

			return returnValue;
		});
		setAttributes({
			map_marker_list,
		});
	};
	const addMarkerHandler = () => {
		setAttributes({
			map_marker_list: [
				...attributes.map_marker_list,
				{
					lat: "",
					lng: "",
					title: "",
					content: "",
					iconType: "default",
					customIconUrl: "",
					customIconWidth: 25,
					customIconHeight: 40,
				},
			],
		});
	};
	return (
		<React.Fragment>
			<InspectorControls>
				<Panel>
					<PanelBody
						title={__("Map Settings", "wp-map-block")}
						initialOpen={true}
					>
						<RangeControl
							label={__("Width (%)", "wp-map-block")}
							value={parseInt(attributes.map_width)}
							onChange={(width) => setAttributes({ map_width: width })}
							min={0}
							max={100}
						/>
						<RangeControl
							label={__("Height (px)", "wp-map-block")}
							value={parseInt(attributes.map_height)}
							onChange={(height) => setAttributes({ map_height: height })}
							min={0}
							max={1000}
						/>
						<RadioControl
							label={__("Choose Map", "wp-map-block")}
							selected={attributes.map_type}
							options={[
								{ label: "Google Map", value: "GM" },
								{ label: "Open Street map", value: "OSM" },
							]}
							onChange={(value) => setAttributes({ map_type: value })}
						/>
						<RangeControl
							label={__("Zoom Level", "wp-map-block")}
							value={attributes.map_zoom}
							min={0}
							max={20}
							onChange={(value) => setAttributes({ map_zoom: value })}
						/>
					</PanelBody>
				</Panel>
				<Panel>
					<PanelBody
						title={__("Map Marker", "wp-map-block")}
						initialOpen={false}
					>
						<div className="ti-repeater-fields-wrapper">
							{attributes.map_marker_list !== undefined &&
								attributes.map_marker_list.map((item, index) => (
									<div className="ti-repeater-fields" key={index}>
										<div className="ti-repeater-control">
											<button
												className="ti-repeater-control__left btn-ti-repeater"
												onClick={() => {
													toggleRepeater(index);
												}}
											>
												<div className="text">
													{__("Marker ", "wp-map-block")} {1 + index}
												</div>
												<div className="icon">
													<Icon icon={chevronDown} />
												</div>
											</button>
											<button
												className="ti-repeater-control__right btn-ti-repeater"
												onClick={() => removeRepeater(index)}
											>
												<Icon width="15" icon={close} />
											</button>
										</div>
										<div
											className={
												mapMarkerToggle.id === index &&
												mapMarkerToggle.isOpen === true
													? "ti-repeater-toggle-body ti-toggle-open"
													: "ti-repeater-toggle-body"
											}
										>
											<TextControl
												label={__("Latitude", "wp-map-block")}
												onChange={(num) =>
													setMarkerAttributeValue(
														index,
														"lat",
														!isNaN(num) ? num : 0
													)
												}
												value={attributes.map_marker_list[index].lat}
											/>
											<TextControl
												label={__("longitude", "wp-map-block")}
												onChange={(num) =>
													setMarkerAttributeValue(
														index,
														"lng",
														!isNaN(num) ? num : 0
													)
												}
												value={attributes.map_marker_list[index].lng}
											/>
											<TextControl
												label={__("Title", "wp-map-block")}
												onChange={(text) =>
													setMarkerAttributeValue(index, "title", text)
												}
												value={attributes.map_marker_list[index].title}
											/>
											<TextareaControl
												label={__("Content", "wp-map-block")}
												onChange={(text) =>
													setMarkerAttributeValue(index, "content", text)
												}
												value={attributes.map_marker_list[index].content}
											/>
											<RadioControl
												label={__("Choose Icon Type", "wp-map-block")}
												selected={attributes.map_marker_list[index].iconType}
												options={[
													{
														label: __("Default Icon", "wp-map-block"),
														value: "default",
													},
													{ label: "Custom Icon", value: "custom" },
												]}
												onChange={(option) => {
													setMarkerAttributeValue(index, "iconType", option);
												}}
											/>
											{attributes.map_marker_list[index].iconType ==
												"custom" && (
												<MediaUploadCheck>
													<MediaUpload
														onSelect={(media) =>
															setMarkerAttributeValue(
																index,
																"customIconUrl",
																media.url
															)
														}
														allowedTypes={["image"]}
														render={({ open }) => (
															<div>
																{attributes.map_marker_list[index]
																	.customIconUrl !== "" && (
																	<div>
																		<RangeControl
																			label={__("Icon Width", "wp-map-block")}
																			value={parseInt(
																				attributes.map_marker_list[index]
																					.customIconWidth
																			)}
																			onChange={(width) =>
																				setMarkerAttributeValue(
																					index,
																					"customIconWidth",
																					width
																				)
																			}
																			min={0}
																			max={500}
																		/>
																		<RangeControl
																			label={__("Icon Height", "wp-map-block")}
																			value={parseInt(
																				attributes.map_marker_list[index]
																					.customIconHeight
																			)}
																			onChange={(height) =>
																				setMarkerAttributeValue(
																					index,
																					"customIconHeight",
																					height
																				)
																			}
																			min={0}
																			max={500}
																		/>
																		<img
																			src={
																				attributes.map_marker_list[index]
																					.customIconUrl
																			}
																			alt={__("Icon", "wp-map-block")}
																		/>
																	</div>
																)}
																<Button onClick={open}>
																	{attributes.map_marker_list[index]
																		.customIconUrl == ""
																		? __("Upload Icon", "wp-map-block")
																		: __("Replace Icon", "wp-map-block")}
																</Button>
																{attributes.map_marker_list[index]
																	.customIconUrl !== "" && (
																	<button
																		type="button"
																		className="components-button"
																		onClick={() =>
																			setMarkerAttributeValue(
																				index,
																				"customIconUrl",
																				""
																			)
																		}
																	>
																		{__("Remove Icon", "wp-map-block")}
																	</button>
																)}
															</div>
														)}
													/>
												</MediaUploadCheck>
											)}
										</div>
									</div>
								))}

							<button
								className="ti-repeater-btn-add"
								onClick={() => addMarkerHandler()}
							>
								{__("+ Add Item", "wp-map-block")}
							</button>
						</div>
					</PanelBody>
				</Panel>
			</InspectorControls>
		</React.Fragment>
	);
}

EditorSettings.propTypes = propTypes;
EditorSettings.defaultProps = defaultProps;
