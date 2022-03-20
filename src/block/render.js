import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FullscreenControl } from "react-leaflet-fullscreen";
import L from "leaflet";
import { OSM, GM, getMapPosition } from "../utils/helper";
import PropTypes from "prop-types";

const propTypes = {};

const defaultProps = {};

export default function MapRender({ attributes, setAttributes }) {
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
			baseMap.setView(getMapPosition(map_marker_list[center_index]));
		}
	}, [center_index]);
	return (
		<React.Fragment>
			<MapContainer
				id={map_id}
				style={{
					width: map_width + "%",
					height: map_height + "px",
				}}
				center={getMapPosition(map_marker_list[center_index])}
				zoom={map_zoom}
				scrollWheelZoom={scroll_wheel_zoom}
				whenCreated={setBaseMap}
			>
				<TileLayer url={map_type == "OSM" ? OSM : GM} />
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
								<Popup>
									<h6>{item.title}</h6>
									<p dangerouslySetInnerHTML={{ __html: item.content }}></p>
								</Popup>
							) : (
								""
							)}
						</Marker>
					))}
				<FullscreenControl position="topright" />
			</MapContainer>
		</React.Fragment>
	);
}

MapRender.propTypes = propTypes;
MapRender.defaultProps = defaultProps;
