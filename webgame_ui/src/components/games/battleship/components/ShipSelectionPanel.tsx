import React from "react";
import { Ship } from "../hooks/useBattleshipGame";

interface ShipSelectionPanelProps {
	ships: Ship[];
	selectedShip: Ship | null;
	onSelectShip: (ship: Ship) => void;
	onRotateShip: () => void;
}

const ShipSelectionPanel: React.FC<ShipSelectionPanelProps> = ({
	ships,
	selectedShip,
	onSelectShip,
	onRotateShip,
}) => {
	return (
		<div className="ship-selection-panel">
			<h3>Chọn tàu để đặt</h3>
			<div className="ships-list">
				{ships.map((ship) => (
					<div
						key={ship.id}
						className={`ship-item ${selectedShip?.id === ship.id ? "selected" : ""} ${ship.placed ? "placed" : ""}`}
						onClick={() => !ship.placed && onSelectShip(ship)}>
						<div className="ship-name">
							{ship.name} ({ship.size})
						</div>
						<div className="ship-visual">
							{Array.from({ length: ship.size }, (_, i) => (
								<div key={i} className="ship-segment"></div>
							))}
						</div>
						{ship.placed && <span className="placed-mark">✓</span>}
					</div>
				))}
			</div>
			{selectedShip && !selectedShip.placed && (
				<button onClick={onRotateShip} className="rotate-button">
					Xoay tàu ({selectedShip.isVertical ? "Dọc" : "Ngang"})
				</button>
			)}
			<div className="instructions">
				<p>Nhấp vào tàu để chọn, sau đó nhấp vào bảng để đặt.</p>
				<p>Nhấp vào "Xoay tàu" để thay đổi hướng.</p>
			</div>
		</div>
	);
};

export default ShipSelectionPanel;
