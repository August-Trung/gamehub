import GameBoard from "./components/GameBoard";
import { use2048Game } from "./hooks/use2048Game";

function Game2048(): JSX.Element {
	const {
		board,
		score,
		gameOver,
		won,
		mergePositions,
		newTilePosition,
		resetGame,
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd,
	} = use2048Game();

	return (
		<div className="max-w-md mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4 text-center">2048</h2>

			<div className="flex justify-between items-center mb-4">
				<div className="bg-gray-200 p-2 rounded">
					<div className="text-sm text-gray-600">Score</div>
					<div className="font-bold">{score}</div>
				</div>

				<button
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					onClick={resetGame}>
					New Game
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
			/>

			<div className="mt-6 text-center">
				<p className="text-gray-600 text-sm">
					Combine similar tiles to create the 2048 tile!
					<br />
					Use arrow buttons or keyboard arrow keys to move tiles.
				</p>
			</div>
		</div>
	);
}

export default Game2048;
