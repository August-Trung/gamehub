import React from "react";

interface CellProps {
	value: string;
	isWinningCell: boolean;
	onClick: () => void;
	boardSize: number;
}

const Cell: React.FC<CellProps> = ({
	value,
	isWinningCell,
	onClick,
	boardSize,
}) => {
	// Determine cell styling
	let cellStyle =
		"w-full h-full flex items-center justify-center border border-amber-800 relative";

	// Add hover effect only for empty cells
	if (!value) {
		cellStyle += " hover:bg-amber-200";
	}

	// Adjust font size based on board size
	const fontSize =
		boardSize <= 10 ? "text-xl" : boardSize <= 15 ? "text-lg" : "text-base";

	return (
		<div className={`${cellStyle} cursor-pointer`} onClick={onClick}>
			{value && (
				<div
					className={`${fontSize} font-bold ${value === "X" ? "text-blue-600" : "text-red-600"} ${isWinningCell ? "animate-pulse" : ""}`}>
					{value}
				</div>
			)}
		</div>
	);
};

export default Cell;
