import Board from "./components/Board";
import Controls from "./components/Controls";
import { useCaroGame } from "./hooks/useCaroGame";

export default function Game() {
	const {
		board,
		currentPlayer,
		winner,
		winningLine,
		gameHistory,
		historyPosition,
		boardSize,
		handleCellClick,
		handleRestart,
		handleUndo,
		handleRedo,
		handleBoardSizeChange,
	} = useCaroGame();

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

			{/* Main content area with responsive layout */}
			<div className="w-full flex flex-col flex-row items-center items-start gap-4">
				{/* Game board container with responsive scaling */}
				<div className="w-full lg:w-auto overflow-auto">
					<div
						className="max-w-full"
						style={{
							width: "min-content",
							margin: "0 auto",
						}}>
						<Board
							board={board}
							winningLine={winningLine}
							onCellClick={handleCellClick}
							boardSize={boardSize}
						/>
					</div>
				</div>

				{/* Controls container with responsive width */}
				<div className="w-full lg:w-64">
					<Controls
						onRestart={handleRestart}
						onUndo={handleUndo}
						onRedo={handleRedo}
						canUndo={historyPosition > 0}
						canRedo={historyPosition < gameHistory.length - 1}
						boardSize={boardSize}
						onBoardSizeChange={handleBoardSizeChange}
					/>
				</div>
			</div>
		</div>
	);
}
