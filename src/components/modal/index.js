import React from "react";
import {
	Button,
	RadioControl,
	TextControl,
	TextareaControl,
	RangeControl,
	ToggleControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import Modal from "react-modal";
import Search from "./../search";
import { edit } from "@wordpress/icons";

import { get } from "lodash";

const propTypes = {};

const defaultProps = {};

const customStyles = {
	overlay: {
		background: "rgba(35, 40, 45, 0.62)",
	},
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		width: "850px",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
};

export default function MarkerModal({
	index,
	isOpen,
	attributes,
	setAttributes,
	openModal,
	closeModal,
}) {
	const { map_marker_list, center_index } = attributes;

	const setMarkerAttributeValue = (index, name, value) => {
		setAttributes({
			map_marker_list: map_marker_list.reduce((acc, item, key) => {
				if (index === key) {
					item[name] = value;
				}
				acc.push(item);
				return acc;
			}, []),
		});
	};

	const getMarkerAttributeValue = (index, name) => {
		const hasMarker = typeof map_marker_list[index] !== "undefined";

		if (hasMarker) {
			const markerAttribute = map_marker_list[index];

			return get(markerAttribute, name);
		}

		return null;
	};

	const galleryImages = getMarkerAttributeValue(index, "images");
	const hasGalleryImages =
		Array.isArray(galleryImages) && galleryImages.length > 0;

	let imageIds =
		galleryImages &&
		galleryImages.map((item) => {
			return item?.id;
		});

	return (
		<>
			<Modal
				bodyOpenClassName="wp-map-block-modal"
				isOpen={isOpen}
				style={customStyles}
				ariaHideApp={false}
				contentLabel="Marker Editor"
			>
				<Button className="wp-map-block-modal__close" onClick={closeModal}>
					<span className="dashicons dashicons-no-alt"></span>
				</Button>
				<div className="wp-map-block-modal__body">
					<div className="entry-left">
						<Search
							index={index}
							attributes={attributes}
							setAttributes={setAttributes}
						/>

						<div className="wp-map-block-modal-group-control">
							<TextControl
								label={__("Latitude", "wp-map-block")}
								onChange={(num) =>
									setMarkerAttributeValue(index, "lat", !isNaN(num) ? num : 0)
								}
								value={map_marker_list[index].lat}
							/>
							<TextControl
								label={__("longitude", "wp-map-block")}
								onChange={(num) =>
									setMarkerAttributeValue(index, "lng", !isNaN(num) ? num : 0)
								}
								value={map_marker_list[index].lng}
							/>
						</div>
						<br />
						<TextControl
							label={__("Title", "wp-map-block")}
							onChange={(text) => setMarkerAttributeValue(index, "title", text)}
							value={map_marker_list[index].title}
						/>
						<br />
						<TextControl
							label={__("Sub Title", "wp-map-block")}
							onChange={(text) =>
								setMarkerAttributeValue(index, "subtitle", text)
							}
							value={map_marker_list[index].subtitle}
						/>
						<br />
						<TextareaControl
							label={__("Content", "wp-map-block")}
							help={__("HTML Supported", "wp-map-block")}
							onChange={(text) =>
								setMarkerAttributeValue(index, "content", text)
							}
							value={map_marker_list[index].content}
						/>
						<MediaUploadCheck>
							<MediaUpload
								multiple
								gallery
								addToGallery={true}
								onSelect={(newImages) => {
									const mappedImages = newImages.map((image) => {
										return {
											url: image.url,
											thumbnail: image.sizes.thumbnail,
										};
									});

									setMarkerAttributeValue(index, "images", mappedImages);
								}}
								allowedTypes={["image"]}
								value={imageIds}
								render={({ open }) => (
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
										}}
									>
										<span>{__("Gallery", "wp-map-block")}</span>
										<Button icon={edit} variant="primary" onClick={open}>
											{hasGalleryImages
												? __("Edit", "wp-map-block")
												: __("Upload", "wp-map-block")}
										</Button>
									</div>
								)}
							/>
						</MediaUploadCheck>
					</div>
					<div className="entry-right">
						<div className="wp-map-block-modal-panel">
							<h2 className="wp-map-block-modal-panel__title">
								{__("Advanced Settings", "wp-map-block")}
							</h2>
							<div className="wp-map-block-modal-panel__body">
								<ToggleControl
									label={__("Set As Default Position", "wp-map-block")}
									checked={center_index === index}
									onChange={(option) => {
										setAttributes({ center_index: option ? index : 0 });
									}}
								/>
								<RadioControl
									label={__("Choose Icon Type", "wp-map-block")}
									selected={map_marker_list[index].iconType}
									options={[
										{
											label: __("Default Icon", "wp-map-block"),
											value: "default",
										},
										{
											label: __("Custom Icon", "wp-map-block"),
											value: "custom",
										},
									]}
									onChange={(option) => {
										setMarkerAttributeValue(index, "iconType", option);
									}}
								/>
								{map_marker_list[index].iconType == "custom" && (
									<>
										<MediaUploadCheck>
											<MediaUpload
												onSelect={(media) =>
													setMarkerAttributeValue(
														index,
														"customIconUrl",
														media.url
													)
												}
												value={getMarkerAttributeValue(index, "customIconUrl")}
												allowedTypes={["image"]}
												render={({ open }) => (
													<div>
														{map_marker_list[index].customIconUrl !== "" && (
															<div>
																<RangeControl
																	label={__("Icon Width", "wp-map-block")}
																	value={parseInt(
																		map_marker_list[index].customIconWidth
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
																		map_marker_list[index].customIconHeight
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
																	src={map_marker_list[index].customIconUrl}
																	alt={__("Icon", "wp-map-block")}
																	style={{
																		width:
																			map_marker_list[index].customIconWidth,
																		height:
																			map_marker_list[index].customIconHeight,
																	}}
																/>
															</div>
														)}
														<Button onClick={open}>
															{map_marker_list[index].customIconUrl == ""
																? __("Upload Icon", "wp-map-block")
																: __("Replace Icon", "wp-map-block")}
														</Button>
														{map_marker_list[index].customIconUrl !== "" && (
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
										<MediaUploadCheck>
											<MediaUpload
												onSelect={(media) =>
													setMarkerAttributeValue(
														index,
														"customActiveIconUrl",
														media.url
													)
												}
												value={getMarkerAttributeValue(
													index,
													"customActiveIconUrl"
												)}
												allowedTypes={["image"]}
												render={({ open }) => (
													<div>
														<Button onClick={open}>
															{map_marker_list[index].customActiveIconUrl == ""
																? __("Upload Active Icon", "wp-map-block")
																: __("Replace Active Icon", "wp-map-block")}
														</Button>
														{map_marker_list[index].customActiveIconUrl !==
															"" && (
															<button
																type="button"
																className="components-button"
																onClick={() =>
																	setMarkerAttributeValue(
																		index,
																		"customActiveIconUrl",
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
									</>
								)}
							</div>
						</div>
						<div className="wp-map-block-modal-panel">
							<h2 className="wp-map-block-modal-panel__title">
								{__("Our Latest Product", "wp-map-block")}{" "}
							</h2>
							<div className="wp-map-block-modal-panel__body">
								<p className="note">
									<strong>
										<a
											href="https://wordpress.org/plugins/academy"
											target="_blank"
										>
											{__("Academy LMS", "wp-map-block")}
										</a>
									</strong>{" "}
									{__(
										"– eLearning and online course solution for WordPress. More details please",
										"wp-map-block"
									)}
									<strong>
										<a href="https://academylms.net/" target="_blank">
											{__("Click Here", "wp-map-block")}
										</a>
									</strong>
								</p>
							</div>
						</div>
					</div>
				</div>

				<Button className="wp-map-block-modal__submit" onClick={closeModal}>
					{__("Save & Close", "wp-map-block")}
				</Button>
			</Modal>
		</>
	);
}

MarkerModal.propTypes = propTypes;
MarkerModal.defaultProps = defaultProps;
