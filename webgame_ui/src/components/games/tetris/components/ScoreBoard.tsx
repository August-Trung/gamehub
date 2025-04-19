// components/ScoreBoard.tsx
import React from "react";
import { TetrominoType } from "../hooks/useTetrisGame";
import NextPieceDisplay from "./NextPieceDisplay";

interface ScoreBoardProps {
	score: number;
	level: number;
	lines: number;
	nextPiece: TetrominoType;
	gameOver: boolean;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
	score,
	level,
	lines,
	nextPiece,
	gameOver,
}) => {
	return (
		<div className="score-board">
			{gameOver && <div className="game-over">Game Over</div>}

			<div className="stats">
				<div className="stat-item">
					<span className="stat-label">Score:</span>
					<span className="stat-value">{score}</span>
				</div>
				<div className="stat-item">
					<span className="stat-label">Level:</span>
					<span className="stat-value">{level}</span>
				</div>
				<div className="stat-item">
					<span className="stat-label">Lines:</span>
					<span className="stat-value">{lines}</span>
				</div>
			</div>

			<div className="next-piece-container">
				<h3>Next Piece</h3>
				<NextPieceDisplay piece={nextPiece} />
			</div>
		</div>
	);
};

export default ScoreBoard;
