import React from "react";
import { Ship } from "../hooks/useBattleshipGame";

interface ShipSelectionPanelProps {
	ships: Ship[];
	selectedShip: Ship | null;
	onSelectShip: (ship: Ship) => void;
	onRotateShip: () => void;
	onResetShip: (shipId: number) => void;
}

const ShipSelectionPanel: React.FC<ShipSelectionPanelProps> = ({
	ships,
	selectedShip,
	onSelectShip,
	onRotateShip,
	onResetShip,
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
						{ship.placed ? (
							<div className="ship-actions">
								<span className="placed-mark">✓</span>
								<button
									className="reset-ship-button"
									onClick={(e) => {
										e.stopPropagation();
										onResetShip(ship.id);
									}}>
									Đặt lại
								</button>
							</div>
						) : null}
					</div>
				))}
			</div>
			{selectedShip && !selectedShip.placed && (
				<button onClick={onRotateShip} className="rotate-button">
					<span>Xoay tàu</span>
					<span>({selectedShip.isVertical ? "Dọc" : "Ngang"})</span>
				</button>
			)}
			<div className="instructions">
				<p>1. Nhấp vào tàu để chọn, sau đó nhấp vào bảng để đặt.</p>
				<p>2. Nhấp vào "Xoay tàu" để thay đổi hướng.</p>
				<p>3. Nhấp vào "Đặt lại" để di chuyển tàu đã đặt.</p>
			</div>
		</div>
	);
};

export default ShipSelectionPanel;
