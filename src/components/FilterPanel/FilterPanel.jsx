/**
 * @fileoverview Filter panel component for advanced filtering
 * @module components/FilterPanel
 */

import React from "react";
import { FaTimes } from "react-icons/fa";
import "./FilterPanel.css";

/**
 * FilterPanel component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the panel is open
 * @param {Function} props.onClose - Callback when panel should close
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onFilterChange - Callback when filter changes
 * @param {Function} props.onClearFilters - Callback when clear all is clicked
 * @param {Array<string>} props.uniqueCountries - Unique country options
 * @param {Array<string>} props.uniqueDevices - Unique device options
 * @param {Array<string>} props.uniqueCountryCodes - Unique country code options
 * @param {boolean} props.hasActiveFilters - Whether any filters are active
 * @param {number} props.filteredCount - Number of filtered results
 * @param {number} props.totalCount - Total number of visitors
 * @returns {JSX.Element|null} FilterPanel component or null if not open
 */
export const FilterPanel = ({
	isOpen,
	onClose,
	filters,
	onFilterChange,
	onClearFilters,
	uniqueCountries,
	uniqueDevices,
	uniqueCountryCodes,
	hasActiveFilters,
	filteredCount,
	totalCount,
}) => {
	if (!isOpen) return null;

	return (
		<div className="filter-panel" role="dialog" aria-label="Filter options">
			<div className="filter-header">
				<h3>Filters</h3>
				<div className="filter-header-actions">
					{hasActiveFilters && (
						<button
							className="clear-filters-btn"
							onClick={onClearFilters}
							type="button"
						>
							Clear All
						</button>
					)}
					<button
						className="filter-close-btn"
						onClick={onClose}
						aria-label="Close filters"
						title="Close filters"
						type="button"
					>
						<FaTimes aria-hidden="true" />
					</button>
				</div>
			</div>

			<div className="filter-grid">
				<div className="filter-item">
					<label htmlFor="country-filter">Country</label>
					<select
						id="country-filter"
						value={filters.country}
						onChange={(e) => onFilterChange("country", e.target.value)}
						className="filter-select"
					>
						<option value="">All Countries</option>
						{uniqueCountries.map((country) => (
							<option key={country} value={country}>
								{country}
							</option>
						))}
					</select>
				</div>

				<div className="filter-item">
					<label htmlFor="country-code-filter">Country Code</label>
					<select
						id="country-code-filter"
						value={filters.countryCode}
						onChange={(e) => onFilterChange("countryCode", e.target.value)}
						className="filter-select"
					>
						<option value="">All Codes</option>
						{uniqueCountryCodes.map((code) => (
							<option key={code} value={code}>
								{code}
							</option>
						))}
					</select>
				</div>

				<div className="filter-item">
					<label htmlFor="device-filter">Device</label>
					<select
						id="device-filter"
						value={filters.device}
						onChange={(e) => onFilterChange("device", e.target.value)}
						className="filter-select"
					>
						<option value="">All Devices</option>
						{uniqueDevices.map((device) => (
							<option key={device} value={device}>
								{device}
							</option>
						))}
					</select>
				</div>

				<div className="filter-item">
					<label htmlFor="type-filter">Type</label>
					<select
						id="type-filter"
						value={filters.customer}
						onChange={(e) => onFilterChange("customer", e.target.value)}
						className="filter-select"
					>
						<option value="">All</option>
						<option value="customer">Customers</option>
						<option value="visitor">Visitors</option>
					</select>
				</div>
			</div>

			{hasActiveFilters && (
				<div className="filter-results">
					Showing {filteredCount} of {totalCount} users
				</div>
			)}
		</div>
	);
};

