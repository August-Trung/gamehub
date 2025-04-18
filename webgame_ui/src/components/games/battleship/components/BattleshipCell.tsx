import React from "react";
import { CellState } from "../hooks/useBattleshipGame";

interface BattleshipCellProps {
	state: CellState;
	onClick: () => void;
	showShip: boolean;
}

const BattleshipCell: React.FC<BattleshipCellProps> = ({
	state,
	onClick,
	showShip,
}) => {
	const getClassName = () => {
		let className = "battleship-cell";

		if (state.isHit) {
			className += " hit";
			if (state.hasShip) {
				className += " ship-hit";
			}
		} else if (state.isMiss) {
			className += " miss";
		} else if (showShip && state.hasShip) {
			className += " has-ship";
		}

		return className;
	};

	return (
		<div className={getClassName()} onClick={onClick}>
			{state.isHit && state.hasShip && "💥"}
			{state.isMiss && "•"}
		</div>
	);
};

export default BattleshipCell;
