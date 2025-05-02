import { useState, useCallback, useRef } from "react";
import { useMandarinAnimation } from "./useMandarinAnimation";

export interface GameState {
	board: number[]; // 12 pockets: 10 regular pockets and 2 mandarin pockets (indices 5 and 11)
	scores: [number, number]; // Scores for player 1 and 2
	borrowedSeeds: [number, number]; // Seeds borrowed by each player
}

const INITIAL_STATE: GameState = {
	board: [
		5,
		5,
		5,
		5,
		5, // Player 1's regular pockets (0-4)
		10, // Mandarin pocket (5)
		5,
		5,
		5,
		5,
		5, // Player 2's regular pockets (6-10)
		10, // Mandarin pocket (11)
	],
	scores: [0, 0],
	borrowedSeeds: [0, 0],
};

const MANDARIN_INDICES = [5, 11];
const MANDARIN_VALUE = 10;
const SEEDS_PER_REFILL = 5;
const ANIMATION_DELAY = 300; // ms between seed movements

export const useMandarinSquareGame = () => {
	const [gameState, setGameState] = useState<GameState>({ ...INITIAL_STATE });
	const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
	const [selectedPocket, setSelectedPocket] = useState<number | null>(null);
	const [isGameOver, setIsGameOver] = useState(false);
	const [winner, setWinner] = useState<1 | 2 | null>(null);
	const [message, setMessage] = useState<string>("");

	// Animation state
	const {
		animationState,
		startAnimation,
		updateAnimationIndex,
		stopAnimation,
	} = useMandarinAnimation();

	// Use a ref to store timeouts so we can clear them if needed
	const animationTimeoutsRef = useRef<number[]>([]);

	// Get player's pocket range
	const getPlayerPockets = useCallback((player: 1 | 2) => {
		return player === 1 ? [0, 1, 2, 3, 4] : [6, 7, 8, 9, 10];
	}, []);

	// Check if all player's pockets are empty
	const areAllPlayerPocketsEmpty = useCallback(
		(state: GameState, player: 1 | 2) => {
			const playerPockets = getPlayerPockets(player);
			return playerPockets.every((idx) => state.board[idx] === 0);
		},
		[getPlayerPockets]
	);

	// Clear all animation timeouts
	const clearAnimationTimeouts = useCallback(() => {
		animationTimeoutsRef.current.forEach((timeoutId) =>
			window.clearTimeout(timeoutId)
		);
		animationTimeoutsRef.current = [];
	}, []);

	// Handle refilling pockets when all pockets are empty
	const handleEmptyPockets = useCallback(
		(state: GameState, player: 1 | 2) => {
			const newState = { ...state };
			const playerPockets = getPlayerPockets(player);
			const playerIndex = player - 1;

			// If player has enough seeds in their score
			if (newState.scores[playerIndex] >= SEEDS_PER_REFILL) {
				// Subtract from score and refill pockets
				newState.scores[playerIndex] -= SEEDS_PER_REFILL;

				// Refill each pocket with 1 seed
				playerPockets.forEach((idx) => {
					newState.board[idx] = 1;
				});

				setMessage(
					`Player ${player} refilled their pockets with 5 seeds from their score.`
				);
			}
			// If player doesn't have enough seeds, they need to borrow
			else {
				const seedsNeeded =
					SEEDS_PER_REFILL - newState.scores[playerIndex];

				// Borrow seeds from the other player
				newState.borrowedSeeds[playerIndex] += seedsNeeded;
				newState.scores[playerIndex] += seedsNeeded;

				// Refill each pocket with 1 seed
				playerPockets.forEach((idx) => {
					newState.board[idx] = 1;
				});

				setMessage(
					`Player ${player} borrowed ${seedsNeeded} seeds from Player ${player === 1 ? 2 : 1}.`
				);
			}

			return newState;
		},
		[getPlayerPockets]
	);

	// Check if the game is over
	const checkGameOver = useCallback(
		(state: GameState) => {
			// Check if both players have no seeds left in pockets and no ability to refill
			const player1HasSeeds =
				!areAllPlayerPocketsEmpty(state, 1) ||
				state.scores[0] >= SEEDS_PER_REFILL;
			const player2HasSeeds =
				!areAllPlayerPocketsEmpty(state, 2) ||
				state.scores[1] >= SEEDS_PER_REFILL;

			if (!player1HasSeeds || !player2HasSeeds) {
				// Collect all remaining seeds
				const remainingSeeds = state.board.reduce((sum, count, idx) => {
					// Don't count mandarin pockets
					if (MANDARIN_INDICES.includes(idx)) return sum;
					return sum + count;
				}, 0);

				// Final score calculation accounting for borrowed seeds
				const newScores = [...state.scores] as [number, number];

				// Add remaining seeds to the player who still has seeds
				if (!player1HasSeeds && player2HasSeeds) {
					newScores[1] += remainingSeeds;
				} else if (!player2HasSeeds && player1HasSeeds) {
					newScores[0] += remainingSeeds;
				}

				// Adjust for borrowed seeds
				newScores[0] -= state.borrowedSeeds[0];
				newScores[1] -= state.borrowedSeeds[1];

				// Determine the winner
				let gameWinner: 1 | 2 | null = null;
				if (newScores[0] > newScores[1]) {
					gameWinner = 1;
				} else if (newScores[1] > newScores[0]) {
					gameWinner = 2;
				}

				// Update the game state
				setGameState((prev) => ({
					...prev,
					board: state.board.map((_, idx) =>
						MANDARIN_INDICES.includes(idx) ? state.board[idx] : 0
					),
					scores: newScores,
				}));
				setIsGameOver(true);
				setWinner(gameWinner);
				return true;
			}
			return false;
		},
		[areAllPlayerPocketsEmpty]
	);

	// Select a pocket
	const selectPocket = useCallback(
		(index: number) => {
			// Only select pockets belonging to the current player that have seeds
			const playerPockets = getPlayerPockets(currentPlayer);

			if (playerPockets.includes(index) && gameState.board[index] > 0) {
				setSelectedPocket(index);
				setMessage("");
			}
		},
		[currentPlayer, gameState.board, getPlayerPockets]
	);

	// Animated version of makeMove
	const makeMove = useCallback(() => {
		if (selectedPocket === null || animationState.isAnimating) return;

		// Clear any existing animation timeouts
		clearAnimationTimeouts();

		// Start with a copy of the current state
		let newBoard = [...gameState.board];
		let newScores = [...gameState.scores] as [number, number];
		let borrowedSeeds = [...gameState.borrowedSeeds] as [number, number];

		// This will track all the animation steps
		type AnimationStep = {
			action: "pickup" | "sow" | "capture";
			pocketIndex: number;
			count?: number;
		};

		const animationSteps: AnimationStep[] = [];

		// Initial pickup
		let currentIndex = selectedPocket;
		let seeds = newBoard[currentIndex];

		animationSteps.push({
			action: "pickup",
			pocketIndex: currentIndex,
			count: seeds,
		});

		newBoard[currentIndex] = 0;

		// Main game loop (similar to the original logic but collecting animation steps)
		let shouldContinue = true;
		let switchPlayer = true;

		while (shouldContinue && seeds > 0) {
			// Sow seeds
			while (seeds > 0) {
				currentIndex = (currentIndex + 1) % 12;

				// Skip the starting pocket if it's the first round
				if (
					currentIndex !== selectedPocket ||
					seeds < gameState.board[selectedPocket]
				) {
					animationSteps.push({
						action: "sow",
						pocketIndex: currentIndex,
					});

					newBoard[currentIndex]++;
					seeds--;
				}
			}

			// Check the next pocket after the last seed was sown
			const nextIndex = (currentIndex + 1) % 12;

			// If the ending pocket has seeds and the next pocket also has seeds,
			// pick up those seeds and continue sowing (Rule 1)
			if (newBoard[nextIndex] > 0) {
				currentIndex = nextIndex;
				seeds = newBoard[currentIndex];

				animationSteps.push({
					action: "pickup",
					pocketIndex: currentIndex,
					count: seeds,
				});

				newBoard[currentIndex] = 0;
				shouldContinue = true;
				switchPlayer = false; // Don't switch yet
			}
			// If the ending pocket is empty and the next one has seeds, capture (Rule 2 & 3)
			else if (newBoard[currentIndex] === 0) {
				// Look for the next non-empty pocket
				let checkIndex = nextIndex;
				let emptyCount = 0;

				while (newBoard[checkIndex] === 0) {
					emptyCount++;
					checkIndex = (checkIndex + 1) % 12;

					// If we've gone all the way around the board
					if (checkIndex === nextIndex) {
						shouldContinue = false;
						break;
					}
				}

				// If there's exactly one empty pocket between (Rule 3)
				if (emptyCount === 1 && newBoard[checkIndex] > 0) {
					// Capture the seeds
					const capturedSeeds = newBoard[checkIndex];

					animationSteps.push({
						action: "capture",
						pocketIndex: checkIndex,
						count: capturedSeeds,
					});

					newBoard[checkIndex] = 0;

					// Add to score: if mandarin then +10, else +1 for each seed
					if (MANDARIN_INDICES.includes(checkIndex)) {
						newScores[currentPlayer - 1] += MANDARIN_VALUE;
					} else {
						newScores[currentPlayer - 1] += capturedSeeds;
					}

					// Continue from this position (Rule 4 - rich pocket)
					currentIndex = checkIndex;
					seeds = 0; // No seeds to pick up
					shouldContinue = true;
					switchPlayer = false;
				}
				// If there's more than one empty pocket or it's a mandarin (Rule 5)
				else {
					shouldContinue = false;
				}
			}
			// Otherwise, end turn
			else {
				shouldContinue = false;
			}
		}

		// Start the animation sequence
		startAnimation(selectedPocket);

		// Execute animation steps with delays
		let delay = 0;
		const finalState = {
			board: newBoard,
			scores: newScores,
			borrowedSeeds: borrowedSeeds,
		};

		// Process each animation step with a delay
		animationSteps.forEach((step, index) => {
			const timeoutId = window.setTimeout(() => {
				// Update the visual state based on the step
				updateAnimationIndex(step.pocketIndex);

				// If it's the last step, perform final updates
				if (index === animationSteps.length - 1) {
					const timeoutId = window.setTimeout(() => {
						// Complete final updates
						setGameState(finalState);
						setSelectedPocket(null);
						stopAnimation();

						// Check for game over
						const gameEnded = checkGameOver(finalState);

						// Switch players if game not over and player should switch
						if (!gameEnded && switchPlayer) {
							const nextPlayer = currentPlayer === 1 ? 2 : 1;

							// Check if next player's pockets are all empty (Rule 6)
							if (
								areAllPlayerPocketsEmpty(finalState, nextPlayer)
							) {
								const updatedState = handleEmptyPockets(
									finalState,
									nextPlayer
								);
								setGameState(updatedState);
							}

							setCurrentPlayer(nextPlayer);
						}
					}, ANIMATION_DELAY);

					animationTimeoutsRef.current.push(timeoutId);
				}

				// Update the intermediate state for visualization
				setGameState((prev) => {
					const boardCopy = [...prev.board];

					if (step.action === "pickup") {
						boardCopy[step.pocketIndex] = 0;
					} else if (step.action === "sow") {
						boardCopy[step.pocketIndex] =
							(boardCopy[step.pocketIndex] || 0) + 1;
					} else if (step.action === "capture") {
						boardCopy[step.pocketIndex] = 0;
					}

					return {
						...prev,
						board: boardCopy,
						scores:
							step.action === "capture" ? newScores : prev.scores,
					};
				});
			}, delay);

			animationTimeoutsRef.current.push(timeoutId);
			delay += ANIMATION_DELAY;
		});
	}, [
		selectedPocket,
		gameState,
		currentPlayer,
		animationState.isAnimating,
		clearAnimationTimeouts,
		checkGameOver,
		areAllPlayerPocketsEmpty,
		handleEmptyPockets,
		startAnimation,
		updateAnimationIndex,
		stopAnimation,
	]);

	// Reset the game
	const resetGame = useCallback(() => {
		clearAnimationTimeouts();
		stopAnimation();
		setGameState({ ...INITIAL_STATE });
		setCurrentPlayer(1);
		setSelectedPocket(null);
		setIsGameOver(false);
		setWinner(null);
		setMessage("");
	}, [clearAnimationTimeouts, stopAnimation]);

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
	};
};
