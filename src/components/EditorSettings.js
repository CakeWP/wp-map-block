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
import { Icon, chevronDown, close } from "@wordpress/icons";
import EditorModalMarker from "./EditorModalMarker";
const { InspectorControls } = wp.blockEditor;
import PropTypes from "prop-types";

const propTypes = {};

const defaultProps = {};

export default function EditorSettings({ attributes, setAttributes }) {
	const [index, setIndex] = useState(0);

	const removeRepeater = (key) => {
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
					content: "",
					iconType: "default",
					customIconUrl: "",
					customIconWidth: 25,
					customIconHeight: 40,
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
			<EditorModalMarker
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
							{"  "}
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
											<button
												className="ti-repeater-control__left btn-ti-repeater"
												onClick={() => openMarkerModalModal(index)}
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
								{__("+ Add Item", "wp-map-block")}
							</Button>
						</div>
					</PanelBody>
				</Panel>
			</InspectorControls>
		</React.Fragment>
	);
}

EditorSettings.propTypes = propTypes;
EditorSettings.defaultProps = defaultProps;
