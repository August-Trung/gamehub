import React from "react";
import ChineseChessPiece from "./ChineseChessPiece";
import { ChessPiece, Player, GameMode } from "../hooks/useChineseChessGame";

interface ChineseChessBoardProps {
	pieces: ChessPiece[];
	selectedPiece: ChessPiece | null;
	validMoves: [number, number][];
	onSelectPiece: (piece: ChessPiece) => void;
	onMovePiece: (row: number, col: number) => void;
	currentPlayer: Player;
	isAIThinking?: boolean;
	gameMode?: GameMode;
	lastAIMove?: { from: [number, number]; to: [number, number] };
}

const ChineseChessBoard: React.FC<ChineseChessBoardProps> = ({
	pieces,
	selectedPiece,
	validMoves,
	onSelectPiece,
	onMovePiece,
	currentPlayer,
	isAIThinking = false,
	gameMode = "pvp",
	lastAIMove,
}) => {
	// Tạo bàn cờ với kích thước 10x9
	const rows = 10;
	const cols = 9;

	// Determine if we're on a mobile device
	const [isMobile, setIsMobile] = React.useState(false);

	React.useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Kiểm tra xem một ô có phải là nước đi hợp lệ không
	const isValidMove = (row: number, col: number): boolean => {
		return validMoves.some(([r, c]) => r === row && c === col);
	};

	// Kiểm tra xem một ô có quân cờ hay không
	const getPieceAt = (row: number, col: number): ChessPiece | null => {
		return (
			pieces.find(
				(piece) =>
					piece.position[0] === row && piece.position[1] === col
			) || null
		);
	};

	// Xử lý sự kiện click vào một ô
	const handleSquareClick = (row: number, col: number) => {
		if (isAIThinking) return;
		if (gameMode === "pve" && currentPlayer === "black") return;
		const pieceAt = getPieceAt(row, col);
		if (pieceAt && pieceAt.player === currentPlayer) {
			onSelectPiece(pieceAt);
			return;
		}
		if (selectedPiece && isValidMove(row, col)) {
			onMovePiece(row, col);
		}
	};

	// Check if this square should have palace diagonals
	const hasPalaceDiagonals = (row: number, col: number): boolean => {
		// Top palace (rows 0-2, cols 3-5)
		const isTopPalace = row >= 0 && row <= 2 && col >= 3 && col <= 5;

		// Bottom palace (rows 7-9, cols 3-5)
		const isBottomPalace = row >= 7 && row <= 9 && col >= 3 && col <= 5;

		return isTopPalace || isBottomPalace;
	};

	// Render bàn cờ tướng
	return (
		<div className="relative flex flex-col items-center">
			<div
				className={`
          grid grid-cols-9 gap-0 border-4 border-gray-700 bg-[#f6e1a0]
          ${isMobile ? "w-full max-w-[98vw]" : "w-full max-w-xl"}
        `}
				style={{ aspectRatio: "9/10" }}>
				{/* Tạo 10x9 ô cờ */}
				{Array.from({ length: rows }).map((_, rowIndex) => (
					<React.Fragment key={rowIndex}>
						{Array.from({ length: cols }).map((_, colIndex) => {
							// Kiểm tra xem ô này có nước đi hợp lệ không
							const isValid = isValidMove(rowIndex, colIndex);

							// Lấy quân cờ tại vị trí này
							const piece = getPieceAt(rowIndex, colIndex);

							// Kiểm tra xem ô này có phải là cung điện không
							const isPalace =
								(rowIndex >= 0 &&
									rowIndex <= 2 &&
									colIndex >= 3 &&
									colIndex <= 5) ||
								(rowIndex >= 7 &&
									rowIndex <= 9 &&
									colIndex >= 3 &&
									colIndex <= 5);

							// Xác định xem ô này có phải là nước sông không
							const isRiver = rowIndex >= 4 && rowIndex <= 5;

							return (
								<div
									key={`${rowIndex}-${colIndex}`}
									className={`
                    relative aspect-square flex items-center justify-center
                    ${isValid ? "bg-blue-200" : ""}
                    ${isPalace ? "bg-yellow-100" : ""}
                    ${isRiver ? "bg-blue-50" : ""}
					${
						(lastAIMove?.from[0] === rowIndex &&
							lastAIMove?.from[1] === colIndex) ||
						(lastAIMove?.to[0] === rowIndex &&
							lastAIMove?.to[1] === colIndex)
							? "bg-red-400"
							: ""
					}

                    border border-gray-600
                    transition-all duration-100 cursor-pointer hover:bg-yellow-100
                  `}
									onClick={() =>
										handleSquareClick(rowIndex, colIndex)
									}>
									{/* Vẽ đường kẻ bàn cờ */}
									<div className="absolute inset-0 pointer-events-none">
										{/* Đường kẻ ngang */}
										{rowIndex < rows - 1 && (
											<div className="absolute inset-x-0 bottom-0 h-px bg-gray-700 pointer-events-none"></div>
										)}

										{/* Đường kẻ dọc */}
										{colIndex < cols - 1 && (
											<div className="absolute inset-y-0 right-0 w-px bg-gray-700 pointer-events-none"></div>
										)}
									</div>

									{/* Điểm đánh dấu các vị trí đặc biệt */}
									{
										// Điểm đánh dấu cho Tốt/Pháo
										(((rowIndex === 2 || rowIndex === 7) &&
											(colIndex === 1 ||
												colIndex === 7)) ||
											((rowIndex === 3 ||
												rowIndex === 6) &&
												(colIndex === 0 ||
													colIndex === 2 ||
													colIndex === 4 ||
													colIndex === 6 ||
													colIndex === 8))) && (
											<div className="absolute w-3 h-3 pointer-events-none">
												<div className="absolute top-0 left-0 w-1.5 h-0.5 bg-gray-700"></div>
												<div className="absolute top-0 left-0 h-1.5 w-0.5 bg-gray-700"></div>
												<div className="absolute top-0 right-0 w-1.5 h-0.5 bg-gray-700"></div>
												<div className="absolute top-0 right-0 h-1.5 w-0.5 bg-gray-700"></div>
												<div className="absolute bottom-0 left-0 w-1.5 h-0.5 bg-gray-700"></div>
												<div className="absolute bottom-0 left-0 h-1.5 w-0.5 bg-gray-700"></div>
												<div className="absolute bottom-0 right-0 w-1.5 h-0.5 bg-gray-700"></div>
												<div className="absolute bottom-0 right-0 h-1.5 w-0.5 bg-gray-700"></div>
											</div>
										)
									}

									{/* Vẽ đường chéo cung điện */}
									{hasPalaceDiagonals(rowIndex, colIndex) && (
										<div className="absolute inset-0 pointer-events-none">
											<svg
												viewBox="0 0 100 100"
												className="w-full h-full">
												{/* Top palace diagonals */}
												{rowIndex >= 0 &&
													rowIndex <= 2 &&
													colIndex >= 3 &&
													colIndex <= 5 && (
														<>
															{/* Only draw from top-left to bottom-right if we're in a palace cell that contains this diagonal */}
															{((rowIndex === 0 &&
																colIndex ===
																	3) ||
																(rowIndex ===
																	1 &&
																	colIndex ===
																		4) ||
																(rowIndex ===
																	2 &&
																	colIndex ===
																		5)) && (
																<line
																	x1="0"
																	y1="0"
																	x2="100"
																	y2="100"
																	stroke="gray"
																	strokeWidth="1"
																/>
															)}

															{/* Only draw from top-right to bottom-left if we're in a palace cell that contains this diagonal */}
															{((rowIndex === 0 &&
																colIndex ===
																	5) ||
																(rowIndex ===
																	1 &&
																	colIndex ===
																		4) ||
																(rowIndex ===
																	2 &&
																	colIndex ===
																		3)) && (
																<line
																	x1="100"
																	y1="0"
																	x2="0"
																	y2="100"
																	stroke="gray"
																	strokeWidth="1"
																/>
															)}
														</>
													)}

												{/* Bottom palace diagonals */}
												{rowIndex >= 7 &&
													rowIndex <= 9 &&
													colIndex >= 3 &&
													colIndex <= 5 && (
														<>
															{/* Only draw from top-left to bottom-right if we're in a palace cell that contains this diagonal */}
															{((rowIndex === 7 &&
																colIndex ===
																	3) ||
																(rowIndex ===
																	8 &&
																	colIndex ===
																		4) ||
																(rowIndex ===
																	9 &&
																	colIndex ===
																		5)) && (
																<line
																	x1="0"
																	y1="0"
																	x2="100"
																	y2="100"
																	stroke="gray"
																	strokeWidth="1"
																/>
															)}

															{/* Only draw from top-right to bottom-left if we're in a palace cell that contains this diagonal */}
															{((rowIndex === 7 &&
																colIndex ===
																	5) ||
																(rowIndex ===
																	8 &&
																	colIndex ===
																		4) ||
																(rowIndex ===
																	9 &&
																	colIndex ===
																		3)) && (
																<line
																	x1="100"
																	y1="0"
																	x2="0"
																	y2="100"
																	stroke="gray"
																	strokeWidth="1"
																/>
															)}
														</>
													)}
											</svg>
										</div>
									)}

									{/* Vẽ "sông" giữa bàn cờ */}
									{isRiver &&
										rowIndex === 4 &&
										colIndex === 4 && (
											<div className="absolute inset-0 flex items-center justify-center text-gray-800 font-extrabold text-xs sm:text-lg md:text-xl pointer-events-none">
												楚 河
											</div>
										)}

									{isRiver &&
										rowIndex === 5 &&
										colIndex === 4 && (
											<div className="absolute inset-0 flex items-center justify-center text-gray-800 font-extrabold text-xs sm:text-lg md:text-xl pointer-events-none">
												漢 界
											</div>
										)}

									{/* Hiển thị quân cờ */}
									{piece && (
										<ChineseChessPiece
											piece={piece}
											selected={
												selectedPiece?.id === piece.id
											}
											onClick={() =>
												handleSquareClick(
													rowIndex,
													colIndex
												)
											}
											isMobile={isMobile}
										/>
									)}

									{/* Hiển thị dấu hiệu nước đi hợp lệ */}
									{isValid && !piece && (
										<div className="w-1/3 h-1/3 bg-blue-400 rounded-full opacity-60"></div>
									)}
								</div>
							);
						})}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default ChineseChessBoard;
