import React from "react";
import BattleshipCell from "./BattleshipCell";
import { BoardType } from "../hooks/useBattleshipGame";

interface BattleshipBoardProps {
	board: BoardType;
	onClick: (x: number, y: number) => void;
	showShips: boolean;
}

const BattleshipBoard: React.FC<BattleshipBoardProps> = ({
	board,
	onClick,
	showShips,
}) => {
	return (
		<div className="battleship-board">
			<div className="board-headers">
				<div className="corner"></div>
				{Array.from({ length: 10 }, (_, i) => (
					<div key={i} className="column-header">
						{String.fromCharCode(65 + i)}
					</div>
				))}
			</div>

			{board.map((row, y) => (
				<div key={y} className="board-row">
					<div className="row-header">{y + 1}</div>
					{row.map((cell, x) => (
						<BattleshipCell
							key={`${x}-${y}`}
							state={cell}
							onClick={() => onClick(x, y)}
							showShip={showShips}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default BattleshipBoard;
