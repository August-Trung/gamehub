import { useEffect, useState } from "react";
import Board from "./components/Board";
import Controls from "./components/Controls";
import { useCaroGame } from "./hooks/useCaroGame";
import TimerDisplay from "./components/TimerDisplay";

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
		<div className="flex flex-col items-center w-full max-w-full mx-auto my-4 px-2">
			<h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-center">
				Caro (Five in a Row)
			</h1>

			<div className="mb-2 sm:mb-4 text-center">
				{winner ? (
					<h2 className="text-xl sm:text-2xl font-bold">
						Winner:{" "}
						<span
							className={
								winner === "X"
									? "text-blue-600"
									: "text-red-600"
							}>
							{winner}
						</span>
					</h2>
				) : hasTimeOut ? (
					<h2 className="text-xl sm:text-2xl font-bold">
						<span
							className={
								timeOutPlayer === "X"
									? "text-blue-600"
									: "text-red-600"
							}>
							{timeOutPlayer}
						</span>{" "}
						ran out of time!
					</h2>
				) : (
					<h2 className="text-lg sm:text-xl">
						Current Player:{" "}
						<span
							className={
								currentPlayer === "X"
									? "text-blue-600"
									: "text-red-600"
							}>
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
			<div
				className={`w-full flex ${isMobile ? "flex-col" : "flex-col"} items-center gap-4`}>
				{/* Game board container with responsive scaling */}
				<div className="w-full flex justify-center mb-4">
					<Board
						board={board}
						winningLine={winningLine}
						onCellClick={handleCellClick}
						boardSize={boardSize}
					/>
				</div>

				{/* Controls container with responsive width */}
				<div className={`${isMobile ? "w-full" : "w-64"}`}>
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
