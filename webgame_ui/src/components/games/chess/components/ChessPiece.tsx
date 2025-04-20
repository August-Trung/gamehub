// components/ChessPiece.tsx
import React from "react";
import { ChessPiece as ChessPieceType } from "../hooks/useChessGame";

interface ChessPieceProps {
	piece: ChessPieceType;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {
	// Map piece types to Unicode chess symbols
	const getPieceSymbol = (): string => {
		if (piece.color === "white") {
			switch (piece.type) {
				case "king":
					return "♔";
				case "queen":
					return "♕";
				case "rook":
					return "♖";
				case "bishop":
					return "♗";
				case "knight":
					return "♘";
				case "pawn":
					return "♙";
				default:
					return "";
			}
		} else {
			switch (piece.type) {
				case "king":
					return "♚";
				case "queen":
					return "♛";
				case "rook":
					return "♜";
				case "bishop":
					return "♝";
				case "knight":
					return "♞";
				case "pawn":
					return "♟";
				default:
					return "";
			}
		}
	};

	return (
		<div className={`chess-piece ${piece.color}`}>{getPieceSymbol()}</div>
	);
};

export default ChessPiece;
