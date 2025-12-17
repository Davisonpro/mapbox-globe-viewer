/**
 * @fileoverview Popup component for displaying visitor details
 * @module components/Popup
 */

import React from "react";
import { Popup as MapboxPopup } from "react-map-gl";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
	getConversionScoreColor,
	getConversionScoreBackgroundColor,
} from "../../utils/conversionScore";
import { POPUP_CONFIG } from "../../constants";
import "./Popup.css";

/**
 * Popup component for displaying visitor details
 * @param {Object} props - Component props
 * @param {Object} props.visitor - Visitor object to display
 * @param {Function} props.onClose - Callback when popup should close
 * @returns {JSX.Element|null} Popup component or null if no visitor
 */
export const Popup = ({ visitor, onClose }) => {
	if (!visitor) return null;

	const conversionScore = visitor.conversionLikelihood?.score;
	const scoreColor = conversionScore
		? getConversionScoreColor(conversionScore)
		: null;
	const scoreBgColor = conversionScore
		? getConversionScoreBackgroundColor(conversionScore)
		: null;

	const fullName = `${visitor.firstName || ""} ${visitor.lastName || ""}`.trim();

	return (
		<MapboxPopup
			anchor={POPUP_CONFIG.anchor}
			longitude={visitor.longitude}
			latitude={visitor.latitude}
			onClose={onClose}
			closeOnClick={POPUP_CONFIG.closeOnClick}
			offset={POPUP_CONFIG.offset}
			className="custom-popup"
			maxWidth={POPUP_CONFIG.maxWidth}
			closeButton={false}
		>
			<div className="popup-content">
				<button
					className="popup-close"
					onClick={onClose}
					aria-label="Close popup"
					type="button"
				>
					×
				</button>
				<div className="popup-header">
					<div className="popup-avatar">
						{visitor.profileImage ? (
							<img src={visitor.profileImage} alt={fullName} />
						) : (
							<div className="avatar-fallback">
								{visitor.firstName?.[0] || "?"}
							</div>
						)}
					</div>
					<div className="popup-info">
						<div className="popup-name-row">
							<h3>{fullName || "Unknown"}</h3>
							{visitor.isCustomer && (
								<span className="customer-tag">Customer</span>
							)}
						</div>
						{visitor.email && (
							<p className="popup-email">{visitor.email}</p>
						)}
						{visitor.city && visitor.country && (
							<p className="popup-location">
								<FaMapMarkerAlt className="location-icon" aria-hidden="true" />
								{visitor.city}, {visitor.country}
							</p>
						)}
					</div>
				</div>

				<div className="popup-details">
					{visitor.visitorId && (
						<div className="detail-row">
							<span className="detail-label">Visitor ID:</span>
							<span className="detail-value">{visitor.visitorId}</span>
						</div>
					)}

					{visitor.countryCode && (
						<div className="detail-row">
							<span className="detail-label">Country Code:</span>
							<span className="detail-value">{visitor.countryCode}</span>
						</div>
					)}

					{visitor.device?.type && (
						<div className="detail-row">
							<span className="detail-label">Device:</span>
							<span className="detail-value">{visitor.device.type}</span>
						</div>
					)}

					{visitor.browser?.name && (
						<div className="detail-row">
							<span className="detail-label">Browser:</span>
							<span className="detail-value">{visitor.browser.name}</span>
						</div>
					)}

					{visitor.os?.name && (
						<div className="detail-row">
							<span className="detail-label">OS:</span>
							<span className="detail-value">{visitor.os.name}</span>
						</div>
					)}

					{conversionScore !== undefined && (
						<div className="detail-row">
							<span className="detail-label">Conversion Score:</span>
							<span
								className="detail-value conversion-score"
								style={{
									backgroundColor: scoreBgColor,
									color: scoreColor,
								}}
							>
								{conversionScore}/100
							</span>
						</div>
					)}
				</div>
			</div>
		</MapboxPopup>
	);
};

