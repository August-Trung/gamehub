import { useCallback, useState } from "react";
import { ChessPiece, Player, PieceType } from "./useChineseChessGame";

type AILevel = "easy" | "medium" | "hard";

interface AIMove {
	piece: ChessPiece;
	to: [number, number];
	score: number;
}

export const useChineseChessAI = (
	level: AILevel = "medium",
	depthLimit: number = 3
) => {
	const [lastAIMove, setLastAIMove] = useState<{
		from: [number, number];
		to: [number, number];
	} | null>(null);

	const getPieceValue = useCallback((type: PieceType): number => {
		switch (type) {
			case "general":
				return 10000;
			case "chariot":
				return 900;
			case "horse":
				return 400;
			case "cannon":
				return 450;
			case "elephant":
				return 200;
			case "advisor":
				return 200;
			case "soldier":
				return 100;
			default:
				return 0;
		}
	}, []);

	const getPositionValue = useCallback((piece: ChessPiece): number => {
		const { type, player, position } = piece;
		const [row, col] = position;
		let value = 0;

		if (type === "soldier") {
			const hasCrossedRiver = player === "red" ? row < 5 : row > 4;
			if (hasCrossedRiver) value += 30;
			if (col > 1 && col < 7) value += 10;
		}

		if (type === "chariot" || type === "cannon") {
			if (col > 0 && col < 8) value += 15;
		}

		if (type === "horse") {
			if (col > 1 && col < 7 && row > 1 && row < 8) value += 20;
		}

		return value;
	}, []);

	const evaluateBoard = useCallback(
		(pieces: ChessPiece[], player: Player): number => {
			return pieces.reduce((acc, p) => {
				const sign = p.player === player ? 1 : -1;
				return (
					acc + sign * (getPieceValue(p.type) + getPositionValue(p))
				);
			}, 0);
		},
		[getPieceValue, getPositionValue]
	);

	const alphaBeta = useCallback(
		(
			pieces: ChessPiece[],
			depth: number,
			alpha: number,
			beta: number,
			isMaximizing: boolean,
			player: Player,
			getValidMoves: (
				piece: ChessPiece,
				pieces: ChessPiece[],
				checkForCheck?: boolean
			) => [number, number][]
		): number => {
			if (depth === 0) return evaluateBoard(pieces, player);

			const currentPlayer = isMaximizing
				? player
				: player === "red"
					? "black"
					: "red";
			const currentPieces = pieces.filter(
				(p) => p.player === currentPlayer
			);

			if (isMaximizing) {
				let maxEval = -Infinity;
				for (const piece of currentPieces) {
					const moves = getValidMoves(piece, pieces, false);
					for (const move of moves) {
						const newPieces = pieces.map((p) => ({ ...p }));
						const moving = newPieces.find((p) => p.id === piece.id);
						if (!moving) continue;
						const idx = newPieces.findIndex(
							(p) =>
								p.position[0] === move[0] &&
								p.position[1] === move[1] &&
								p.player !== piece.player
						);
						if (idx >= 0) newPieces.splice(idx, 1);
						moving.position = move;
						const evalScore = alphaBeta(
							newPieces,
							depth - 1,
							alpha,
							beta,
							false,
							player,
							getValidMoves
						);
						maxEval = Math.max(maxEval, evalScore);
						alpha = Math.max(alpha, evalScore);
						if (beta <= alpha) break;
					}
				}
				return maxEval;
			} else {
				let minEval = Infinity;
				for (const piece of currentPieces) {
					const moves = getValidMoves(piece, pieces, false);
					for (const move of moves) {
						const newPieces = pieces.map((p) => ({ ...p }));
						const moving = newPieces.find((p) => p.id === piece.id);
						if (!moving) continue;
						const idx = newPieces.findIndex(
							(p) =>
								p.position[0] === move[0] &&
								p.position[1] === move[1] &&
								p.player !== piece.player
						);
						if (idx >= 0) newPieces.splice(idx, 1);
						moving.position = move;
						const evalScore = alphaBeta(
							newPieces,
							depth - 1,
							alpha,
							beta,
							true,
							player,
							getValidMoves
						);
						minEval = Math.min(minEval, evalScore);
						beta = Math.min(beta, evalScore);
						if (beta <= alpha) break;
					}
				}
				return minEval;
			}
		},
		[evaluateBoard]
	);

	const getBestMoveAB = useCallback(
		(
			pieces: ChessPiece[],
			player: Player,
			getValidMoves: (
				piece: ChessPiece,
				pieces: ChessPiece[],
				checkForCheck?: boolean
			) => [number, number][]
		): { piece: ChessPiece; to: [number, number] } | null => {
			const aiPieces = pieces.filter((p) => p.player === player);
			let bestMove: AIMove | null = null;
			let bestEval = -Infinity;

			for (const piece of aiPieces) {
				const moves = getValidMoves(piece, pieces, false);
				for (const to of moves) {
					const newPieces = pieces.map((p) => ({ ...p }));
					const moving = newPieces.find((p) => p.id === piece.id);
					if (!moving) continue;
					const idx = newPieces.findIndex(
						(p) =>
							p.position[0] === to[0] &&
							p.position[1] === to[1] &&
							p.player !== piece.player
					);
					if (idx >= 0) newPieces.splice(idx, 1);
					moving.position = to;

					const evalScore = alphaBeta(
						newPieces,
						depthLimit - 1,
						-Infinity,
						Infinity,
						false,
						player,
						getValidMoves
					);
					if (evalScore > bestEval) {
						bestEval = evalScore;
						bestMove = { piece, to, score: evalScore };
					}
				}
			}

			if (bestMove) {
				setLastAIMove({
					from: bestMove.piece.position,
					to: bestMove.to,
				});
			}

			return bestMove ? { piece: bestMove.piece, to: bestMove.to } : null;
		},

		[alphaBeta, depthLimit]
	);

	const resetLastAIMove = () => {
		setLastAIMove(null);
	};

	return {
		getBestMove:
			level === "hard"
				? getBestMoveAB
				: (
						pieces: ChessPiece[],
						player: Player,
						getValidMoves: (
							piece: ChessPiece,
							pieces: ChessPiece[],
							checkForCheck?: boolean
						) => [number, number][]
					) => {
						const aiPieces = pieces.filter(
							(p) => p.player === player
						);
						let bestMoves: AIMove[] = [];

						for (const piece of aiPieces) {
							const validMoves = getValidMoves(
								piece,
								pieces,
								false
							);
							for (const move of validMoves) {
								const score = evaluateBoard(pieces, player);
								bestMoves.push({ piece, to: move, score });
							}
						}

						bestMoves.sort((a, b) => b.score - a.score);
						if (bestMoves.length === 0) return null;

						let topMovesCount =
							level === "easy" ? 5 : level === "medium" ? 3 : 1;
						topMovesCount = Math.min(
							topMovesCount,
							bestMoves.length
						);
						const randomIndex = Math.floor(
							Math.random() * topMovesCount
						);
						const chosen = bestMoves[randomIndex];
						setLastAIMove({
							from: chosen.piece.position,
							to: chosen.to,
						});
						return {
							piece: chosen.piece,
							to: chosen.to,
						};
					},
		lastAIMove,
		resetLastAIMove,
	};
};
