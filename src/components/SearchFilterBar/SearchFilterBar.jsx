/**
 * @fileoverview Search and filter bar container component
 * @module components/SearchFilterBar
 */

import React from "react";
import { FaFilter } from "react-icons/fa";
import { SearchBar } from "../SearchBar/SearchBar";
import "./SearchFilterBar.css";

/**
 * SearchFilterBar component
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Callback when search changes
 * @param {Function} props.onClearSearch - Callback when search is cleared
 * @param {boolean} props.showFilters - Whether filter panel should be shown
 * @param {Function} props.onToggleFilters - Callback to toggle filter panel
 * @param {boolean} props.hasActiveFilters - Whether any filters are active
 * @returns {JSX.Element} SearchFilterBar component
 */
export const SearchFilterBar = ({
	searchQuery,
	onSearchChange,
	onClearSearch,
	showFilters,
	onToggleFilters,
	hasActiveFilters,
}) => {
	return (
		<div className="search-filter-bar">
			<SearchBar
				searchQuery={searchQuery}
				onSearchChange={onSearchChange}
				onClearSearch={onClearSearch}
			/>
			<button
				className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
				onClick={onToggleFilters}
				title="Toggle filters"
				aria-label="Toggle filter panel"
				type="button"
			>
				<FaFilter aria-hidden="true" />
				{hasActiveFilters && (
					<span className="filter-badge" aria-label="Active filters" />
				)}
			</button>
		</div>
	);
};

