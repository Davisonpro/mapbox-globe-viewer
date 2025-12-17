/**
 * @fileoverview Cluster marker component for grouped markers
 * @module components/ClusterMarker
 */

import React from "react";
import { Marker as MapboxMarker } from "react-map-gl";
import "./ClusterMarker.css";

/**
 * ClusterMarker component for displaying a cluster of markers
 * @param {Object} props - Component props
 * @param {Object} props.cluster - Cluster object from supercluster
 * @param {number} props.pointCount - Number of points in cluster
 * @param {Function} props.onClick - Callback when cluster is clicked
 * @returns {JSX.Element} ClusterMarker component
 */
export const ClusterMarker = ({ cluster, pointCount, onClick }) => {
	const handleClick = (e) => {
		e.originalEvent.stopPropagation();
		onClick(cluster);
	};

	const getClusterSize = (count) => {
		if (count < 10) return 40;
		if (count < 100) return 50;
		return 60;
	};

	const size = getClusterSize(pointCount);
	const [longitude, latitude] = cluster.geometry.coordinates;

	return (
		<MapboxMarker
			longitude={longitude}
			latitude={latitude}
			anchor="center"
			onClick={handleClick}
		>
			<div
				className="cluster-marker"
				style={{ width: `${size}px`, height: `${size}px` }}
				role="button"
				tabIndex={0}
				aria-label={`Cluster of ${pointCount} visitors`}
			>
				<span className="cluster-count">{pointCount}</span>
			</div>
		</MapboxMarker>
	);
};

