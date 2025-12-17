/**
 * @fileoverview Utility functions for conversion score calculations and styling
 * @module utils/conversionScore
 */

import { CONVERSION_SCORE } from "../constants";

/**
 * Gets the color for a conversion score based on thresholds
 * @param {number} score - The conversion score (0-100)
 * @returns {string} Hex color code
 */
export const getConversionScoreColor = (score) => {
	if (score >= CONVERSION_SCORE.HIGH_THRESHOLD) {
		return CONVERSION_SCORE.HIGH_COLOR;
	}
	if (score >= CONVERSION_SCORE.MEDIUM_THRESHOLD) {
		return CONVERSION_SCORE.MEDIUM_COLOR;
	}
	return CONVERSION_SCORE.LOW_COLOR;
};

/**
 * Gets the background color with opacity for a conversion score
 * @param {number} score - The conversion score (0-100)
 * @returns {string} Hex color code with opacity
 */
export const getConversionScoreBackgroundColor = (score) => {
	const color = getConversionScoreColor(score);
	return `${color}${CONVERSION_SCORE.OPACITY}`;
};

