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
	const fontSize =
		boardSize <= 10 ? "text-2xl" : boardSize <= 15 ? "text-xl" : "text-lg";

	return (
		<div
			className={`caro-cell cursor-pointer ${
				!value ? "caro-cell-empty" : ""
			}`}
			onClick={onClick}>
			{value && (
				<div
					className={`caro-marker ${fontSize} ${
						value === "X" ? "x" : "o"
					} ${isWinningCell ? "winning" : ""}`}>
					{value}
				</div>
			)}
		</div>
	);
};

export default Cell;
