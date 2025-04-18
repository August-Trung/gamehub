import React from "react";

interface GameTileProps {
	value: number;
	rowIndex: number;
	colIndex: number;
	isMerging: boolean;
	isNew: boolean;
}

const GameTile: React.FC<GameTileProps> = ({
	value,
	rowIndex,
	colIndex,
	isMerging,
	isNew,
}) => {
	const getTileColor = (value: number): string => {
		const colorMap: Record<number, string> = {
			0: "bg-gray-200",
			2: "bg-gray-100 text-gray-800",
			4: "bg-yellow-100 text-gray-800",
			8: "bg-yellow-200 text-gray-800",
			16: "bg-yellow-300 text-white",
			32: "bg-orange-300 text-white",
			64: "bg-orange-400 text-white",
			128: "bg-orange-500 text-white",
			256: "bg-red-400 text-white",
			512: "bg-red-500 text-white",
			1024: "bg-red-600 text-white",
			2048: "bg-yellow-500 text-white",
			4096: "bg-purple-500 text-white",
			8192: "bg-purple-600 text-white",
		};

		return colorMap[value] || "bg-purple-700 text-white";
	};

	const getFontSize = (value: number): string => {
		if (value >= 1000) return "text-lg";
		return "text-2xl";
	};

	return (
		<div
			className={`flex items-center justify-center rounded font-bold
        ${getTileColor(value)} ${getFontSize(value)}
        ${isMerging ? "animate-bounce" : ""}
        ${isNew ? "animate-pulse" : ""}`}
			style={{
				gridRow: rowIndex + 1,
				gridColumn: colIndex + 1,
			}}>
			{value}
		</div>
	);
};

export default GameTile;
