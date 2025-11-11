import { useEffect, useState } from "react";
import Board from "./components/Board";
import Controls from "./components/Controls";
import { useCaroGame } from "./hooks/useCaroGame";
import TimerDisplay from "./components/TimerDisplay";
import "./styles/animations.css";

export default function Game() {
	const {
		board,
		currentPlayer,
		winner,
		winningLine,
		boardSize,
		handleCellClick,
		handleRestart,
		handleBoardSizeChange,
		timeX,
		timeO,
		isTimerRunning,
		hasTimeOut,
		timeOutPlayer,
		startGame,
	} = useCaroGame();

	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 0
	);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Determine if we should use mobile layout
	const isMobile = windowWidth < 768;

	return (
		<div className="caro-wrapper flex flex-col items-center w-full max-w-4xl mx-auto my-4 px-2 text-white">
			<p className="caro-title mb-2 text-center">Arcade match</p>
			<h1 className="text-3xl font-bold mb-4 text-center tracking-wide">
				Caro <span className="text-cyan-300">Neon</span> Arena
			</h1>

			<div className="caro-status-card mb-4 text-center w-full">
				{winner ? (
					<h2 className="text-2xl font-bold">
						Winner:{" "}
						<span className={winner === "X" ? "text-blue-400" : "text-pink-400"}>
							{winner}
						</span>
					</h2>
				) : hasTimeOut ? (
					<h2 className="text-2xl font-bold text-rose-300">
						{timeOutPlayer} ran out of time!
					</h2>
				) : (
					<h2 className="text-xl tracking-[0.2em] text-gray-200">
						Current Player:{" "}
						<span className={currentPlayer === "X" ? "text-blue-300" : "text-pink-300"}>
							{currentPlayer}
						</span>
					</h2>
				)}
			</div>

			<TimerDisplay
				playerX={timeX}
				playerO={timeO}
				currentPlayer={currentPlayer}
				isRunning={isTimerRunning}
				hasTimeOut={hasTimeOut}
				timeOutPlayer={timeOutPlayer}
				onStartGame={startGame}
			/>

			{/* Main content area with responsive layout */}
			<div className="w-full flex flex-col lg:flex-row items-start gap-6">
				<div className="w-full flex justify-center">
					<Board
						board={board}
						winningLine={winningLine}
						onCellClick={handleCellClick}
						boardSize={boardSize}
					/>
				</div>
				<div className={`${isMobile ? "w-full" : "w-64"} space-y-4`}>
					<Controls
						onRestart={handleRestart}
						boardSize={boardSize}
						onBoardSizeChange={handleBoardSizeChange}
					/>
				</div>
			</div>
		</div>
	);
}
