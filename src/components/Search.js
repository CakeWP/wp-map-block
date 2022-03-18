import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import { Button, TextControl } from "@wordpress/components";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import PropTypes from "prop-types";

const propTypes = {};

const defaultProps = {};

export default function Search({ index, attributes, setAttributes }) {
	const [searchText, setSearchText] = useState("");
	const [isRequestSend, setIsRequestSend] = useState(false);
	const [locationSearchResults, setLocationSearchResutls] = useState([]);
	const setLatLngHandler = (index, lat, lng) => {
		const map_marker_list = attributes.map_marker_list.map((item, key) => {
			const returnValue = { ...item };
			if (index === key) {
				returnValue["lat"] = lat;
				returnValue["lng"] = lng;
			}
			return returnValue;
		});
		setAttributes({
			map_marker_list,
		});
		setLocationSearchResutls([]);
	};
	// Location Search
	const provider = new OpenStreetMapProvider();
	const onChangeSearchLocation = async (value) => {
		setIsRequestSend(true);
		const results = await provider.search({ query: value });
		setLocationSearchResutls(results.slice(0, 5));
		setIsRequestSend(false);
	};

	return (
		<React.Fragment>
			<div style={{ marginBottom: "10px" }}>
				<div className="ti-location-search">
					<TextControl
						placeholder={__("Enter address")}
						value={searchText}
						onChange={(value) => setSearchText(value)}
					/>
					<Button onClick={() => onChangeSearchLocation(searchText)}>
						{isRequestSend ? (
							<span className="dashicons dashicons-ellipsis"></span>
						) : (
							<span className="dashicons dashicons-search"></span>
						)}
					</Button>
					{locationSearchResults.length > 0 && (
						<ul className="ti-location-search-results">
							{locationSearchResults.map((searchItem, searchIndex) => (
								<li
									key={searchIndex}
									onClick={() => {
										setSearchText(searchItem.label);
										setLatLngHandler(
											index,
											searchItem.raw.lat,
											searchItem.raw.lon
										);
									}}
								>
									{searchItem.label}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</React.Fragment>
	);
}

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;
