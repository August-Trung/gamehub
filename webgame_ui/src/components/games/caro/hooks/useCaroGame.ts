import { useState, useCallback, useEffect } from "react";
import { useWinCheck } from "./useWinCheck";
import { useTimer, TimerConfig } from "./useTimer";

type Player = "X" | "O";
type BoardState = string[][];

export const useCaroGame = () => {
	const [boardSize, setBoardSize] = useState<number>(15);
	const [board, setBoard] = useState<BoardState>(createEmptyBoard(boardSize));
	const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
	const [winner, setWinner] = useState<Player | null>(null);
	const [winningLine, setWinningLine] = useState<[number, number][] | null>(
		null
	);

	const timerConfig: TimerConfig = {
		initialTime: 5 * 60, // 5 phút
		timeIncrement: 0, // Không sử dụng tăng thời gian để tránh lỗi
	};

	const timer = useTimer(timerConfig);

	const { checkWin } = useWinCheck();

	// Initialize the board when size changes
	useEffect(() => {
		handleRestart();
	}, [boardSize]);

	// Handle a cell click
	const handleCellClick = useCallback(
		(row: number, col: number) => {
			// Không cho phép đánh khi có người thắng, hết giờ, hoặc ô đã được đánh
			if (
				winner ||
				timer.hasTimeOut ||
				board[row][col] ||
				!timer.isRunning
			)
				return;

			// Tạo bàn cờ mới với nước đi
			const newBoard = board.map((rowArray) => [...rowArray]);
			newBoard[row][col] = currentPlayer;

			// Kiểm tra thắng
			const { isWin, winLine } = checkWin(
				newBoard,
				row,
				col,
				currentPlayer
			);

			if (isWin) {
				setWinner(currentPlayer);
				setWinningLine(winLine);
				timer.stopTimer(); // Dừng đồng hồ nếu có người thắng
				setBoard(newBoard);
				return;
			}

			// Cập nhật trạng thái
			setBoard(newBoard);
			const nextPlayer = currentPlayer === "X" ? "O" : "X";
			setCurrentPlayer(nextPlayer);

			// Chuyển đồng hồ sang người chơi tiếp theo
			timer.switchPlayer(nextPlayer);
		},
		[board, currentPlayer, winner, checkWin, timer]
	);

	// Restart the game
	const handleRestart = useCallback(() => {
		const emptyBoard = createEmptyBoard(boardSize);
		setBoard(emptyBoard);
		setCurrentPlayer("X");
		setWinner(null);
		setWinningLine(null);
		timer.resetTimer();
	}, [boardSize, timer]);

	// Handle board size change
	const handleBoardSizeChange = useCallback((size: number) => {
		setBoardSize(size);
	}, []);

	const startGame = useCallback(() => {
		timer.startTimer();
	}, [timer]);

	return {
		board,
		currentPlayer,
		winner,
		winningLine,
		boardSize,
		handleCellClick,
		handleRestart,
		handleBoardSizeChange,
		timeX: timer.formattedTimeX,
		timeO: timer.formattedTimeO,
		isTimerRunning: timer.isRunning,
		hasTimeOut: timer.hasTimeOut,
		timeOutPlayer: timer.timeOutPlayer,
		startGame,
	};
};

// Helper function to create an empty board
function createEmptyBoard(size: number): BoardState {
	return Array(size)
		.fill(null)
		.map(() => Array(size).fill(""));
}
