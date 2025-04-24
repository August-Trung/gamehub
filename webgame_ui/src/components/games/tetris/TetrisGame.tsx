import { useState, useEffect } from "react";
import Board from "./components/Board";
import ScoreBoard from "./components/ScoreBoard";
import Controls from "./components/Controls";
import { useTetris } from "./hooks/useTetris";
import "./styles/TetrisGame.css";

export default function TetrisGame() {
	const {
		board,
		player,
		nextPiece,
		gameOver,
		isPaused,
		score,
		level,
		lines,
		movePlayer,
		moveDown,
		rotate,
		hardDrop,
		startGame,
		pauseGame,
		resetGame,
	} = useTetris();

	// State to track screen size for responsive layout
	const [isMobile, setIsMobile] = useState(false);
	const [isExtraSmall, setIsExtraSmall] = useState(false);

	// Check screen size on mount and when window resizes
	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768);
			setIsExtraSmall(window.innerWidth < 375);
		};

		// Initial check
		checkScreenSize();

		// Add event listener for resize
		window.addEventListener("resize", checkScreenSize);

		// Cleanup
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	return (
		<div
			className={`tetris-container ${isMobile ? "mobile" : ""} ${isExtraSmall ? "extra-small" : ""}`}>
			{/* Game board */}
			<div className="tetris-game-board">
				<div className="tetris-board-container">
					<Board
						board={board}
						player={player}
						gameOver={gameOver}
						isPaused={isPaused}
					/>
				</div>
			</div>

			{/* Side panel */}
			<div className="tetris-side-panel">
				<ScoreBoard
					score={score}
					level={level}
					lines={lines}
					gameOver={gameOver}
					nextPiece={nextPiece}
				/>

				<Controls
					isPaused={isPaused}
					gameOver={gameOver}
					startGame={startGame}
					pauseGame={pauseGame}
					resetGame={resetGame}
					movePlayer={movePlayer}
					moveDown={moveDown}
					rotate={rotate}
					hardDrop={hardDrop}
					isMobile={isMobile}
				/>
			</div>
		</div>
	);
}
