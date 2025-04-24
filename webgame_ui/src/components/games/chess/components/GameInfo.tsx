// components/GameInfo.tsx
import React from "react";
import { Move, ChessPiece } from "../hooks/useChessGame";

interface GameInfoProps {
	currentPlayer: "white" | "black";
	moveHistory: Move[];
	capturedPieces: ChessPiece[];
	isCheck: boolean;
	isCheckmate: boolean;
	onResetGame: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({
	currentPlayer,
	moveHistory,
	capturedPieces,
	isCheck,
	isCheckmate,
	onResetGame,
}) => {
	// Format move to algebraic notation
	const formatMove = (move: Move): string => {
		const from =
			String.fromCharCode(97 + move.from.col) + (8 - move.from.row);
		const to = String.fromCharCode(97 + move.to.col) + (8 - move.to.row);

		let notation = `${move.piece.type.charAt(0).toUpperCase()}${from}-${to}`;

		if (move.capturedPiece) notation += "x";
		if (move.isCheck) notation += "+";
		if (move.isCheckmate) notation += "#";
		if (move.isPromotion) notation += "=Q"; // Always promote to queen in this implementation
		if (move.isCastle) {
			if (move.to.col === 2)
				notation = "O-O-O"; // Queenside
			else notation = "O-O"; // Kingside
		}

		return notation;
	};

	// Get status message
	const getStatusMessage = (): string => {
		if (isCheckmate) {
			return `Checkmate! ${currentPlayer === "white" ? "Black" : "White"} wins!`;
		}
		if (isCheck) {
			return `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} is in check!`;
		}
		return `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
	};

	// Group moves into pairs (white & black)
	const getFormattedMoveHistory = (): JSX.Element[] => {
		const formattedMoves: JSX.Element[] = [];

		for (let i = 0; i < moveHistory.length; i += 2) {
			const moveNumber = Math.floor(i / 2) + 1;
			const whiteMove = moveHistory[i];
			const blackMove =
				i + 1 < moveHistory.length ? moveHistory[i + 1] : null;

			formattedMoves.push(
				<div className="move-pair">
					<span className="move-number">{moveNumber}.</span>
					<span className="white-move">{formatMove(whiteMove)}</span>
					<span className="black-move">
						{blackMove ? formatMove(blackMove) : ""}
					</span>
				</div>
			);
		}

		return formattedMoves;
	};

	// Group captured pieces by color
	const groupCapturedPieces = () => {
		const whiteCaptured = capturedPieces.filter(
			(piece) => piece.color === "white"
		);
		const blackCaptured = capturedPieces.filter(
			(piece) => piece.color === "black"
		);

		return { whiteCaptured, blackCaptured };
	};

	const { whiteCaptured, blackCaptured } = groupCapturedPieces();

	return (
		<div className="game-info">
			<div className="status">
				<h2>{getStatusMessage()}</h2>
				<button className="reset-button" onClick={onResetGame}>
					Reset Game
				</button>
			</div>

			<div className="captured-pieces">
				<div className="captured-section">
					<h3>Captured White Pieces</h3>
					<div className="pieces">
						{whiteCaptured.map((piece, i) => (
							<div key={i} className="captured-piece white">
								{piece.type}
							</div>
						))}
					</div>
				</div>

				<div className="captured-section">
					<h3>Captured Black Pieces</h3>
					<div className="pieces">
						{blackCaptured.map((piece, i) => (
							<div key={i} className="captured-piece black">
								{piece.type}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="move-history">
				<h3>Move History</h3>
				<div className="name-move-history">
					<h3 className="white-name-move">White</h3>
					<h3 className="black-name-move">Black</h3>
				</div>
				<div className="moves">{getFormattedMoveHistory()}</div>
			</div>
		</div>
	);
};

export default GameInfo;
