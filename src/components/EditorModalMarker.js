import React from "react";
import {
	Button,
	Modal,
	RadioControl,
	TextControl,
	TextareaControl,
	RangeControl,
	ToggleControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import Search from "./Search";
import PropTypes from "prop-types";

const propTypes = {};

const defaultProps = {};

export default function EditorModalMarker({
	index,
	isOpen,
	attributes,
	setAttributes,
	openModal,
	closeModal,
}) {
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

	return (
		<>
			{isOpen && (
				<Modal title="Marker Editor" onRequestClose={closeModal}>
					<Search
						index={index}
						attributes={attributes}
						setAttributes={setAttributes}
					/>
					<div className="ti-repeater-fields" key={index}>
						<div className="ti-group-control">
							<TextControl
								label={__("Latitude", "wp-map-block")}
								onChange={(num) =>
									setMarkerAttributeValue(index, "lat", !isNaN(num) ? num : 0)
								}
								value={attributes.map_marker_list[index].lat}
							/>
							<TextControl
								label={__("longitude", "wp-map-block")}
								onChange={(num) =>
									setMarkerAttributeValue(index, "lng", !isNaN(num) ? num : 0)
								}
								value={attributes.map_marker_list[index].lng}
							/>
						</div>

						<ToggleControl
							label={`${
								attributes.center_index === index
									? __("Disable Map Center Position", "wp-map-block")
									: __("Enable Map Center Position", "wp-map-block")
							}`}
							checked={attributes.center_index === index}
							onChange={(option) => {
								setAttributes({ center_index: option ? index : 0 });
							}}
						/>
						<TextControl
							label={__("Title", "wp-map-block")}
							onChange={(text) => setMarkerAttributeValue(index, "title", text)}
							value={attributes.map_marker_list[index].title}
						/>
						<TextareaControl
							label={__("Content", "wp-map-block")}
							help={__("HTML Supported", "wp-map-block")}
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
						{attributes.map_marker_list[index].iconType == "custom" && (
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) =>
										setMarkerAttributeValue(index, "customIconUrl", media.url)
									}
									allowedTypes={["image"]}
									render={({ open }) => (
										<div>
											{attributes.map_marker_list[index].customIconUrl !==
												"" && (
												<div>
													<RangeControl
														label={__("Icon Width", "wp-map-block")}
														value={parseInt(
															attributes.map_marker_list[index].customIconWidth
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
															attributes.map_marker_list[index].customIconHeight
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
															attributes.map_marker_list[index].customIconUrl
														}
														alt={__("Icon", "wp-map-block")}
													/>
												</div>
											)}
											<Button onClick={open}>
												{attributes.map_marker_list[index].customIconUrl == ""
													? __("Upload Icon", "wp-map-block")
													: __("Replace Icon", "wp-map-block")}
											</Button>
											{attributes.map_marker_list[index].customIconUrl !==
												"" && (
												<button
													type="button"
													className="components-button"
													onClick={() =>
														setMarkerAttributeValue(index, "customIconUrl", "")
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
					<Button isPrimary={true} onClick={closeModal}>
						{__("Save Marker", "wp-map-block")}
					</Button>
				</Modal>
			)}
		</>
	);
}

EditorModalMarker.propTypes = propTypes;
EditorModalMarker.defaultProps = defaultProps;
