import Board from "./components/Board";
import Controls from "./components/Controls";
import { useSudokuGame } from "./hooks/useSudokuGame";

export default function Game() {
	const {
		board,
		selectedCell,
		setSelectedCell,
		difficulty,
		setDifficulty,
		isGameCompleted,
		isSolving,
		handleCellValueChange,
		handleNewGame,
		handleSolve,
		handleClear,
		handleCheckSolution,
		handleHint,
		mistakes,
		hintsRemaining,
		feedback,
		hasUserInput,
		gameProgress,
	} = useSudokuGame();

	return (
		<div className="flex flex-col items-center justify-center w-full max-w-md mx-auto my-8 px-4">
			<h1 className="text-3xl font-bold mb-6 text-center">Sudoku</h1>

			<div className="w-full mb-6">
				<Board
					board={board}
					selectedCell={selectedCell}
					setSelectedCell={setSelectedCell}
					handleCellValueChange={handleCellValueChange}
				/>
			</div>

			{feedback && (
				<div
					className={`w-full mb-4 p-3 rounded text-white text-center ${
						feedback.type === "success"
							? "bg-green-500"
							: feedback.type === "error"
								? "bg-red-500"
								: "bg-blue-500"
					}`}>
					{feedback.message}
				</div>
			)}

			<Controls
				difficulty={difficulty}
				setDifficulty={setDifficulty}
				onNewGame={handleNewGame}
				onSolve={handleSolve}
				onClear={handleClear}
				onCheck={handleCheckSolution}
				onHint={handleHint}
				isSolving={isSolving}
				isGameCompleted={isGameCompleted}
				hintsRemaining={hintsRemaining}
				gameProgress={gameProgress}
				hasUserInput={hasUserInput}
			/>

			<div className="mt-4 text-center">
				<p className="text-lg">
					Mistakes:{" "}
					<span className="font-bold text-red-600">{mistakes}</span>
					<span className="ml-4">
						Hints:{" "}
						<span className="font-bold text-blue-600">
							{hintsRemaining}
						</span>
					</span>
				</p>
				{isGameCompleted && (
					<p className="text-xl font-bold text-green-600 mt-2">
						Congratulations! You solved the puzzle!
					</p>
				)}
				{!isGameCompleted && hasUserInput && (
					<p className="text-sm text-gray-600 mt-2">
						Progress: {gameProgress}%
					</p>
				)}
			</div>
		</div>
	);
}
