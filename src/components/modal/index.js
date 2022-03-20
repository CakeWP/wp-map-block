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
import PropTypes from "prop-types";

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
						<TextControl
							label={__("Title", "wp-map-block")}
							onChange={(text) => setMarkerAttributeValue(index, "title", text)}
							value={map_marker_list[index].title}
						/>
						<TextareaControl
							label={__("Content", "wp-map-block")}
							help={__("HTML Supported", "wp-map-block")}
							onChange={(text) =>
								setMarkerAttributeValue(index, "content", text)
							}
							value={map_marker_list[index].content}
						/>
					</div>
					<div className="entry-right">
						<ToggleControl
							label={`${
								center_index === index
									? __("Disable Map Center Position", "wp-map-block")
									: __("Enable Map Center Position", "wp-map-block")
							}`}
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
								{ label: "Custom Icon", value: "custom" },
							]}
							onChange={(option) => {
								setMarkerAttributeValue(index, "iconType", option);
							}}
						/>
						{map_marker_list[index].iconType == "custom" && (
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) =>
										setMarkerAttributeValue(index, "customIconUrl", media.url)
									}
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
				</div>

				<Button isPrimary={true} onClick={closeModal}>
					{__("Save & Close", "wp-map-block")}
				</Button>
			</Modal>
		</>
	);
}

MarkerModal.propTypes = propTypes;
MarkerModal.defaultProps = defaultProps;
