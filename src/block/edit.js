import { Component } from "@wordpress/element";
import { withInstanceId } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FullscreenControl } from "react-leaflet-fullscreen";
import L from "leaflet";
import { OSM, GM, getMapPosition } from "./../utils/helper";
import EditorSettings from "./../components/EditorSettings";

class edit extends Component {
	constructor(props) {
		super(props);
		// Assigning block_id in the attribute.
		this.props.setAttributes({
			map_id: "wpmapblock_" + this.props.clientId.substr(0, 8),
		});
	}
	render() {
		const { setAttributes, attributes } = this.props;
		return (
			<React.Fragment>
				<EditorSettings attributes={attributes} setAttributes={setAttributes} />
				<MapContainer
					id={"wpmapblock_" + this.props.instanceId}
					style={{
						width: attributes.map_width + "%",
						height: attributes.map_height + "px",
					}}
					center={getMapPosition(
						attributes?.map_marker_list[attributes?.center_index]
					)}
					zoom={attributes.map_zoom}
					scrollWheelZoom={attributes.scroll_wheel_zoom}
				>
					<TileLayer url={attributes.map_type == "OSM" ? OSM : GM} />
					{attributes.map_marker_list !== undefined &&
						attributes.map_marker_list.length > 0 &&
						attributes.map_marker_list.map((item, index) => (
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
}

export default withInstanceId(edit);
