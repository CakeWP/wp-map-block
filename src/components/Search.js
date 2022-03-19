import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import { Button, TextControl } from "@wordpress/components";
import { MapContainer, TileLayer } from "react-leaflet";
import DraggableMarker from "./DraggableMarker";
import { OSM, GM, getMapPosition } from "./../utils/helper";
import PlaceSearch from "./PlaceSearch";

import PropTypes from "prop-types";

const propTypes = {};

const defaultProps = {};

export default function Search({ index, attributes, setAttributes }) {
	const setLatLngHandler = (lat, lng) => {
		const map_marker_list = attributes.map_marker_list.map((item, key) => {
			const returnValue = { ...item };
			if (index === key) {
				returnValue["lat"] = lat;
				returnValue["lng"] = lng;
			}
			return returnValue;
		});
		setAttributes({
			map_marker_list,
		});
	};

	const center = getMapPosition(
		attributes?.map_marker_list[attributes?.center_index]
	);

	return (
		<React.Fragment>
			<div style={{ marginBottom: "10px" }}>
				<div className="ti-location-search">
					<PlaceSearch setLatLngHandler={setLatLngHandler} />
					{console.log(center)}
					<MapContainer
						style={{
							width: "100%",
							height: "200px",
						}}
						center={center}
						zoom={13}
					>
						<TileLayer url={attributes.map_type == "OSM" ? OSM : GM} />
						<DraggableMarker
							center={center}
							setLatLngHandler={setLatLngHandler}
						/>
					</MapContainer>
				</div>
			</div>
		</React.Fragment>
	);
}

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;
