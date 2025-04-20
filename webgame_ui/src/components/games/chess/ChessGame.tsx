// ChessGame.tsx
import React from "react";
import ChessBoard from "./components/ChessBoard";
import GameInfo from "./components/GameInfo";
import useChessGame from "./hooks/useChessGame";
import "./styles/ChessGame.css";

const ChessGame: React.FC = () => {
	const {
		board,
		currentPlayer,
		selectedPiece,
		moveHistory,
		capturedPieces,
		validMoves,
		isCheck,
		isCheckmate,
		selectPiece,
		resetGame,
	} = useChessGame();

	return (
		<div className="chess-game">
			<h1>React Chess Game</h1>
			<div className="game-container">
				<ChessBoard
					board={board}
					validMoves={validMoves}
					selectedPiece={selectedPiece}
					onCellClick={selectPiece}
					currentPlayer={currentPlayer}
					isCheck={isCheck}
					isCheckmate={isCheckmate}
				/>
				<GameInfo
					currentPlayer={currentPlayer}
					moveHistory={moveHistory}
					capturedPieces={capturedPieces}
					isCheck={isCheck}
					isCheckmate={isCheckmate}
					onResetGame={resetGame}
				/>
			</div>
		</div>
	);
};

export default ChessGame;
