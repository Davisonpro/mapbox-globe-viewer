/**
 * @fileoverview Search bar component for filtering visitors
 * @module components/SearchBar
 */

import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "./SearchBar.css";

/**
 * SearchBar component
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - Current search query value
 * @param {Function} props.onSearchChange - Callback when search query changes
 * @param {Function} props.onClearSearch - Callback when clear button is clicked
 * @returns {JSX.Element} SearchBar component
 */
export const SearchBar = ({ searchQuery, onSearchChange, onClearSearch }) => {
	return (
		<div className="search-container">
			<FaSearch className="search-icon" aria-hidden="true" />
			<input
				type="text"
				className="search-input"
				placeholder="Search by name, email, or location..."
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				aria-label="Search visitors"
			/>
			{searchQuery && (
				<button
					className="clear-search-btn"
					onClick={onClearSearch}
					aria-label="Clear search"
					type="button"
				>
					<FaTimes aria-hidden="true" />
				</button>
			)}
		</div>
	);
};

