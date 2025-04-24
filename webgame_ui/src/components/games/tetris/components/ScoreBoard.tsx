import NextPiecePreview from "./NextPiecePreview";
import { TetrominoType } from "../types/types";

interface ScoreBoardProps {
	score: number;
	level: number;
	lines: number;
	gameOver: boolean;
	nextPiece: TetrominoType;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
	score,
	level,
	lines,
	gameOver,
	nextPiece,
}) => {
	return (
		<div className="tetris-score-board">
			{gameOver && <div className="tetris-game-over">Game Over</div>}

			<div className="tetris-score-container">
				<div className="tetris-score-line">
					<span className="tetris-score-label">Score:</span>
					<span>{score}</span>
				</div>
				<div className="tetris-score-line">
					<span className="tetris-score-label">Level:</span>
					<span>{level}</span>
				</div>
				<div className="tetris-score-line">
					<span className="tetris-score-label">Lines:</span>
					<span>{lines}</span>
				</div>
			</div>

			<div className="tetris-next-piece-container">
				<h3>Next Piece</h3>
				<div className="tetris-next-piece-preview">
					<NextPiecePreview piece={nextPiece} />
				</div>
			</div>
		</div>
	);
};

export default ScoreBoard;
