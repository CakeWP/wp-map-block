import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import { MapContainer, TileLayer } from "react-leaflet";
import DraggableMarker from "./DraggableMarker";
import { OSM, GM, getMapPosition } from "./../../utils/helper";
import PlaceSearch from "./PlaceSearch";
import PropTypes from "prop-types";

const propTypes = {};

const defaultProps = {};

export default function Search({ index, attributes, setAttributes }) {
	const [modalMap, setModalMap] = useState(null);
	const { map_marker_list } = attributes;
	const [center, setCenter] = useState(getMapPosition(map_marker_list[index]));

	const setLatLngHandler = (lat, lng) => {
		if (modalMap) {
			modalMap.setView({ lat, lng });
		}
		map_marker_list[index]["lat"] = lat;
		map_marker_list[index]["lng"] = lng;
		setAttributes({
			map_marker_list: [...map_marker_list],
		});
		setCenter({ lat, lng });
	};

	return (
		<React.Fragment>
			<div className="wp-map-block-modal-location-search">
				<PlaceSearch setLatLngHandler={setLatLngHandler} />
				<MapContainer
					style={{
						width: "100%",
						height: "200px",
					}}
					center={center}
					zoom={13}
					whenCreated={setModalMap}
				>
					<TileLayer url={attributes.map_type == "OSM" ? OSM : GM} />
					<DraggableMarker
						center={center}
						setLatLngHandler={setLatLngHandler}
					/>
				</MapContainer>
			</div>
		</React.Fragment>
	);
}

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;
