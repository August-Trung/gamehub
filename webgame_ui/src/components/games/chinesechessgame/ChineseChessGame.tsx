import React, { useMemo, useState } from "react";
import ChineseChessBoard from "./components/ChineseChessBoard";
import {
	useChineseChessGame,
	GameMode,
	AILevel,
} from "./hooks/useChineseChessGame";
import {
	showSuccessToast,
	showWarningToast,
} from "@/components/ToastComponents";

const ChineseChessGame: React.FC = () => {
	const [gameMode, setGameMode] = useState<GameMode>("pvp");
	const [aiLevel, setAILevel] = useState<AILevel>("medium");

	const {
		pieces,
		currentPlayer,
		selectedPiece,
		gameOver,
		winner,
		inCheck,
		moveHistory,
		isAIThinking,
		lastAIMove,
		selectPiece,
		movePiece,
		getValidMoves,
		resetGame,
		changeGameMode,
		changeAILevel,
	} = useChineseChessGame(gameMode, aiLevel);

	// Lấy các nước đi hợp lệ cho quân được chọn
	const validMoves = useMemo(() => {
		if (!selectedPiece) return [];
		return getValidMoves(selectedPiece);
	}, [selectedPiece, getValidMoves]);

	// Kiểm tra xem lượt cuối cùng có phải là chiếu tướng không
	const lastMoveWasCheck =
		moveHistory.length > 0 && moveHistory[moveHistory.length - 1].wasCheck;

	// Xử lý thay đổi chế độ chơi
	const handleGameModeChange = (mode: GameMode) => {
		setGameMode(mode);
		changeGameMode(mode);
		resetGame();

		if (mode === "pve") {
			showWarningToast(
				"Chế độ Người - Máy đang trong quá trình phát triển. Một số tính năng có thể chưa hoạt động hoàn toàn."
			);
		} else {
			showSuccessToast("Đổi chế độ chơi sang Người - Người");
		}
	};

	// Xử lý thay đổi độ khó AI
	const handleAILevelChange = (level: AILevel) => {
		setAILevel(level);
		changeAILevel(level);
		const label =
			level === "easy" ? "Dễ" : level === "medium" ? "Trung bình" : "Khó";
		showSuccessToast(`Đổi độ khó sang ${label}`);
	};

	return (
		<div className="flex flex-col items-center p-2 sm:p-4 min-h-screen">
			<h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6">
				Cờ Tướng (Chinese Chess)
			</h1>

			<div className="w-full max-w-6xl">
				{/* Game mode selection - Improved mobile layout */}
				<div className="flex flex-col sm:flex-row justify-center mb-4 gap-2">
					<div className="flex flex-col sm:flex-row items-center gap-2">
						<div className="font-medium text-sm sm:text-base">
							Chế độ chơi:
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => handleGameModeChange("pvp")}
								className={`px-3 py-1 rounded text-sm sm:text-base ${
									gameMode === "pvp"
										? "bg-blue-500 text-white"
										: "bg-gray-200 hover:bg-gray-300"
								}`}>
								Người - Người
							</button>
							<button
								onClick={() => handleGameModeChange("pve")}
								className={`px-3 py-1 rounded text-sm sm:text-base ${
									gameMode === "pve"
										? "bg-blue-500 text-white"
										: "bg-gray-200 hover:bg-gray-300"
								}`}>
								Người - Máy
							</button>
						</div>
					</div>

					{gameMode === "pve" && (
						<div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0 sm:ml-4">
							<div className="font-medium text-sm sm:text-base">
								Độ khó:
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => handleAILevelChange("easy")}
									className={`px-3 py-1 rounded text-sm sm:text-base ${
										aiLevel === "easy"
											? "bg-green-500 text-white"
											: "bg-gray-200 hover:bg-gray-300"
									}`}>
									Dễ
								</button>
								<button
									onClick={() =>
										handleAILevelChange("medium")
									}
									className={`px-3 py-1 rounded text-sm sm:text-base ${
										aiLevel === "medium"
											? "bg-yellow-500 text-white"
											: "bg-gray-200 hover:bg-gray-300"
									}`}>
									Trung bình
								</button>
								<button
									onClick={() => handleAILevelChange("hard")}
									className={`px-3 py-1 rounded text-sm sm:text-base ${
										aiLevel === "hard"
											? "bg-red-500 text-white"
											: "bg-gray-200 hover:bg-gray-300"
									}`}>
									Khó
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Hiển thị lượt chơi và nút game mới ngang bàn cờ - Mobile optimized */}
				<div className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-4 px-2 sm:px-4 gap-2">
					<div className="text-base sm:text-lg font-semibold w-full sm:w-auto text-center sm:text-left">
						Lượt:{" "}
						<span
							className={`font-bold text-lg sm:text-xl ${
								currentPlayer === "red"
									? "text-red-600"
									: "text-gray-800"
							}`}>
							{currentPlayer === "red" ? "Đỏ" : "Đen"}
							{gameMode === "pve" &&
								currentPlayer === "black" &&
								" (Máy)"}
						</span>
						{inCheck && !gameOver && (
							<span className="ml-2 px-2 py-1 bg-red-500 text-white rounded animate-pulse">
								CHIẾU!
							</span>
						)}
						{isAIThinking && (
							<span className="ml-2 px-2 py-1 bg-blue-500 text-white rounded animate-pulse">
								Đang suy nghĩ...
							</span>
						)}
					</div>

					<div className="flex gap-2">
						<button
							onClick={() => {
								resetGame();
								showSuccessToast("Đã bắt đầu game mới!");
							}}
							disabled={isAIThinking}
							className={`px-4 py-2 text-white rounded text-sm sm:text-base w-full sm:w-auto ${
								isAIThinking
									? "bg-gray-400 cursor-not-allowed"
									: "bg-blue-500 hover:bg-blue-600"
							}`}>
							Game mới
						</button>
					</div>
				</div>

				{/* Thông báo game kết thúc */}
				{gameOver && (
					<div className="mb-2 sm:mb-4 p-2 sm:p-3 bg-yellow-100 border border-yellow-300 rounded">
						<p className="text-base sm:text-lg font-bold text-center sm:text-left">
							Game kết thúc!{" "}
							{winner && (
								<span
									className={
										winner === "red"
											? "text-red-600"
											: "text-gray-800"
									}>
									{winner === "red" ? "Đỏ" : "Đen"}
									{gameMode === "pve" &&
										winner === "black" &&
										" (Máy)"}{" "}
									{lastMoveWasCheck
										? "chiến thắng bằng chiếu hết!"
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
						isAIThinking={isAIThinking}
						gameMode={gameMode}
						lastAIMove={lastAIMove ?? undefined}
					/>
				</div>
			</div>
		</div>
	);
};

export default ChineseChessGame;
