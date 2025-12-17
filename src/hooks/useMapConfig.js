/**
 * @fileoverview Custom hook for map configuration
 * @module hooks/useMapConfig
 */

import { useCallback } from "react";
import { MAP_STYLES, FOG_COLORS, MAP_STYLE_TYPES } from "../constants";

/**
 * Custom hook for managing map style and fog configuration
 * @param {string} mapStyle - Current map style type
 * @returns {Object} Map configuration utilities
 */
export const useMapConfig = (mapStyle) => {
	/**
	 * Gets the Mapbox style URL for the current map style
	 * @returns {string} Mapbox style URL
	 */
	const getMapStyleUrl = useCallback(() => {
		const styleMap = {
			[MAP_STYLE_TYPES.OUTDOORS]: MAP_STYLES.OUTDOORS,
			[MAP_STYLE_TYPES.SATELLITE]: MAP_STYLES.SATELLITE,
			[MAP_STYLE_TYPES.LIGHT]: MAP_STYLES.LIGHT,
			[MAP_STYLE_TYPES.DARK]: MAP_STYLES.DARK,
		};
		return styleMap[mapStyle] || MAP_STYLES.OUTDOORS;
	}, [mapStyle]);

	/**
	 * Gets the fog color for the current map style
	 * @returns {string} Hex color code
	 */
	const getFogColor = useCallback(() => {
		return FOG_COLORS[mapStyle] || FOG_COLORS.outdoors;
	}, [mapStyle]);

	return {
		getMapStyleUrl,
		getFogColor,
	};
};

