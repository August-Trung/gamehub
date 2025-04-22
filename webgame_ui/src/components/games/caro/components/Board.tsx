import React from "react";
import Cell from "./Cell";

interface BoardProps {
	board: string[][];
	winningLine: [number, number][] | null;
	onCellClick: (row: number, col: number) => void;
	boardSize: number;
}

const Board: React.FC<BoardProps> = ({
	board,
	winningLine,
	onCellClick,
	boardSize,
}) => {
	// Calculate container width based on viewport
	// Use responsive sizing that scales down on smaller screens
	const containerSize = Math.min(window.innerWidth - 32, 600);

	// Calculate cell size dynamically based on container size and board size
	const cellSize = Math.floor(containerSize / boardSize);

	return (
		<div
			className="grid gap-0 bg-amber-100 border border-amber-800"
			style={{
				gridTemplateColumns: `repeat(${board[0].length}, ${cellSize}px)`,
				gridTemplateRows: `repeat(${board.length}, ${cellSize}px)`,
			}}>
			{board.map((row, rowIndex) =>
				row.map((cell, colIndex) => {
					// Check if this cell is part of the winning line
					const isWinningCell = winningLine?.some(
						([winRow, winCol]) =>
							winRow === rowIndex && winCol === colIndex
					);

					return (
						<Cell
							key={`${rowIndex}-${colIndex}`}
							value={cell}
							isWinningCell={isWinningCell ?? false}
							onClick={() => onCellClick(rowIndex, colIndex)}
							boardSize={boardSize}
						/>
					);
				})
			)}
		</div>
	);
};

export default Board;
