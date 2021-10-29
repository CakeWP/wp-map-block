import { Component } from "@wordpress/element";
import { withInstanceId } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import FullscreenControl from "react-leaflet-fullscreen";
import L from "leaflet";
import EditorSettings from "./../components/EditorSettings";

class edit extends Component {
	constructor(props) {
		super(props);
		this.props.setAttributes({ map_id: "wpmapblock_" + this.props.instanceId });
	}
	render() {
		const { setAttributes, attributes } = this.props;
		const OSM = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
		const GM =
			"https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i349018013!3m9!2sen-US!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0";

		return (
			<React.Fragment>
				<EditorSettings attributes={attributes} setAttributes={setAttributes} />
				<Map
					id={"wpmapblock_" + this.props.instanceId}
					style={{
						width: attributes.map_width + "%",
						height: attributes.map_height + "px",
					}}
					center={
						attributes.map_marker_list !== undefined &&
						attributes.map_marker_list.length > 0
							? attributes.map_marker_list[0]
							: {
									lat: 23.7806365,
									lng: 90.4193257,
							  }
					}
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
				</Map>
			</React.Fragment>
		);
	}
}

export default withInstanceId(edit);
