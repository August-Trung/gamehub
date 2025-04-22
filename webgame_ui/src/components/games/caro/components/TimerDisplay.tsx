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
		<div className="flex justify-between w-full mb-4">
			<div
				className={`flex flex-col items-center p-3 rounded-lg ${
					currentPlayer === "X"
						? "bg-blue-100 border-2 border-blue-500"
						: "bg-gray-100"
				}`}>
				<div className="font-bold text-blue-600">Player X</div>
				<div
					className={`text-xl font-mono ${
						timeOutPlayer === "X" ? "text-red-600" : ""
					}`}>
					{playerX}
				</div>
			</div>

			<div className="flex items-center">
				{isRunning ? (
					<div className="text-green-600 font-bold">
						{currentPlayer === "X" ? "⏱️ X Turn" : "⏱️ O Turn"}
					</div>
				) : hasTimeOut ? (
					<div className="text-red-600 font-bold">
						Time Out: {timeOutPlayer} loses!
					</div>
				) : (
					<button
						className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
						onClick={onStartGame}>
						Start Game
					</button>
				)}
			</div>

			<div
				className={`flex flex-col items-center p-3 rounded-lg ${
					currentPlayer === "O"
						? "bg-red-100 border-2 border-red-500"
						: "bg-gray-100"
				}`}>
				<div className="font-bold text-red-600">Player O</div>
				<div
					className={`text-xl font-mono ${
						timeOutPlayer === "O" ? "text-red-600" : ""
					}`}>
					{playerO}
				</div>
			</div>
		</div>
	);
};

export default TimerDisplay;
