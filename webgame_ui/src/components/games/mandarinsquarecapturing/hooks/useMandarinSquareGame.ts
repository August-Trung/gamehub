import { useCallback, useMemo, useState } from "react";
import type { AnimationState } from "./useMandarinAnimation";

export interface GameState {
	board: number[];
	scores: [number, number];
	borrowedSeeds: [number, number];
}

const TOTAL_POCKETS = 12;
const PLAYER1_POCKETS = [0, 1, 2, 3, 4];
const PLAYER2_POCKETS = [6, 7, 8, 9, 10];
const MANDARIN_INDICES = [5, 11];
const SEEDS_PER_REFILL = 5;
const MANDARIN_VALUE = 10;

const INITIAL_STATE: GameState = {
	board: [5, 5, 5, 5, 5, 10, 5, 5, 5, 5, 5, 10],
	scores: [0, 0],
	borrowedSeeds: [0, 0],
};

const getNextIndex = (index: number, direction: 1 | -1) => {
	const next = (index + direction) % TOTAL_POCKETS;
	return next < 0 ? next + TOTAL_POCKETS : next;
};

export const useMandarinSquareGame = () => {
	const [gameState, setGameState] = useState<GameState>({ ...INITIAL_STATE });
	const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
	const [selectedPocket, setSelectedPocket] = useState<number | null>(null);
	const [isGameOver, setIsGameOver] = useState(false);
	const [winner, setWinner] = useState<1 | 2 | null>(null);
	const [message, setMessage] = useState("");
	const [sowDirection, setSowDirection] = useState<1 | -1>(1);

	const animationState = useMemo<AnimationState>(
		() => ({
			isAnimating: false,
			currentSowingIndex: null,
			animationDirection:
				sowDirection === 1 ? "counterclockwise" : "clockwise",
			lastSownIndex: null,
		}),
		[sowDirection],
	);

	const getPlayerPockets = useCallback(
		(player: 1 | 2) => (player === 1 ? PLAYER1_POCKETS : PLAYER2_POCKETS),
		[],
	);

	const areAllPlayerPocketsEmpty = useCallback(
		(state: GameState, player: 1 | 2) => {
			const pockets = getPlayerPockets(player);
			return pockets.every((idx) => state.board[idx] === 0);
		},
		[getPlayerPockets],
	);

	const handleEmptyPockets = useCallback(
		(state: GameState, player: 1 | 2) => {
			const pockets = getPlayerPockets(player);
			const playerIndex = player - 1;
			const newState = { ...state, board: [...state.board], scores: [...state.scores], borrowedSeeds: [...state.borrowedSeeds] } as GameState;

			if (newState.scores[playerIndex] >= SEEDS_PER_REFILL) {
				newState.scores[playerIndex] -= SEEDS_PER_REFILL;
			} else {
				const needed = SEEDS_PER_REFILL - newState.scores[playerIndex];
				newState.borrowedSeeds[playerIndex] += needed;
				newState.scores[playerIndex] = 0;
			}

			pockets.forEach((idx) => {
				newState.board[idx] = 1;
			});

			return newState;
		},
		[getPlayerPockets],
	);

	const checkGameOver = useCallback(
		(state: GameState) => {
			const player1HasSeeds =
				!areAllPlayerPocketsEmpty(state, 1) || state.scores[0] >= SEEDS_PER_REFILL;
			const player2HasSeeds =
				!areAllPlayerPocketsEmpty(state, 2) || state.scores[1] >= SEEDS_PER_REFILL;

			if (!player1HasSeeds && !player2HasSeeds) {
				const finalScores: [number, number] = [
					state.scores[0] - state.borrowedSeeds[0],
					state.scores[1] - state.borrowedSeeds[1],
				];

				let winner: 1 | 2 | null = null;
				if (finalScores[0] > finalScores[1]) winner = 1;
				else if (finalScores[1] > finalScores[0]) winner = 2;

				setIsGameOver(true);
				setWinner(winner);
				setMessage(
					winner
						? `Player ${winner} thắng với tỉ số ${finalScores[0]} - ${finalScores[1]}.`
						: "Hoà điểm!"
				);

				return true;
			}
			return false;
		},
		[areAllPlayerPocketsEmpty],
	);

	const selectPocket = useCallback(
		(index: number) => {
			if (isGameOver) return;
			const pockets = getPlayerPockets(currentPlayer);
			if (!pockets.includes(index)) return;
			if (gameState.board[index] === 0) return;
			setSelectedPocket(index);
		},
		[isGameOver, currentPlayer, getPlayerPockets, gameState.board],
	);

	const makeMove = useCallback(() => {
		if (selectedPocket === null || isGameOver) return;
		const pockets = getPlayerPockets(currentPlayer);
		if (!pockets.includes(selectedPocket)) return;
		if (gameState.board[selectedPocket] === 0) return;

		const direction = sowDirection;
		const newBoard = [...gameState.board];
		const newScores = [...gameState.scores] as [number, number];
		const borrowedSeeds = [...gameState.borrowedSeeds] as [number, number];

		let seeds = newBoard[selectedPocket];
		let currentIndex = selectedPocket;
		newBoard[currentIndex] = 0;

		const playerIndex = currentPlayer - 1;

		const sowSeeds = () => {
			while (seeds > 0) {
				currentIndex = getNextIndex(currentIndex, direction);
				newBoard[currentIndex] += 1;
				seeds--;
			}
		};

		sowSeeds();

		let continueTurn = true;
		let switchPlayer = true;

		while (continueTurn) {
			const nextIndex = getNextIndex(currentIndex, direction);

			if (newBoard[nextIndex] > 0 && !MANDARIN_INDICES.includes(currentIndex)) {
				// Pick up and continue
				seeds = newBoard[nextIndex];
				newBoard[nextIndex] = 0;
				currentIndex = nextIndex;
				switchPlayer = false;
				sowSeeds();
				continue;
			}

			if (newBoard[nextIndex] === 0) {
				let emptyCount = 0;
				let checkIndex = nextIndex;

				while (true) {
					checkIndex = getNextIndex(checkIndex, direction);
					if (checkIndex === nextIndex) break;
					if (newBoard[checkIndex] === 0) {
						emptyCount++;
						continue;
					}
					break;
				}

				if (emptyCount === 1 && newBoard[checkIndex] > 0) {
					const captured = newBoard[checkIndex];
					newBoard[checkIndex] = 0;
					if (MANDARIN_INDICES.includes(checkIndex)) {
						newScores[playerIndex] += MANDARIN_VALUE;
					} else {
						newScores[playerIndex] += captured;
					}
					currentIndex = checkIndex;
					switchPlayer = false;
					continue;
				}
			}

			continueTurn = false;
		}

		const updatedState: GameState = {
			board: newBoard,
			scores: newScores,
			borrowedSeeds,
		};

		setGameState(updatedState);
		setSelectedPocket(null);
		setMessage(
			`Player ${currentPlayer} đi ${direction === 1 ? "ngược chiều kim đồng hồ" : "thuận chiều kim đồng hồ"}.`
		);

		const ended = checkGameOver(updatedState);
		if (!ended && switchPlayer) {
			const nextPlayer = currentPlayer === 1 ? 2 : 1;
			let stateForNext = updatedState;
			if (areAllPlayerPocketsEmpty(updatedState, nextPlayer)) {
				stateForNext = handleEmptyPockets(updatedState, nextPlayer);
				setGameState(stateForNext);
			}
			setCurrentPlayer(nextPlayer);
		}
	}, [
		selectedPocket,
		isGameOver,
		getPlayerPockets,
		currentPlayer,
		gameState,
		sowDirection,
		checkGameOver,
		areAllPlayerPocketsEmpty,
		handleEmptyPockets,
	]);

	const resetGame = useCallback(() => {
		setGameState({ ...INITIAL_STATE });
		setCurrentPlayer(1);
		setSelectedPocket(null);
		setIsGameOver(false);
		setWinner(null);
		setMessage("");
	}, []);

	return {
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
		sowDirection,
		setSowDirection,
	};
};
