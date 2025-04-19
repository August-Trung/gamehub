// TetrisGame.tsx
import React, { useEffect } from "react";
import TetrisBoard from "./components/TetrisBoard";
import ScoreBoard from "./components/ScoreBoard";
import TetrisControls from "./components/TetrisControls";
import { useTetrisGame } from "./hooks/useTetrisGame";
import "./styles/TetrisGame.css"; // Import your CSS styles for Tetris

const TetrisGame: React.FC = () => {
	const {
		board,
		score,
		level,
		lines,
		nextPiece,
		gameOver,
		isPaused,
		startGame,
		pauseGame,
		moveLeft,
		moveRight,
		rotate,
		moveDown,
		hardDrop,
		resetGame,
	} = useTetrisGame();

	// Handle keyboard controls
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (gameOver || isPaused) return;

			switch (e.key) {
				case "ArrowLeft":
					moveLeft();
					break;
				case "ArrowRight":
					moveRight();
					break;
				case "ArrowUp":
					rotate();
					break;
				case "ArrowDown":
					moveDown();
					break;
				case " ":
					hardDrop();
					break;
				case "p":
					pauseGame();
					break;
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		gameOver,
		isPaused,
		moveLeft,
		moveRight,
		rotate,
		moveDown,
		hardDrop,
		pauseGame,
	]);

	return (
		<div className="tetris-game">
			<div className="game-container">
				<div className="main-area">
					<TetrisBoard board={board} />
				</div>
				<div className="side-panel">
					<ScoreBoard
						score={score}
						level={level}
						lines={lines}
						nextPiece={nextPiece}
						gameOver={gameOver}
					/>
					<TetrisControls
						isPaused={isPaused}
						gameOver={gameOver}
						onStart={startGame}
						onPause={pauseGame}
						onReset={resetGame}
						onMoveLeft={moveLeft}
						onMoveRight={moveRight}
						onRotate={rotate}
						onMoveDown={moveDown}
						onHardDrop={hardDrop}
					/>
				</div>
			</div>
		</div>
	);
};

export default TetrisGame;
