/**
 * @fileoverview Custom hook for filtering visitors
 * @module hooks/useVisitorFilters
 */

import { useMemo } from "react";
import {
	filterVisitors,
	getUniqueValues,
} from "../utils/visitorFilters";

/**
 * Custom hook for managing visitor filtering
 * @param {Array<Object>} visitors - Array of all visitors
 * @param {string} searchQuery - Current search query
 * @param {Object} filters - Current filter state
 * @returns {Object} Filtered visitors and unique filter values
 */
export const useVisitorFilters = (visitors, searchQuery, filters) => {
	/**
	 * Filtered visitors based on search and filters
	 */
	const filteredVisitors = useMemo(() => {
		return filterVisitors(visitors, searchQuery, filters);
	}, [visitors, searchQuery, filters]);

	/**
	 * Unique countries for filter dropdown
	 */
	const uniqueCountries = useMemo(() => {
		return getUniqueValues(visitors, "country");
	}, [visitors]);

	/**
	 * Unique devices for filter dropdown
	 */
	const uniqueDevices = useMemo(() => {
		return getUniqueValues(visitors, (visitor) => visitor.device?.type);
	}, [visitors]);

	/**
	 * Unique country codes for filter dropdown
	 */
	const uniqueCountryCodes = useMemo(() => {
		return getUniqueValues(visitors, "countryCode");
	}, [visitors]);

	/**
	 * Checks if any filters are currently active
	 */
	const hasActiveFilters = useMemo(() => {
		return !!(
			searchQuery ||
			filters.country ||
			filters.device ||
			filters.customer ||
			filters.countryCode
		);
	}, [searchQuery, filters]);

	return {
		filteredVisitors,
		uniqueCountries,
		uniqueDevices,
		uniqueCountryCodes,
		hasActiveFilters,
	};
};

