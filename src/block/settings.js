import React, { useState } from "react";
import {
	RadioControl,
	Button,
	Panel,
	PanelBody,
	RangeControl,
	FormToggle,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { Icon, close } from "@wordpress/icons";
import MarkerModal from "./../components/modal";
const { InspectorControls } = wp.blockEditor;
import PropTypes from "prop-types";

const propTypes = {};

const defaultProps = {};

export default function Settings({ attributes, setAttributes }) {
	const [index, setIndex] = useState(0);

	const removeMarker = (key) => {
		const map_marker_list = attributes.map_marker_list.filter(
			(item, index) => index != key
		);
		setAttributes({ map_marker_list: map_marker_list });
	};

	const addNewMarker = () => {
		setAttributes({
			map_marker_list: [
				...attributes.map_marker_list,
				{
					lat: "",
					lng: "",
					title: "",
					subTitle: "",
					content: "",
					iconType: "default",
					customIconUrl: "",
					customIconWidth: 25,
					customIconHeight: 40,
					images: [],
				},
			],
		});
	};

	const [isOpenMarkerModal, setOpenMarkerModal] = useState(false);
	const openMarkerModalModal = (position) => {
		setIndex(position);
		setOpenMarkerModal(true);
	};
	const closeMarkerModalModal = () => {
		setIndex(0);
		setOpenMarkerModal(false);
	};

	return (
		<React.Fragment>
			<MarkerModal
				index={index}
				attributes={attributes}
				setAttributes={setAttributes}
				isOpen={isOpenMarkerModal}
				openModal={openMarkerModalModal}
				closeModal={closeMarkerModalModal}
			/>
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
							max={1500}
						/>
						<RadioControl
							label={__("Choose Map", "wp-map-block")}
							selected={attributes.map_type}
							options={[
								{ label: __("Google Map", "wp-map-block"), value: "GM" },
								{ label: __("Open Street map", "wp-map-block"), value: "OSM" },
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
						<div>
							<FormToggle
								id="scroll_wheel_zoom"
								checked={attributes.scroll_wheel_zoom}
								onChange={() =>
									setAttributes({
										scroll_wheel_zoom: !attributes.scroll_wheel_zoom,
									})
								}
							/>
							<label htmlFor="scroll_wheel_zoom">
								{__("Enable Scroll Wheel Zoom", "wp-map-block")}
							</label>
						</div>
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
										<div
											className={`ti-repeater-control ${
												attributes.center_index === index &&
												"ti-repeater-control--is-center"
											}`}
										>
											<div className="ti-repeater-control__left btn-ti-repeater">
												{__("Marker ", "wp-map-block")} {1 + index}
												<button
													className="btn-edit"
													onClick={() => openMarkerModalModal(index)}
												>
													<div className="icon">Edit</div>
												</button>
											</div>
											<button
												className="ti-repeater-control__right btn-ti-repeater"
												onClick={() => removeMarker(index)}
											>
												<Icon width="15" icon={close} />
											</button>
										</div>
									</div>
								))}

							<Button
								variant="secondary"
								onClick={() => {
									addNewMarker();
									openMarkerModalModal(
										attributes.map_marker_list &&
											attributes.map_marker_list.length
									);
								}}
							>
								{__("+ Add Marker", "wp-map-block")}
							</Button>
						</div>
					</PanelBody>
				</Panel>
			</InspectorControls>
		</React.Fragment>
	);
}

Settings.propTypes = propTypes;
Settings.defaultProps = defaultProps;
