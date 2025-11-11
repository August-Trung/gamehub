import { useEffect, useState } from "react";

import GameBoard from "./components/GameBoard";
import { use2048Game } from "./hooks/use2048Game";
import "./styles/animations.css";

function Game2048(): JSX.Element {
	const {
		board,
		score,
		bestScore,
		gameOver,
		won,
		mergePositions,
		newTilePosition,
		resetGame,
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd,
		time,
		formatTime,
		bestTime,
		isPaused,
		togglePause,
	} = use2048Game();

	const [scorePulse, setScorePulse] = useState(false);
	const [bestPulse, setBestPulse] = useState(false);

	useEffect(() => {
		setScorePulse(true);
		const timer = setTimeout(() => setScorePulse(false), 400);
		return () => clearTimeout(timer);
	}, [score]);

	useEffect(() => {
		setBestPulse(true);
		const timer = setTimeout(() => setBestPulse(false), 400);
		return () => clearTimeout(timer);
	}, [bestScore]);

	return (
		<div className="max-w-md mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4 text-center">2048</h2>

			<div className="flex justify-between items-center mb-4">
				<div className="flex gap-2">
					<div
						className={`bg-slate-800/80 text-white px-4 py-2 rounded-2xl shadow-inner shadow-slate-900/60 transition ${scorePulse ? "score-bump" : ""}`}>
						<div className="text-xs uppercase tracking-[0.3em] text-cyan-200">
							Score
						</div>
						<div className="font-bold text-2xl">{score}</div>
					</div>
					<div
						className={`bg-slate-800/80 text-white px-4 py-2 rounded-2xl shadow-inner shadow-slate-900/60 transition ${bestPulse ? "score-bump" : ""}`}>
						<div className="text-xs uppercase tracking-[0.3em] text-cyan-200">
							Best
						</div>
						<div className="font-bold text-2xl">{bestScore}</div>
					</div>
				</div>

				<button
					className="button-glow px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-semibold uppercase tracking-[0.3em]"
					onClick={resetGame}>
					New Game
				</button>
			</div>

			<div className="flex justify-between items-center mb-4">
				<div className="bg-slate-800/70 px-4 py-2 rounded-2xl text-white">
					<div className="text-xs uppercase tracking-[0.3em] text-cyan-200">
						Time
					</div>
					<div className="font-bold text-xl">{formatTime(time)}</div>
				</div>

				<div className="bg-slate-800/70 px-4 py-2 rounded-2xl text-white">
					<div className="text-xs uppercase tracking-[0.3em] text-cyan-200">
						Best Time
					</div>
					<div className="font-bold text-xl">
						{bestTime > 0 ? formatTime(bestTime) : "--:--"}
					</div>
				</div>

				<button
					className={`button-glow px-4 py-2 rounded-full text-white font-semibold uppercase tracking-[0.3em] ${
						isPaused
							? "bg-gradient-to-r from-emerald-400 to-green-500"
							: "bg-gradient-to-r from-amber-400 to-orange-500"
					}`}
					onClick={togglePause}>
					{isPaused ? "Continue" : "Pause"}
				</button>
			</div>

			{(gameOver || won) && (
				<div
					className={`mb-4 p-3 ${won ? "bg-green-100" : "bg-red-100"} border rounded text-center`}>
					{won
						? "You won! 🎉 You can continue playing."
						: "Game over! No more moves available."}
				</div>
			)}

			<GameBoard
				board={board}
				mergePositions={mergePositions}
				newTilePosition={newTilePosition}
				handleTouchStart={handleTouchStart}
				handleTouchMove={handleTouchMove}
				handleTouchEnd={handleTouchEnd}
				isPaused={isPaused}
			/>

			<div className="mt-6 text-center">
				<p className="text-gray-600 text-sm">
					Combine similar tiles to create the 2048 tile!
					<br />
					Use arrow buttons or keyboard arrow keys to move tiles.
					Press 'P' to pause/resume the game.
				</p>
			</div>
		</div>
	);
}

export default Game2048;
