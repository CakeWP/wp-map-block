export const OSM = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export const GM =
	"https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i349018013!3m9!2sen-US!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0";

export const debounce = (fn, delay) => {
	let timer = null;
	return function (...args) {
		const context = this;
		timer && clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(context, args);
		}, delay);
	};
};

export const getMapPosition = (markerLists, position) => {
	if (Array.isArray(markerLists)) {
		const index = markerLists[position] ? position : 0;
		const marker = markerLists[index];
		return {
			lat: marker?.lat,
			lng: marker?.lng,
		};
	}
	return {
		lat: 23.7806365,
		lng: 90.4193257,
	};
};
