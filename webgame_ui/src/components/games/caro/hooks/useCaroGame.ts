import { useState, useCallback, useEffect } from "react";
import { useWinCheck } from "./useWinCheck";

type Player = "X" | "O";
type BoardState = string[][];
type HistoryEntry = {
	board: BoardState;
	currentPlayer: Player;
};

export const useCaroGame = () => {
	const [boardSize, setBoardSize] = useState<number>(15);
	const [board, setBoard] = useState<BoardState>(createEmptyBoard(boardSize));
	const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
	const [winner, setWinner] = useState<Player | null>(null);
	const [winningLine, setWinningLine] = useState<[number, number][] | null>(
		null
	);

	// Game history for undo/redo functionality
	const [gameHistory, setGameHistory] = useState<HistoryEntry[]>([
		{
			board: createEmptyBoard(boardSize),
			currentPlayer: "X",
		},
	]);
	const [historyPosition, setHistoryPosition] = useState<number>(0);

	const { checkWin } = useWinCheck();

	// Initialize the board when size changes
	useEffect(() => {
		handleRestart();
	}, [boardSize]);

	// Handle a cell click
	const handleCellClick = useCallback(
		(row: number, col: number) => {
			// Don't allow moves if there's a winner or cell is already filled
			if (winner || board[row][col]) return;

			// Create a new board with the move
			const newBoard = board.map((rowArray) => [...rowArray]);
			newBoard[row][col] = currentPlayer;

			// Check for a win
			const { isWin, winLine } = checkWin(
				newBoard,
				row,
				col,
				currentPlayer
			);

			if (isWin) {
				setWinner(currentPlayer);
				setWinningLine(winLine);
			}

			// Update state
			setBoard(newBoard);
			setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

			// Update history
			const newHistory = gameHistory.slice(0, historyPosition + 1);
			newHistory.push({
				board: newBoard,
				currentPlayer: currentPlayer === "X" ? "O" : "X",
			});
			setGameHistory(newHistory);
			setHistoryPosition(historyPosition + 1);
		},
		[board, currentPlayer, winner, gameHistory, historyPosition, checkWin]
	);

	// Restart the game
	const handleRestart = useCallback(() => {
		const emptyBoard = createEmptyBoard(boardSize);
		setBoard(emptyBoard);
		setCurrentPlayer("X");
		setWinner(null);
		setWinningLine(null);
		setGameHistory([{ board: emptyBoard, currentPlayer: "X" }]);
		setHistoryPosition(0);
	}, [boardSize]);

	// Handle board size change
	const handleBoardSizeChange = useCallback((size: number) => {
		setBoardSize(size);
	}, []);

	// Undo the last move
	const handleUndo = useCallback(() => {
		if (historyPosition > 0) {
			const newPosition = historyPosition - 1;
			const { board: prevBoard, currentPlayer: prevPlayer } =
				gameHistory[newPosition];

			setBoard(prevBoard);
			setCurrentPlayer(prevPlayer);
			setHistoryPosition(newPosition);
			setWinner(null);
			setWinningLine(null);
		}
	}, [historyPosition, gameHistory]);

	// Redo a previously undone move
	const handleRedo = useCallback(() => {
		if (historyPosition < gameHistory.length - 1) {
			const newPosition = historyPosition + 1;
			const { board: nextBoard, currentPlayer: nextPlayer } =
				gameHistory[newPosition];

			setBoard(nextBoard);
			setCurrentPlayer(nextPlayer);
			setHistoryPosition(newPosition);

			// Check if this was a winning move
			if (
				newPosition === gameHistory.length - 1 &&
				gameHistory.length > 1
			) {
				// Find the last move to check for win
				let lastRow = -1;
				let lastCol = -1;
				const prevBoard = gameHistory[newPosition - 1].board;
				const lastPlayer = nextPlayer === "X" ? "O" : "X";

				for (let i = 0; i < boardSize; i++) {
					for (let j = 0; j < boardSize; j++) {
						if (nextBoard[i][j] !== prevBoard[i][j]) {
							lastRow = i;
							lastCol = j;
							break;
						}
					}
					if (lastRow !== -1) break;
				}

				if (lastRow !== -1) {
					const { isWin, winLine } = checkWin(
						nextBoard,
						lastRow,
						lastCol,
						lastPlayer
					);
					if (isWin) {
						setWinner(lastPlayer);
						setWinningLine(winLine);
					}
				}
			}
		}
	}, [historyPosition, gameHistory, boardSize, checkWin]);

	return {
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
	};
};

// Helper function to create an empty board
function createEmptyBoard(size: number): BoardState {
	return Array(size)
		.fill(null)
		.map(() => Array(size).fill(""));
}
