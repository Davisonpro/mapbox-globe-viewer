/**
 * @fileoverview View controls component for map view and style selection
 * @module components/ViewControls
 */

import React from "react";
import {
	FaGlobe,
	FaMap,
	FaMountain,
	FaSatellite,
	FaSun,
	FaMoon,
	FaCrosshairs,
} from "react-icons/fa";
import "./ViewControls.css";

/**
 * ViewControls component
 * @param {Object} props - Component props
 * @param {string} props.viewMode - Current view mode ('globe' or 'flat')
 * @param {Function} props.onViewModeChange - Callback when view mode changes
 * @param {string} props.mapStyle - Current map style
 * @param {Function} props.onMapStyleChange - Callback when map style changes
 * @param {Function} props.onResetView - Callback when reset view is clicked
 * @returns {JSX.Element} ViewControls component
 */
export const ViewControls = ({
	viewMode,
	onViewModeChange,
	mapStyle,
	onMapStyleChange,
	onResetView,
}) => {
	return (
		<div className="view-controls" role="toolbar" aria-label="Map view controls">
			<div className="control-group">
				<button
					className={`control-btn ${viewMode === "globe" ? "active" : ""}`}
					onClick={() => onViewModeChange("globe")}
					title="3D Globe View"
					aria-label="Switch to 3D globe view"
					type="button"
				>
					<FaGlobe aria-hidden="true" />
				</button>
				<button
					className={`control-btn ${viewMode === "flat" ? "active" : ""}`}
					onClick={() => onViewModeChange("flat")}
					title="2D Flat Map"
					aria-label="Switch to 2D flat map view"
					type="button"
				>
					<FaMap aria-hidden="true" />
				</button>
			</div>

			<div className="control-group">
				<button
					className={`control-btn ${mapStyle === "outdoors" ? "active" : ""}`}
					onClick={() => onMapStyleChange("outdoors")}
					title="Outdoors (Green)"
					aria-label="Switch to outdoors map style"
					type="button"
				>
					<FaMountain aria-hidden="true" />
				</button>
				<button
					className={`control-btn ${mapStyle === "satellite" ? "active" : ""}`}
					onClick={() => onMapStyleChange("satellite")}
					title="Satellite"
					aria-label="Switch to satellite map style"
					type="button"
				>
					<FaSatellite aria-hidden="true" />
				</button>
				<button
					className={`control-btn ${mapStyle === "light" ? "active" : ""}`}
					onClick={() => onMapStyleChange("light")}
					title="Light"
					aria-label="Switch to light map style"
					type="button"
				>
					<FaSun aria-hidden="true" />
				</button>
				<button
					className={`control-btn ${mapStyle === "dark" ? "active" : ""}`}
					onClick={() => onMapStyleChange("dark")}
					title="Dark"
					aria-label="Switch to dark map style"
					type="button"
				>
					<FaMoon aria-hidden="true" />
				</button>
			</div>

			<button
				className="control-btn reset-btn"
				onClick={onResetView}
				title="Reset View"
				aria-label="Reset map view to default"
				type="button"
			>
				<FaCrosshairs aria-hidden="true" />
			</button>
		</div>
	);
};

