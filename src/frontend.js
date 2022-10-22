jQuery(document).ready(function () {
	const WPMapBlockRender = (element, ID, Settings) => {
		var OSM = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
		var GM =
			"https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i349018013!3m9!2sen-US!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0";
		var cities = L.layerGroup();
		
		Settings.map_marker.forEach(function (item, index) {
			var popup = document.createElement('div');

			popup.className = 'map-popup';
			popup.setAttribute('data-markerindex', index.toString());
			
			
			var popupHtml = "";

			// Close icon.
			popupHtml += `<div class="popup-close-header">
			<div class="close-toggle">
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
			width="24" height="24"
			viewBox="0 0 24 24"
			style=" fill:#000000;"><path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path></svg>
			</div>
			</div>`

			if (item.title !== "") {
				popupHtml += "<h6>" + item.title + "</h6>";
			}
			if (item.content !== "") {
				popupHtml += "<pre>" + item.content + "</pre>";
			}

			popup.innerHTML = popupHtml
			
			element.appendChild(popup);
			const currentPopup = element.querySelector(`.map-popup[data-markerindex="${index}"]`);
			const closeToggle = element.querySelector('.close-toggle');

			closeToggle.addEventListener('click', () => {
				if (currentPopup.classList.contains('is-visible')) {
					currentPopup.classList.remove('is-visible');
				}
			});

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
					L.marker([item.lat, item.lng]).addTo(cities).on('click', () => {
						currentPopup.classList.toggle('is-visible');
					});
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
			scrollWheelZoom: Settings.scroll_wheel_zoom,
		};
		if (Settings.map_marker.length) {
			config.center = [
				Settings.map_marker[Settings.center_index].lat,
				Settings.map_marker[Settings.center_index].lng,
			];
		}
		L.map(ID, config);
	};
	if (jQuery(".wpmapblockrender").length) {
		jQuery(".wpmapblockrender").each((index, element) => {
			const Element = jQuery(element);
			WPMapBlockRender(
				element,
				Element.attr("ID"),
				JSON.parse(Element.attr("data-settings"))
			);
		});
	}
});
