import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FullscreenControl } from "react-leaflet-fullscreen";
import L from "leaflet";
import { OSM, GM, getMapPosition } from "../utils/helper";
import PropTypes from "prop-types";

const propTypes = {};

const defaultProps = {};

export default function MapRender({ attributes, setAttributes }) {
	const tileLayerRef = useRef(null);
	const [baseMap, setBaseMap] = useState(null);
	const {
		map_id,
		map_width,
		map_height,
		map_marker_list,
		center_index,
		map_type,
		map_zoom,
		scroll_wheel_zoom,
	} = attributes;
	useEffect(() => {
		if (baseMap) {
			baseMap.invalidateSize();
		}
	}, [map_width, map_height]);

	useEffect(() => {
		if (tileLayerRef.current) {
			tileLayerRef.current.setUrl(map_type == "OSM" ? OSM : GM);
		}
	}, [map_type]);

	useEffect(() => {
		if (baseMap) {
			baseMap.setView(getMapPosition(map_marker_list, center_index));
			baseMap.setZoom(map_zoom);
		}
	}, [center_index, map_zoom, map_marker_list]);

	return (
		<React.Fragment>
			<div
				id={`wp-map-block-${map_id}`}
				className="wp-map-block-base-editor"
				style={{
					width: map_width + "%",
					height: map_height + "px",
				}}
			>
				<MapContainer
					id={map_id}
					className="wp-map-block-base-editor__map-container"
					center={getMapPosition(map_marker_list, center_index)}
					zoom={map_zoom}
					scrollWheelZoom={scroll_wheel_zoom}
					whenCreated={setBaseMap}
				>
					<TileLayer ref={tileLayerRef} url={map_type == "OSM" ? OSM : GM} />
					{map_marker_list !== undefined &&
						map_marker_list.length > 0 &&
						map_marker_list.map((item, index) => (
							<Marker
								key={index}
								position={{
									lat: item.lat,
									lng: item.lng,
									zoom: 10,
								}}
								icon={
									new L.Icon({
										iconUrl:
											item.iconType === "custom" && item.customIconUrl !== ""
												? item.customIconUrl
												: wpmapblockGlobal.pluginDirUrl +
												  "assets/images/marker-icon.png",
										popupAnchor: [0, -15],
										iconSize:
											item.iconType === "custom"
												? [item.customIconWidth, item.customIconHeight]
												: [25, 41],
									})
								}
							>
								{item.title !== "" || item.content !== "" ? (
									<div style={{ position: "absolute", top: "0px", left: "0" }}>
										<h6>{item.title}</h6>
										<p dangerouslySetInnerHTML={{ __html: item.content }}></p>
									</div>
								) : (
									""
								)}
							</Marker>
						))}
					<FullscreenControl position="topright" />
				</MapContainer>
			</div>
		</React.Fragment>
	);
}

MapRender.propTypes = propTypes;
MapRender.defaultProps = defaultProps;
