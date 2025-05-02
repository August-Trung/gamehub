import React from "react";
import MandarinSquareBoard from "./components/MandarinSquareBoard";
import MandarinSquareControls from "./components/MandarinSquareControls";
import { useMandarinSquareGame } from "./hooks/useMandarinSquareGame";

const MandarinSquareCapturingGame: React.FC = () => {
	const {
		gameState,
		currentPlayer,
		selectedPocket,
		isGameOver,
		winner,
		message,
		animationState,
		selectPocket,
		makeMove,
		resetGame,
	} = useMandarinSquareGame();

	return (
		<div className="flex flex-col items-center justify-center p-4 max-w-3xl mx-auto">
			<h1 className="text-3xl font-bold mb-4">
				Mandarin Square Capturing
			</h1>

			<div className="mb-4 text-center">
				<p className="text-xl mb-2">
					{isGameOver
						? `Game over! ${winner ? `Player ${winner} wins!` : "It's a tie!"}`
						: animationState.isAnimating
							? "Seeds are being sown..."
							: `Player ${currentPlayer}'s turn`}
				</p>
			</div>

			{message && (
				<div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 rounded text-center">
					{message}
				</div>
			)}

			<MandarinSquareBoard
				gameState={gameState}
				selectedPocket={selectedPocket}
				currentPlayer={currentPlayer}
				animationState={animationState}
				onSelectPocket={selectPocket}
			/>

			<div className="mt-6">
				<MandarinSquareControls
					onMakeMove={makeMove}
					onResetGame={resetGame}
					canMove={
						selectedPocket !== null && !animationState.isAnimating
					}
					isGameOver={isGameOver}
				/>
			</div>

			{isGameOver && (
				<div className="mt-4 text-center">
					<p>Final Scores:</p>
					<p>
						Player 1: {gameState.scores[0]}{" "}
						{gameState.borrowedSeeds[0] > 0
							? `(borrowed ${gameState.borrowedSeeds[0]})`
							: ""}
					</p>
					<p>
						Player 2: {gameState.scores[1]}{" "}
						{gameState.borrowedSeeds[1] > 0
							? `(borrowed ${gameState.borrowedSeeds[1]})`
							: ""}
					</p>
				</div>
			)}
		</div>
	);
};

export default MandarinSquareCapturingGame;
