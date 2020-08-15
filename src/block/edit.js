import { Component } from "@wordpress/element";
import { withInstanceId } from "@wordpress/compose";
import L from "leaflet";
class edit extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		this.props.setAttributes({ map_id: "wpmapblock_" + this.props.instanceId });

		const cities = L.layerGroup();
		L.marker([39.61, -105.02])
			.bindPopup("This is Littleton, CO.")
			.addTo(cities),
			L.marker([39.74, -104.99]).bindPopup("This is Denver, CO.").addTo(cities),
			L.marker([39.73, -104.8]).bindPopup("This is Aurora, CO.").addTo(cities),
			L.marker([39.77, -105.23]).bindPopup("This is Golden, CO.").addTo(cities);

		let mbAttr =
				'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
				'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			mbUrl =
				"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

		let grayscale = L.tileLayer(mbUrl, {
				id: "mapbox/light-v9",
				tileSize: 512,
				zoomOffset: -1,
				attribution: mbAttr,
			}),
			streets = L.tileLayer(mbUrl, {
				id: "mapbox/streets-v11",
				tileSize: 512,
				zoomOffset: -1,
				attribution: mbAttr,
			});

		const map = L.map("wpmapblock_" + this.props.instanceId, {
			center: [39.73, -104.99],
			zoom: 10,
			layers: [grayscale, cities],
		});

		const baseLayers = {
			Grayscale: grayscale,
			Streets: streets,
		};

		const overlays = {
			Cities: cities,
		};

		L.control.layers(baseLayers, overlays).addTo(map);
	}

	render() {
		return (
			<React.Fragment>
				<div
					id={"wpmapblock_" + this.props.instanceId}
					className="wp-map-block"
				></div>
			</React.Fragment>
		);
	}
}

export default withInstanceId(edit);
