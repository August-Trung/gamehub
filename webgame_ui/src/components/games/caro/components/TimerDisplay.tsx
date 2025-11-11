import React from "react";

interface TimerDisplayProps {
	playerX: string;
	playerO: string;
	currentPlayer: string;
	isRunning: boolean;
	hasTimeOut: boolean;
	timeOutPlayer: string | null;
	onStartGame?: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
	playerX,
	playerO,
	currentPlayer,
	isRunning,
	hasTimeOut,
	timeOutPlayer,
	onStartGame,
}) => {
	return (
		<div className="flex flex-col sm:flex-row gap-4 w-full mb-6">
			<div
				className={`caro-player-card ${
					currentPlayer === "X" ? "active" : ""
				}`}>
				<div className="label">Player X</div>
				<div className="timer">
					{playerX}
					{timeOutPlayer === "X" ? " ⏰" : ""}
				</div>
			</div>

			<div className="flex flex-col items-center justify-center gap-2">
				{isRunning ? (
					<div className="text-cyan-200 font-semibold tracking-[0.3em] uppercase">
						{currentPlayer === "X" ? "X TURN" : "O TURN"}
					</div>
				) : hasTimeOut ? (
					<div className="text-rose-300 font-semibold tracking-[0.3em] uppercase">
						Time out: {timeOutPlayer}
					</div>
				) : (
					<button className="caro-button secondary" onClick={onStartGame}>
						Start Game
					</button>
				)}
			</div>

			<div
				className={`caro-player-card ${
					currentPlayer === "O" ? "active" : ""
				}`}>
				<div className="label">Player O</div>
				<div className="timer">
					{playerO}
					{timeOutPlayer === "O" ? " ⏰" : ""}
				</div>
			</div>
		</div>
	);
};

export default TimerDisplay;
