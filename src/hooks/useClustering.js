/**
 * @fileoverview Custom hook for marker clustering
 * @module hooks/useClustering
 */

import { useMemo } from "react";
import useSupercluster from "use-supercluster";
import { CLUSTER_CONFIG } from "../constants";

/**
 * Custom hook for clustering markers
 * @param {Array<Object>} visitors - Array of visitor objects
 * @param {Array<number>|null} bounds - Map bounds [west, south, east, north]
 * @param {number} zoom - Current zoom level
 * @returns {Object} Clustered points and supercluster instance
 */
export const useClustering = (visitors, bounds, zoom) => {
	const points = useMemo(() => {
		return visitors.map((visitor) => ({
			type: "Feature",
			properties: {
				cluster: false,
				visitorId: visitor.visitorId,
				visitor,
			},
			geometry: {
				type: "Point",
				coordinates: [visitor.longitude, visitor.latitude],
			},
		}));
	}, [visitors]);

	const { clusters, supercluster } = useSupercluster({
		points,
		bounds: bounds || undefined,
		zoom: zoom || CLUSTER_CONFIG.MIN_ZOOM,
		options: {
			radius: CLUSTER_CONFIG.RADIUS,
			maxZoom: CLUSTER_CONFIG.MAX_ZOOM,
		},
	});

	return { clusters, supercluster };
};

