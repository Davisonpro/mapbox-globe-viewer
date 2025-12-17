/**
 * @fileoverview Marker component for displaying visitor markers on the map
 * @module components/Marker
 */

import React from "react";
import { Marker as MapboxMarker } from "react-map-gl";
import "./Marker.css";

/**
 * Marker component for displaying a visitor on the map
 * @param {Object} props - Component props
 * @param {Object} props.visitor - Visitor object with location and profile data
 * @param {boolean} props.isSelected - Whether this marker is currently selected
 * @param {Function} props.onClick - Callback when marker is clicked
 * @returns {JSX.Element} Marker component
 */
export const Marker = ({ visitor, isSelected, onClick }) => {
	const handleClick = (e) => {
		e.originalEvent.stopPropagation();
		onClick(visitor);
	};

	const fullName = `${visitor.firstName || ""} ${visitor.lastName || ""}`.trim();

	return (
		<MapboxMarker
			longitude={visitor.longitude}
			latitude={visitor.latitude}
			anchor="bottom"
			onClick={handleClick}
		>
			<div
				className={`marker-container ${isSelected ? "selected" : ""}`}
				role="button"
				tabIndex={0}
				aria-label={fullName || "Visitor"}
			>
				<div className="marker-avatar">
					{visitor.profileImage ? (
						<img
							src={visitor.profileImage}
							alt={fullName || "Visitor"}
							className="avatar-image"
						/>
					) : (
						<div className="avatar-fallback">
							{visitor.firstName?.[0] || "?"}
						</div>
					)}
				</div>
				{visitor.isCustomer && (
					<div className="customer-badge" title="Customer" aria-label="Customer">
						✓
					</div>
				)}
			</div>
		</MapboxMarker>
	);
};

