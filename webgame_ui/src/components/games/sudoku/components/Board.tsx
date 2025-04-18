import React from "react";
import Cell from "./Cell";

interface BoardProps {
	board: Array<
		Array<{
			value: number | null;
			isFixed: boolean;
			isValid: boolean;
			notes: number[];
		}>
	>;
	selectedCell: { row: number; col: number } | null;
	setSelectedCell: (cell: { row: number; col: number } | null) => void;
	handleCellValueChange: (
		row: number,
		col: number,
		value: number | null
	) => void;
}

const Board: React.FC<BoardProps> = ({
	board,
	selectedCell,
	setSelectedCell,
	handleCellValueChange,
}) => {
	return (
		<div className="w-full aspect-square grid grid-cols-9 grid-rows-9 gap-0 border-2 border-black">
			{board.map((row, rowIndex) =>
				row.map((cell, colIndex) => {
					// Determine border styles based on position
					let borderClasses = "border border-gray-300";

					// Add thicker borders for 3x3 box divisions
					if (rowIndex % 3 === 0)
						borderClasses += " border-t-2 border-t-black";
					if (colIndex % 3 === 0)
						borderClasses += " border-l-2 border-l-black";
					if (rowIndex === 8)
						borderClasses += " border-b-2 border-b-black";
					if (colIndex === 8)
						borderClasses += " border-r-2 border-r-black";

					// Determine if cell is selected
					const isSelected =
						selectedCell?.row === rowIndex &&
						selectedCell?.col === colIndex;

					// Determine if cell is in the same row, column, or box as the selected cell
					const isInSameRow = selectedCell?.row === rowIndex;
					const isInSameCol = selectedCell?.col === colIndex;
					const isInSameBox =
						Math.floor(rowIndex / 3) ===
							Math.floor(selectedCell?.row ?? -1 / 3) &&
						Math.floor(colIndex / 3) ===
							Math.floor(selectedCell?.col ?? -1 / 3);

					// Determine if cell has the same value as the selected cell
					const hasSameValue =
						cell.value !== null &&
						selectedCell &&
						board[selectedCell.row][selectedCell.col].value ===
							cell.value &&
						board[selectedCell.row][selectedCell.col].value !==
							null;

					return (
						<Cell
							key={`${rowIndex}-${colIndex}`}
							value={cell.value}
							isFixed={cell.isFixed}
							isValid={cell.isValid}
							notes={cell.notes}
							isSelected={isSelected}
							isRelated={
								isInSameRow || isInSameCol || isInSameBox
							}
							hasSameValue={hasSameValue ?? false}
							borderClasses={borderClasses}
							onClick={() =>
								setSelectedCell({
									row: rowIndex,
									col: colIndex,
								})
							}
							onChange={(value) =>
								handleCellValueChange(rowIndex, colIndex, value)
							}
						/>
					);
				})
			)}
		</div>
	);
};

export default Board;
