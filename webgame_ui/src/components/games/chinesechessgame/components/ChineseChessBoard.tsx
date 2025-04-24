import React from "react";
import ChineseChessPiece from "./ChineseChessPiece";
import { ChessPiece, Player } from "../hooks/useChineseChessGame";

interface ChineseChessBoardProps {
	pieces: ChessPiece[];
	selectedPiece: ChessPiece | null;
	validMoves: [number, number][];
	onSelectPiece: (piece: ChessPiece) => void;
	onMovePiece: (row: number, col: number) => void;
	currentPlayer: Player;
}

const ChineseChessBoard: React.FC<ChineseChessBoardProps> = ({
	pieces,
	selectedPiece,
	validMoves,
	onSelectPiece,
	onMovePiece,
	currentPlayer,
}) => {
	// Tạo bàn cờ với kích thước 10x9
	const rows = 10;
	const cols = 9;

	// Determine if we're on a mobile device
	const [isMobile, setIsMobile] = React.useState(false);

	React.useEffect(() => {
		// Check if screen width is less than 768px (typical mobile breakpoint)
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Check on initial render
		checkMobile();

		// Set up event listener
		window.addEventListener("resize", checkMobile);

		// Clean up
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Kiểm tra xem một ô có phải là nước đi hợp lệ không
	const isValidMove = (row: number, col: number) => {
		return validMoves.some(([r, c]) => r === row && c === col);
	};

	// Lấy quân cờ tại vị trí [row, col]
	const getPieceAt = (row: number, col: number) => {
		return pieces.find(
			(piece) => piece.position[0] === row && piece.position[1] === col
		);
	};

	// Xử lý khi click vào một ô
	const handleCellClick = (row: number, col: number) => {
		const piece = getPieceAt(row, col);

		if (selectedPiece) {
			// Nếu đã chọn quân và click vào ô hợp lệ (dù là ô trống hay có quân địch), thực hiện di chuyển
			if (isValidMove(row, col)) {
				onMovePiece(row, col);
				return;
			}
		}

		// Nếu click vào quân cờ của mình, chọn quân đó
		if (piece && piece.player === currentPlayer) {
			onSelectPiece(piece);
		}
	};

	// Xác định xem ô [row, col] có thuộc cung điện không
	const isPalace = (row: number, col: number) => {
		return (
			col >= 3 &&
			col <= 5 &&
			((row >= 0 && row <= 2) || (row >= 7 && row <= 9))
		);
	};

	// Xác định xem một ô có phải là điểm đánh dấu không (các giao điểm trong cung điện)
	const isMarkedPoint = (row: number, col: number) => {
		if (row === 1 && col === 4) return true; // Điểm chính giữa cung điện đen
		if (row === 8 && col === 4) return true; // Điểm chính giữa cung điện đỏ

		// Các góc của cung điện
		if ((row === 0 || row === 2) && (col === 3 || col === 5)) return true;
		if ((row === 7 || row === 9) && (col === 3 || col === 5)) return true;

		return false;
	};

	// Kiểm tra xem ô có phải là dòng sông không
	const isRiver = (row: number) => {
		return row === 4 || row === 5; // Hàng 4 và 5 là dòng sông
	};

	// Calculate cell dimensions based on device type
	const cellSize = isMobile ? "min(2.5rem, 10vw)" : "4rem"; // Fixed large size for laptops and desktops

	const boardWidth = isMobile
		? "min(calc(9 * 2.5rem), 90vw)"
		: "calc(9 * 4rem)"; // Fixed large size for laptops and desktops

	const boardHeight = isMobile
		? "min(calc(10 * 2.5rem), 95vh)"
		: "calc(10 * 4rem)"; // Fixed large size for laptops and desktops

	return (
		<div className="bg-amber-100 sm:p-3 rounded-lg shadow-lg inline-block max-w-full overflow-auto">
			<div
				className="grid grid-cols-9 grid-rows-10"
				style={{
					width: boardWidth,
					height: boardHeight,
				}}>
				{Array.from({ length: rows }).map((_, rowIndex) =>
					Array.from({ length: cols }).map((_, colIndex) => (
						<div
							key={`${rowIndex}-${colIndex}`}
							className={`
                relative border border-gray-700
                flex items-center justify-center
                ${isPalace(rowIndex, colIndex) ? "bg-amber-200" : ""}
                ${isRiver(rowIndex) ? "bg-blue-100" : ""}
                ${isValidMove(rowIndex, colIndex) ? "bg-green-200" : ""}
                touch-manipulation
              `}
							onClick={() => handleCellClick(rowIndex, colIndex)}
							style={{
								width: cellSize,
								height: cellSize,
							}}>
							{/* Hiển thị chữ cho dòng sông */}
							{isRiver(rowIndex) &&
								colIndex === 1 &&
								rowIndex === 4 && (
									<div className="absolute text-xs sm:text-base md:text-lg font-bold text-blue-600 user-select-none select-none">
										楚 河
									</div>
								)}
							{isRiver(rowIndex) &&
								colIndex === 7 &&
								rowIndex === 4 && (
									<div className="absolute text-xs sm:text-base md:text-lg font-bold text-blue-600 user-select-none select-none">
										漢 界
									</div>
								)}

							{/* Điểm đánh dấu cho các giao lộ quan trọng */}
							{isMarkedPoint(rowIndex, colIndex) && (
								<div className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-gray-700 rounded-full"></div>
							)}

							{/* Hiển thị các dấu di chuyển hợp lệ */}
							{isValidMove(rowIndex, colIndex) &&
								!getPieceAt(rowIndex, colIndex) && (
									<div className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full opacity-70"></div>
								)}

							{/* Hiển thị quân cờ */}
							{getPieceAt(rowIndex, colIndex) && (
								<ChineseChessPiece
									piece={getPieceAt(rowIndex, colIndex)!}
									selected={
										selectedPiece?.id ===
										getPieceAt(rowIndex, colIndex)?.id
									}
									onClick={() =>
										handleCellClick(rowIndex, colIndex)
									}
									isMobile={isMobile}
								/>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default ChineseChessBoard;
