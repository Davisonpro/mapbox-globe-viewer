/**
 * @fileoverview Utility functions for filtering visitors
 * @module utils/visitorFilters
 */

/**
 * Checks if a visitor matches the search query
 * @param {Object} visitor - The visitor object to check
 * @param {string} searchQuery - The search query string
 * @returns {boolean} True if visitor matches search query
 */
export const matchesSearchQuery = (visitor, searchQuery) => {
	if (!searchQuery) return true;

	const query = searchQuery.toLowerCase();
	return (
		visitor.firstName?.toLowerCase().includes(query) ||
		visitor.lastName?.toLowerCase().includes(query) ||
		visitor.email?.toLowerCase().includes(query) ||
		visitor.city?.toLowerCase().includes(query) ||
		visitor.country?.toLowerCase().includes(query)
	);
};

/**
 * Checks if a visitor matches the country filter
 * @param {Object} visitor - The visitor object to check
 * @param {string} countryFilter - The country filter value
 * @returns {boolean} True if visitor matches country filter
 */
export const matchesCountryFilter = (visitor, countryFilter) => {
	if (!countryFilter) return true;
	return visitor.country?.toLowerCase() === countryFilter.toLowerCase();
};

/**
 * Checks if a visitor matches the device filter
 * @param {Object} visitor - The visitor object to check
 * @param {string} deviceFilter - The device filter value
 * @returns {boolean} True if visitor matches device filter
 */
export const matchesDeviceFilter = (visitor, deviceFilter) => {
	if (!deviceFilter) return true;
	return visitor.device?.type?.toLowerCase() === deviceFilter.toLowerCase();
};

/**
 * Checks if a visitor matches the customer filter
 * @param {Object} visitor - The visitor object to check
 * @param {string} customerFilter - The customer filter value ('customer', 'visitor', or '')
 * @returns {boolean} True if visitor matches customer filter
 */
export const matchesCustomerFilter = (visitor, customerFilter) => {
	if (customerFilter === "") return true;
	if (customerFilter === "customer") return visitor.isCustomer === true;
	if (customerFilter === "visitor") return visitor.isCustomer === false;
	return true;
};

/**
 * Checks if a visitor matches the country code filter
 * @param {Object} visitor - The visitor object to check
 * @param {string} countryCodeFilter - The country code filter value
 * @returns {boolean} True if visitor matches country code filter
 */
export const matchesCountryCodeFilter = (visitor, countryCodeFilter) => {
	if (!countryCodeFilter) return true;
	return visitor.countryCode?.toLowerCase() === countryCodeFilter.toLowerCase();
};

/**
 * Filters visitors based on search query and all filter criteria
 * @param {Array<Object>} visitors - Array of visitor objects
 * @param {string} searchQuery - Search query string
 * @param {Object} filters - Filter object with country, device, customer, countryCode
 * @returns {Array<Object>} Filtered array of visitors
 */
export const filterVisitors = (visitors, searchQuery, filters) => {
	return visitors.filter((visitor) => {
		return (
			matchesSearchQuery(visitor, searchQuery) &&
			matchesCountryFilter(visitor, filters.country) &&
			matchesDeviceFilter(visitor, filters.device) &&
			matchesCustomerFilter(visitor, filters.customer) &&
			matchesCountryCodeFilter(visitor, filters.countryCode)
		);
	});
};

/**
 * Extracts unique values from visitor array for a given field
 * @param {Array<Object>} visitors - Array of visitor objects
 * @param {string|Function} fieldAccessor - Field name or function to access field value
 * @returns {Array<string>} Sorted array of unique values
 */
export const getUniqueValues = (visitors, fieldAccessor) => {
	const getValue = typeof fieldAccessor === "function"
		? fieldAccessor
		: (visitor) => visitor[fieldAccessor];

	const values = visitors
		.map(getValue)
		.filter(Boolean)
		.filter((value, index, self) => self.indexOf(value) === index);

	return values.sort();
};

