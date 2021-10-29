jQuery(document).ready(function () {
	const WPMapBlockRender = (ID, Settings) => {
		var OSM = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
		var GM =
			"https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i349018013!3m9!2sen-US!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0";
		var cities = L.layerGroup();
		const decodeHtml = (str) => {
			var map = {
				"&amp;": "&",
				"&lt;": "<",
				"&gt;": ">",
				"&quot;": '"',
				"&#039;": "'",
			};
			return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function (m) {
				return map[m];
			});
		};
		Settings.map_marker.forEach(function (item, index) {
			var popupHTML = "";
			if (item.title !== "") {
				popupHTML += "<h6>" + item.title + "</h6>";
			}
			if (item.content !== "") {
				popupHTML += "<p>" + decodeHtml(item.content) + "</p>";
			}
			if (item.iconType == "custom") {
				var LeafIcon = L.Icon.extend({
					options: {
						iconSize: [item.customIconWidth, item.customIconHeight],
						popupAnchor: [0, -15],
					},
				});
				var icon = new LeafIcon({ iconUrl: item.customIconUrl });
				if (item.title !== "" || item.content !== "") {
					L.marker([item.lat, item.lng], { icon: icon })
						.bindPopup(popupHTML)
						.addTo(cities);
				} else {
					L.marker([item.lat, item.lng], { icon: icon }).addTo(cities);
				}
			} else {
				if (item.title !== "" || item.content !== "") {
					L.marker([item.lat, item.lng]).bindPopup(popupHTML).addTo(cities);
				} else {
					L.marker([item.lat, item.lng]).addTo(cities);
				}
			}
		});
		var mapType = Settings.map_type === "OSM" ? OSM : GM;
		var grayscale = L.tileLayer(mapType, {
			id: "mapbox/light-v9",
		});
		let config = {
			zoom: Settings.map_zoom,
			layers: [grayscale, cities],
			fullscreenControl: true,
			scrollWheelZoom: Settings.scroll_wheel_zoom,
			fullscreenControlOptions: {
				position: "topright",
			},
		};
		if (Settings.map_marker.length) {
			config.center = [Settings.map_marker[0].lat, Settings.map_marker[0].lng];
		}
		L.map(ID, config);
	};
	if (jQuery(".wpmapblockrender").length) {
		jQuery(".wpmapblockrender").each((index, element) => {
			const Element = jQuery(element);
			WPMapBlockRender(
				Element.attr("ID"),
				JSON.parse(Element.attr("data-settings"))
			);
		});
	}
});
