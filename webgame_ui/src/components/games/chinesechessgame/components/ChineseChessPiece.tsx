import React from "react";
import { ChessPiece } from "../hooks/useChineseChessGame";

interface ChineseChessPieceProps {
	piece: ChessPiece;
	selected: boolean;
	onClick: () => void;
	isMobile?: boolean;
}

// Ánh xạ từ loại quân cờ sang ký tự tiếng Trung/Việt
const pieceSymbols: Record<string, { red: string; black: string }> = {
	general: { red: "帥", black: "將" }, // Tướng
	advisor: { red: "仕", black: "士" }, // Sĩ
	elephant: { red: "相", black: "象" }, // Tượng
	horse: { red: "傌", black: "馬" }, // Mã
	chariot: { red: "俥", black: "車" }, // Xe
	cannon: { red: "炮", black: "砲" }, // Pháo
	soldier: { red: "兵", black: "卒" }, // Tốt
};

// Ánh xạ sang tên tiếng Việt để hiển thị tooltip
const pieceNamesVietnamese: Record<string, string> = {
	general: "Tướng",
	advisor: "Sĩ",
	elephant: "Tượng",
	horse: "Mã",
	chariot: "Xe",
	cannon: "Pháo",
	soldier: "Tốt",
};

const ChineseChessPiece: React.FC<ChineseChessPieceProps> = ({
	piece,
	selected,
	onClick,
	isMobile = false,
}) => {
	const { type, player } = piece;

	// Define fixed sizes for different devices
	const pieceSize = isMobile ? "1.75rem" : "3.5rem";
	const fontSize = isMobile ? "text-sm" : "text-2xl";

	return (
		<div
			className={`
        relative flex items-center justify-center
        rounded-full 
        ${player === "red" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-800"}
        ${selected ? "ring-2 sm:ring-4 ring-blue-400" : ""}
        shadow cursor-pointer
        transition-all duration-150 ease-in-out
        transform hover:scale-105
        w-full h-full
      `}
			style={{
				minWidth: pieceSize,
				minHeight: pieceSize,
				maxWidth: pieceSize,
				maxHeight: pieceSize,
			}}
			onClick={onClick}
			title={`${player === "red" ? "Đỏ" : "Đen"} - ${pieceNamesVietnamese[type]}`}>
			<span className={`${fontSize} font-bold`}>
				{pieceSymbols[type][player]}
			</span>
		</div>
	);
};

export default ChineseChessPiece;
