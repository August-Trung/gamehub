import React from "react";
import GameTile from "./GameTile";
import { TilePosition } from "../hooks/use2048Game";

interface GameBoardProps {
	board: number[][];
	mergePositions: TilePosition[];
	newTilePosition: TilePosition | null;
	handleTouchStart: (e: React.TouchEvent) => void;
	handleTouchMove: (e: React.TouchEvent) => void;
	handleTouchEnd: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
	board,
	mergePositions,
	newTilePosition,
	handleTouchStart,
	handleTouchMove,
	handleTouchEnd,
}) => {
	return (
		<div
			className="bg-gray-300 p-4 rounded-lg relative"
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}>
			{/* Grid background */}
			<div className="grid grid-cols-4 gap-2">
				{Array(16)
					.fill(null)
					.map((_, index) => (
						<div
							key={`cell-${index}`}
							className="aspect-square bg-gray-200 rounded"></div>
					))}
			</div>

			{/* Tiles */}
			<div className="absolute inset-0 p-4">
				<div className="relative grid grid-cols-4 grid-rows-4 gap-2 h-full w-full">
					{board.map((row, rowIndex) =>
						row.map(
							(value, colIndex) =>
								value !== 0 && (
									<GameTile
										key={`tile-${rowIndex}-${colIndex}`}
										value={value}
										rowIndex={rowIndex}
										colIndex={colIndex}
										isMerging={mergePositions.some(
											(pos) =>
												pos.row === rowIndex &&
												pos.col === colIndex
										)}
										isNew={
											newTilePosition &&
											newTilePosition.row === rowIndex &&
											newTilePosition.col === colIndex
										}
									/>
								)
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default GameBoard;
