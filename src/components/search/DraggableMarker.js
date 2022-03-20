import { useCallback, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const propTypes = {};

const defaultProps = {};

export default function DraggableMarker({ setLatLngHandler, center }) {
	const markerRef = useRef(null);
	const eventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = markerRef.current;
				if (marker != null) {
					const { lat, lng } = marker.getLatLng();
					setLatLngHandler(lat, lng);
				}
			},
		}),
		[]
	);

	return (
		<Marker
			draggable={true}
			eventHandlers={eventHandlers}
			position={center}
			ref={markerRef}
		></Marker>
	);
}

DraggableMarker.propTypes = propTypes;
DraggableMarker.defaultProps = defaultProps;
