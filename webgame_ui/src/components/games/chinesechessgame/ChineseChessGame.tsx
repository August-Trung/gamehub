import React, { useMemo } from "react";
import ChineseChessBoard from "./components/ChineseChessBoard";
import { useChineseChessGame } from "./hooks/useChineseChessGame";

const ChineseChessGame: React.FC = () => {
	const {
		pieces,
		currentPlayer,
		selectedPiece,
		gameOver,
		winner,
		inCheck,
		moveHistory,
		selectPiece,
		movePiece,
		getValidMoves,
		resetGame,
	} = useChineseChessGame();

	// Lấy các nước đi hợp lệ cho quân được chọn
	const validMoves = useMemo(() => {
		if (!selectedPiece) return [];
		return getValidMoves(selectedPiece);
	}, [selectedPiece, getValidMoves]);

	// Kiểm tra xem lượt cuối cùng có phải là chiếu tướng không
	const lastMoveWasCheck =
		moveHistory.length > 0 && moveHistory[moveHistory.length - 1].wasCheck;

	return (
		<div className="flex flex-col items-center p-2 sm:p-4 min-h-screen">
			<h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6">
				Cờ Tướng (Chinese Chess)
			</h1>

			<div className="w-full max-w-6xl">
				{/* Hiển thị lượt chơi và nút game mới ngang bàn cờ */}
				<div className="flex justify-between items-center mb-2 sm:mb-4 px-2 sm:px-4">
					<div className="text-base sm:text-lg font-semibold">
						Lượt:{" "}
						<span
							className={`font-bold text-lg sm:text-xl ${
								currentPlayer === "red"
									? "text-red-600"
									: "text-gray-800"
							}`}>
							{currentPlayer === "red" ? "Đỏ" : "Đen"}
						</span>
						{inCheck && !gameOver && (
							<span className="ml-2 px-2 py-1 bg-red-500 text-white rounded animate-pulse">
								CHIẾU!
							</span>
						)}
					</div>

					<button
						onClick={resetGame}
						className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base">
						Game mới
					</button>
				</div>

				{/* Thông báo game kết thúc */}
				{gameOver && (
					<div className="mb-2 sm:mb-4 p-2 sm:p-3 bg-yellow-100 border border-yellow-300 rounded">
						<p className="text-base sm:text-lg font-bold">
							Game kết thúc!{" "}
							{winner && (
								<span
									className={
										winner === "red"
											? "text-red-600"
											: "text-gray-800"
									}>
									{winner === "red" ? "Đỏ" : "Đen"}{" "}
									{lastMoveWasCheck
										? "chiến thắng bằng chiếu bí!"
										: "chiến thắng!"}
								</span>
							)}
						</p>
					</div>
				)}

				{/* Bàn cờ */}
				<div className="flex justify-center">
					<ChineseChessBoard
						pieces={pieces}
						selectedPiece={selectedPiece}
						validMoves={validMoves}
						onSelectPiece={selectPiece}
						onMovePiece={movePiece}
						currentPlayer={currentPlayer}
					/>
				</div>
			</div>
		</div>
	);
};

export default ChineseChessGame;
