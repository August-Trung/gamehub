// components/TetrisBoard.tsx
import React from "react";
import TetrisCell from "./TetrisCell";
import { BoardType } from "../hooks/useTetrisGame";

interface TetrisBoardProps {
	board: BoardType;
}

const TetrisBoard: React.FC<TetrisBoardProps> = ({ board }) => {
	return (
		<div className="tetris-board">
			{board.map((row, rowIndex) => (
				<div key={rowIndex} className="board-row">
					{row.map((cell, colIndex) => (
						<TetrisCell
							key={`${rowIndex}-${colIndex}`}
							type={cell}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default TetrisBoard;
