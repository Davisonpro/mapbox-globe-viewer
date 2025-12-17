/**
 * @fileoverview Main application component for the Mapbox Globe Viewer
 * @module App
 */

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import Map from "react-map-gl";
import { sampleVisitors } from "./sampleData";
import { SearchFilterBar } from "./components/SearchFilterBar/SearchFilterBar";
import { FilterPanel } from "./components/FilterPanel/FilterPanel";
import { ViewControls } from "./components/ViewControls/ViewControls";
import { Marker } from "./components/Marker/Marker";
import { ClusterMarker } from "./components/ClusterMarker/ClusterMarker";
import { Popup } from "./components/Popup/Popup";
import { useMapConfig } from "./hooks/useMapConfig";
import { useVisitorFilters } from "./hooks/useVisitorFilters";
import { useClustering } from "./hooks/useClustering";
import {
	MAPBOX_TOKEN,
	DEFAULT_VIEW_STATE,
	VIEW_MODES,
	MAP_STYLE_TYPES,
	FOG_CONFIG,
	MARKER_SELECTED_ZOOM,
	CLUSTER_MAX_EXPANSION_ZOOM,
} from "./constants";
import "./App.css";

/**
 * Main App component
 * @returns {JSX.Element} App component
 */
function App() {
	const mapRef = useRef(null);
	const [selectedMarker, setSelectedMarker] = useState(null);
	const [viewState, setViewState] = useState(DEFAULT_VIEW_STATE);
	const [viewMode, setViewMode] = useState(VIEW_MODES.GLOBE);
	const [mapStyle, setMapStyle] = useState(MAP_STYLE_TYPES.OUTDOORS);
	const [searchQuery, setSearchQuery] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState({
		country: "",
		device: "",
		customer: "",
		countryCode: "",
	});

	const { getMapStyleUrl, getFogColor } = useMapConfig(mapStyle);
	const {
		filteredVisitors,
		uniqueCountries,
		uniqueDevices,
		uniqueCountryCodes,
		hasActiveFilters,
	} = useVisitorFilters(sampleVisitors, searchQuery, filters);

	// Get map bounds for clustering
	const bounds = useMemo(() => {
		if (!mapRef.current?.getMap) return null;
		try {
			const map = mapRef.current.getMap();
			if (!map || !map.getBounds) return null;
			const mapBounds = map.getBounds();
			const ne = mapBounds.getNorthEast();
			const sw = mapBounds.getSouthWest();
			return [sw.lng, sw.lat, ne.lng, ne.lat];
		} catch (error) {
			return null;
		}
	}, [viewState.longitude, viewState.latitude, viewState.zoom]);

	// Use clustering
	const { clusters, supercluster } = useClustering(
		filteredVisitors,
		bounds,
		Math.floor(viewState.zoom)
	);

	// Apply dark mode based on map style
	useEffect(() => {
		const appElement = document.querySelector(".app");
		if (mapStyle === MAP_STYLE_TYPES.DARK) {
			appElement?.classList.add("dark");
		} else {
			appElement?.classList.remove("dark");
		}
	}, [mapStyle]);

	/**
	 * Handles marker click event
	 * @param {Object} visitor - The clicked visitor object
	 */
	const handleMarkerClick = useCallback(
		(visitor) => {
			// Set selected marker
			setSelectedMarker({
				id: visitor.visitorId,
				...visitor,
			});

			// Zoom to marker location
			if (mapRef.current) {
				mapRef.current.flyTo({
					center: [visitor.longitude, visitor.latitude],
					zoom: MARKER_SELECTED_ZOOM,
					duration: 1000,
					essential: true,
				});
			}
		},
		[]
	);

	/**
	 * Handles cluster click event
	 * @param {Object} cluster - The clicked cluster object
	 */
	const handleClusterClick = useCallback(
		(cluster) => {
			if (!supercluster || !mapRef.current) return;

			const expansionZoom = Math.min(
				supercluster.getClusterExpansionZoom(cluster.id) + 1,
				CLUSTER_MAX_EXPANSION_ZOOM
			);

			mapRef.current.flyTo({
				center: [
					cluster.geometry.coordinates[0],
					cluster.geometry.coordinates[1],
				],
				zoom: expansionZoom,
				duration: 500,
				essential: true,
			});
		},
		[supercluster]
	);

	/**
	 * Closes the popup
	 */
	const closePopup = useCallback(() => {
		setSelectedMarker(null);
	}, []);

	/**
	 * Resets the map view to default position
	 */
	const resetView = useCallback(() => {
		if (mapRef.current) {
			mapRef.current.flyTo({
				center: [DEFAULT_VIEW_STATE.longitude, DEFAULT_VIEW_STATE.latitude],
				zoom: DEFAULT_VIEW_STATE.zoom,
				duration: 1500,
				essential: true,
			});
		}
		setSelectedMarker(null);
	}, []);

	/**
	 * Clears all filters and search query
	 */
	const clearFilters = useCallback(() => {
		setSearchQuery("");
		setFilters({
			country: "",
			device: "",
			customer: "",
			countryCode: "",
		});
	}, []);

	/**
	 * Handles filter change
	 * @param {string} key - Filter key
	 * @param {string} value - Filter value
	 */
	const handleFilterChange = useCallback((key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
		}));
	}, []);

	/**
	 * Handles map click to close popup
	 */
	const handleMapClick = useCallback(() => {
		if (selectedMarker) {
			closePopup();
		}
	}, [selectedMarker, closePopup]);

	return (
		<div className="app">
			<SearchFilterBar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onClearSearch={() => setSearchQuery("")}
				showFilters={showFilters}
				onToggleFilters={() => setShowFilters((prev) => !prev)}
				hasActiveFilters={hasActiveFilters}
			/>

			<FilterPanel
				isOpen={showFilters}
				onClose={() => setShowFilters(false)}
				filters={filters}
				onFilterChange={handleFilterChange}
				onClearFilters={clearFilters}
				uniqueCountries={uniqueCountries}
				uniqueDevices={uniqueDevices}
				uniqueCountryCodes={uniqueCountryCodes}
				hasActiveFilters={hasActiveFilters}
				filteredCount={filteredVisitors.length}
				totalCount={sampleVisitors.length}
			/>

			<ViewControls
				viewMode={viewMode}
				onViewModeChange={setViewMode}
				mapStyle={mapStyle}
				onMapStyleChange={setMapStyle}
				onResetView={resetView}
			/>

			<Map
				ref={mapRef}
				{...viewState}
				onMove={(e) => setViewState(e.viewState)}
				onLoad={() => {
					setViewState((prev) => ({ ...prev }));
				}}
				mapboxAccessToken={MAPBOX_TOKEN}
				mapStyle={getMapStyleUrl()}
				projection={viewMode === VIEW_MODES.GLOBE ? "globe" : "mercator"}
				style={{ width: "100%", height: "100%" }}
				fog={
					viewMode === VIEW_MODES.GLOBE
						? {
								...FOG_CONFIG,
								color: getFogColor(),
						  }
						: undefined
				}
				onClick={handleMapClick}
			>
				{clusters.map((cluster) => {
					const { cluster: isCluster, point_count } = cluster.properties;

					if (isCluster) {
						return (
							<ClusterMarker
								key={`cluster-${cluster.id}`}
								cluster={cluster}
								pointCount={point_count}
								onClick={handleClusterClick}
							/>
						);
					}

					const visitor = cluster.properties.visitor;
					return (
						<Marker
							key={visitor.visitorId}
							visitor={visitor}
							isSelected={selectedMarker?.id === visitor.visitorId}
							onClick={handleMarkerClick}
						/>
					);
				})}

				<Popup visitor={selectedMarker} onClose={closePopup} />
			</Map>
		</div>
	);
}

export default App;
