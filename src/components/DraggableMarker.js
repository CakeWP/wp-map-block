import { useCallback, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const center = {
	lat: 51.505,
	lng: -0.09,
};

const propTypes = {};

const defaultProps = {};

export default function DraggableMarker(props) {
	const [position, setPosition] = useState(center);
	const markerRef = useRef(null);
	const eventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = markerRef.current;
				if (marker != null) {
					console.log(marker.getLatLng());
					setPosition(marker.getLatLng());
				}
			},
		}),
		[]
	);

	return (
		<Marker
			draggable={true}
			eventHandlers={eventHandlers}
			position={position}
			ref={markerRef}
		></Marker>
	);
}

DraggableMarker.propTypes = propTypes;
DraggableMarker.defaultProps = defaultProps;
