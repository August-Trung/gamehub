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
	isPaused?: boolean; // Thêm prop cho trạng thái tạm dừng
}

const GameBoard: React.FC<GameBoardProps> = ({
	board,
	mergePositions,
	newTilePosition,
	handleTouchStart,
	handleTouchMove,
	handleTouchEnd,
	isPaused = false,
}) => {
	// Thêm các hàm xử lý ngăn chặn sự kiện mặc định
	const handleTouchStartPrevent = (e: React.TouchEvent) => {
		e.preventDefault();
		handleTouchStart(e);
	};

	const handleTouchMovePrevent = (e: React.TouchEvent) => {
		e.preventDefault();
		handleTouchMove(e);
	};

	return (
		<div
			className="bg-gray-300 p-4 rounded-lg relative"
			onTouchStart={handleTouchStartPrevent}
			onTouchMove={handleTouchMovePrevent}
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
											!!(
												newTilePosition &&
												newTilePosition.row ===
													rowIndex &&
												newTilePosition.col === colIndex
											)
										}
									/>
								)
						)
					)}
				</div>
			</div>

			{/* Overlay khi tạm dừng */}
			{isPaused && (
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="text-white text-2xl font-bold">
						TẠM DỪNG
					</div>
				</div>
			)}
		</div>
	);
};

export default GameBoard;
