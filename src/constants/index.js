/**
 * @fileoverview Application constants and configuration
 * @module constants
 */

/**
 * Mapbox access token from environment variable or fallback
 * @type {string}
 */
export const MAPBOX_TOKEN =
	import.meta.env.VITE_MAPBOX_TOKEN;

/**
 * Default map view state
 * @type {Object}
 */
export const DEFAULT_VIEW_STATE = {
	longitude: 0,
	latitude: 20,
	zoom: 2.5,
};

/**
 * Zoom level when a marker is selected
 * @type {number}
 */
export const MARKER_SELECTED_ZOOM = 3;

/**
 * Map style configurations
 * @type {Object<string, string>}
 */
export const MAP_STYLES = {
	OUTDOORS: "mapbox://styles/mapbox/outdoors-v12",
	SATELLITE: "mapbox://styles/mapbox/satellite-streets-v12",
	LIGHT: "mapbox://styles/mapbox/light-v11",
	DARK: "mapbox://styles/mapbox/dark-v11",
};

/**
 * Fog color configurations for different map styles
 * @type {Object<string, string>}
 */
export const FOG_COLORS = {
	outdoors: "#2d5016",
	satellite: "#87CEEB",
	light: "#5d689c",
	dark: "#242B4B",
};

/**
 * View mode types
 * @type {Object<string, string>}
 */
export const VIEW_MODES = {
	GLOBE: "globe",
	FLAT: "flat",
};

/**
 * Map style types
 * @type {Object<string, string>}
 */
export const MAP_STYLE_TYPES = {
	OUTDOORS: "outdoors",
	SATELLITE: "satellite",
	LIGHT: "light",
	DARK: "dark",
};

/**
 * Fog configuration for globe view
 * @type {Object}
 */
export const FOG_CONFIG = {
	range: [0.8, 8],
	"horizon-blend": 0.1,
};

/**
 * Popup configuration
 * @type {Object}
 */
export const POPUP_CONFIG = {
	anchor: "top-left",
	offset: [-40, -68],
	maxWidth: "500px",
	closeOnClick: false,
};

/**
 * Conversion score thresholds and colors
 * @type {Object}
 */
export const CONVERSION_SCORE = {
	HIGH_THRESHOLD: 80,
	MEDIUM_THRESHOLD: 50,
	HIGH_COLOR: "#34C759",
	MEDIUM_COLOR: "#FFD60A",
	LOW_COLOR: "#FF453A",
	OPACITY: "1F", // 12% opacity in hex
};

/**
 * Clustering configuration
 * @type {Object}
 */
export const CLUSTER_CONFIG = {
	RADIUS: 60,
	MAX_ZOOM: 14,
	MIN_ZOOM: 2,
};

/**
 * Maximum zoom level for cluster expansion
 * @type {number}
 */
export const CLUSTER_MAX_EXPANSION_ZOOM = 18;

