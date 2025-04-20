// hooks/useChessGame.ts
import { useState, useCallback } from "react";

// Define piece types and colors
export type PieceType =
	| "pawn"
	| "rook"
	| "knight"
	| "bishop"
	| "queen"
	| "king";
export type PieceColor = "white" | "black";

export interface ChessPiece {
	type: PieceType;
	color: PieceColor;
	hasMoved: boolean;
}

export type Position = {
	row: number;
	col: number;
};

export type Move = {
	from: Position;
	to: Position;
	piece: ChessPiece;
	capturedPiece?: ChessPiece;
	isCheck?: boolean;
	isCheckmate?: boolean;
	isPromotion?: boolean;
	isCastle?: boolean;
	isEnPassant?: boolean;
};

export type Board = (ChessPiece | null)[][];

const initialBoard: Board = Array(8)
	.fill(null)
	.map(() => Array(8).fill(null));

// Initialize pieces
// Back row pieces
for (let col = 0; col < 8; col++) {
	// Black pieces (top row)
	let type: PieceType;
	if (col === 0 || col === 7) type = "rook";
	else if (col === 1 || col === 6) type = "knight";
	else if (col === 2 || col === 5) type = "bishop";
	else if (col === 3) type = "queen";
	else type = "king";

	initialBoard[0][col] = { type, color: "black", hasMoved: false };

	// White pieces (bottom row)
	initialBoard[7][col] = { type, color: "white", hasMoved: false };
}

// Pawns
for (let col = 0; col < 8; col++) {
	initialBoard[1][col] = { type: "pawn", color: "black", hasMoved: false };
	initialBoard[6][col] = { type: "pawn", color: "white", hasMoved: false };
}

const useChessGame = () => {
	const [board, setBoard] = useState<Board>(initialBoard);
	const [currentPlayer, setCurrentPlayer] = useState<PieceColor>("white");
	const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
	const [moveHistory, setMoveHistory] = useState<Move[]>([]);
	const [capturedPieces, setCapturedPieces] = useState<ChessPiece[]>([]);
	const [validMoves, setValidMoves] = useState<Position[]>([]);
	const [isCheck, setIsCheck] = useState(false);
	const [isCheckmate, setIsCheckmate] = useState(false);

	// Convert algebraic notation (e.g., "e4") to array indices
	const algebraicToPosition = (algebraic: string): Position => {
		const col = algebraic.charCodeAt(0) - 97; // 'a' -> 0, 'b' -> 1, etc.
		const row = 8 - parseInt(algebraic.charAt(1)); // '1' -> 7, '2' -> 6, etc.
		return { row, col };
	};

	// Convert array indices to algebraic notation
	const positionToAlgebraic = (position: Position): string => {
		const col = String.fromCharCode(97 + position.col); // 0 -> 'a', 1 -> 'b', etc.
		const row = 8 - position.row; // 7 -> '1', 6 -> '2', etc.
		return `${col}${row}`;
	};

	// Check if position is within bounds
	const isValidPosition = (pos: Position): boolean => {
		return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
	};

	// Get all valid moves for a piece
	const getValidMoves = useCallback(
		(pos: Position): Position[] => {
			const piece = board[pos.row][pos.col];
			if (!piece || piece.color !== currentPlayer) return [];

			const moves: Position[] = [];

			// Helper to check if a position has an opponent's piece
			const hasOpponent = (r: number, c: number): boolean => {
				return !!board[r][c] && board[r][c]?.color !== piece.color;
			};

			// Helper to check if a position is empty
			const isEmpty = (r: number, c: number): boolean => {
				return board[r][c] === null;
			};

			// Check the specific piece's movement rules
			switch (piece.type) {
				case "pawn": {
					const direction = piece.color === "white" ? -1 : 1;
					const startingRow = piece.color === "white" ? 6 : 1;

					// Forward move
					if (
						isValidPosition({
							row: pos.row + direction,
							col: pos.col,
						}) &&
						isEmpty(pos.row + direction, pos.col)
					) {
						moves.push({ row: pos.row + direction, col: pos.col });

						// Double move from starting position
						if (
							pos.row === startingRow &&
							isEmpty(pos.row + direction, pos.col) &&
							isEmpty(pos.row + 2 * direction, pos.col)
						) {
							moves.push({
								row: pos.row + 2 * direction,
								col: pos.col,
							});
						}
					}

					// Capture moves
					const captureCols = [pos.col - 1, pos.col + 1];
					for (const col of captureCols) {
						if (
							isValidPosition({
								row: pos.row + direction,
								col,
							}) &&
							hasOpponent(pos.row + direction, col)
						) {
							moves.push({ row: pos.row + direction, col });
						}
					}

					// En passant (simplified implementation)
					if (moveHistory.length > 0) {
						const lastMove = moveHistory[moveHistory.length - 1];
						if (
							lastMove.piece.type === "pawn" &&
							Math.abs(lastMove.from.row - lastMove.to.row) ===
								2 &&
							lastMove.to.row === pos.row &&
							Math.abs(lastMove.to.col - pos.col) === 1
						) {
							moves.push({
								row: pos.row + direction,
								col: lastMove.to.col,
							});
						}
					}
					break;
				}

				case "rook": {
					// Horizontal and vertical moves
					const directions = [
						{ dr: 0, dc: 1 }, // right
						{ dr: 0, dc: -1 }, // left
						{ dr: 1, dc: 0 }, // down
						{ dr: -1, dc: 0 }, // up
					];

					for (const dir of directions) {
						let r = pos.row + dir.dr;
						let c = pos.col + dir.dc;

						while (isValidPosition({ row: r, col: c })) {
							if (isEmpty(r, c)) {
								moves.push({ row: r, col: c });
							} else if (hasOpponent(r, c)) {
								moves.push({ row: r, col: c });
								break;
							} else {
								break; // blocked by friendly piece
							}
							r += dir.dr;
							c += dir.dc;
						}
					}
					break;
				}

				case "knight": {
					const knightMoves = [
						{ dr: -2, dc: -1 },
						{ dr: -2, dc: 1 },
						{ dr: -1, dc: -2 },
						{ dr: -1, dc: 2 },
						{ dr: 1, dc: -2 },
						{ dr: 1, dc: 2 },
						{ dr: 2, dc: -1 },
						{ dr: 2, dc: 1 },
					];

					for (const move of knightMoves) {
						const r = pos.row + move.dr;
						const c = pos.col + move.dc;

						if (
							isValidPosition({ row: r, col: c }) &&
							(isEmpty(r, c) || hasOpponent(r, c))
						) {
							moves.push({ row: r, col: c });
						}
					}
					break;
				}

				case "bishop": {
					// Diagonal moves
					const directions = [
						{ dr: 1, dc: 1 }, // down-right
						{ dr: 1, dc: -1 }, // down-left
						{ dr: -1, dc: 1 }, // up-right
						{ dr: -1, dc: -1 }, // up-left
					];

					for (const dir of directions) {
						let r = pos.row + dir.dr;
						let c = pos.col + dir.dc;

						while (isValidPosition({ row: r, col: c })) {
							if (isEmpty(r, c)) {
								moves.push({ row: r, col: c });
							} else if (hasOpponent(r, c)) {
								moves.push({ row: r, col: c });
								break;
							} else {
								break; // blocked by friendly piece
							}
							r += dir.dr;
							c += dir.dc;
						}
					}
					break;
				}

				case "queen": {
					// Combine rook and bishop moves
					const directions = [
						{ dr: 0, dc: 1 }, // right
						{ dr: 0, dc: -1 }, // left
						{ dr: 1, dc: 0 }, // down
						{ dr: -1, dc: 0 }, // up
						{ dr: 1, dc: 1 }, // down-right
						{ dr: 1, dc: -1 }, // down-left
						{ dr: -1, dc: 1 }, // up-right
						{ dr: -1, dc: -1 }, // up-left
					];

					for (const dir of directions) {
						let r = pos.row + dir.dr;
						let c = pos.col + dir.dc;

						while (isValidPosition({ row: r, col: c })) {
							if (isEmpty(r, c)) {
								moves.push({ row: r, col: c });
							} else if (hasOpponent(r, c)) {
								moves.push({ row: r, col: c });
								break;
							} else {
								break; // blocked by friendly piece
							}
							r += dir.dr;
							c += dir.dc;
						}
					}
					break;
				}

				case "king": {
					const kingMoves = [
						{ dr: -1, dc: -1 },
						{ dr: -1, dc: 0 },
						{ dr: -1, dc: 1 },
						{ dr: 0, dc: -1 },
						{ dr: 0, dc: 1 },
						{ dr: 1, dc: -1 },
						{ dr: 1, dc: 0 },
						{ dr: 1, dc: 1 },
					];

					// Normal king moves
					for (const move of kingMoves) {
						const r = pos.row + move.dr;
						const c = pos.col + move.dc;

						if (
							isValidPosition({ row: r, col: c }) &&
							(isEmpty(r, c) || hasOpponent(r, c))
						) {
							moves.push({ row: r, col: c });
						}
					}

					// Castling (simplified implementation)
					if (!piece.hasMoved && !isCheck) {
						const row = pos.row;

						// Queenside castling
						if (
							board[row][0]?.type === "rook" &&
							!board[row][0]?.hasMoved &&
							isEmpty(row, 1) &&
							isEmpty(row, 2) &&
							isEmpty(row, 3)
						) {
							moves.push({ row, col: 2 });
						}

						// Kingside castling
						if (
							board[row][7]?.type === "rook" &&
							!board[row][7]?.hasMoved &&
							isEmpty(row, 5) &&
							isEmpty(row, 6)
						) {
							moves.push({ row, col: 6 });
						}
					}
					break;
				}
			}

			const safeMovesOnly = moves.filter(
				(movePos) =>
					!wouldMoveLeaveKingInCheck(
						pos,
						movePos,
						currentPlayer,
						board
					)
			);

			// This is a simplified implementation without check validation
			// In a complete chess game, we would filter moves that leave the king in check
			return safeMovesOnly;
		},
		[board, currentPlayer, isCheck, moveHistory]
	);

	// Handle piece selection
	const selectPiece = (pos: Position) => {
		if (isCheckmate) return;

		const piece = board[pos.row][pos.col];

		if (piece && piece.color === currentPlayer) {
			setSelectedPiece(pos);
			setValidMoves(getValidMoves(pos));
		} else if (
			selectedPiece &&
			validMoves.some((m) => m.row === pos.row && m.col === pos.col)
		) {
			// Move the piece if the position is a valid move
			movePiece(selectedPiece, pos);
		} else {
			// Deselect if clicking elsewhere
			setSelectedPiece(null);
			setValidMoves([]);
		}
	};

	// Move piece implementation
	const movePiece = (from: Position, to: Position) => {
		const piece = board[from.row][from.col];
		if (!piece) return;

		if (isCheckmate) return;

		const targetPiece = board[to.row][to.col];
		if (targetPiece && targetPiece.type === "king") {
			// Instead of capturing the king, this should result in checkmate
			return;
		}

		const newBoard = board.map((row) => [...row]);
		const capturedPiece = newBoard[to.row][to.col];

		// Create move record
		const move: Move = {
			from,
			to,
			piece,
			capturedPiece: capturedPiece || undefined,
		};

		// Special move: Castling
		if (piece.type === "king" && Math.abs(from.col - to.col) > 1) {
			move.isCastle = true;

			// Move the rook too
			if (to.col === 2) {
				// Queenside
				newBoard[to.row][3] = newBoard[to.row][0];
				newBoard[to.row][3]!.hasMoved = true;
				newBoard[to.row][0] = null;
			} else if (to.col === 6) {
				// Kingside
				newBoard[to.row][5] = newBoard[to.row][7];
				newBoard[to.row][5]!.hasMoved = true;
				newBoard[to.row][7] = null;
			}
		}

		// Special move: En passant capture
		if (piece.type === "pawn" && from.col !== to.col && !capturedPiece) {
			move.isEnPassant = true;
			const captureRow = from.row;
			const capturedPawn = newBoard[captureRow][to.col];
			if (capturedPawn) {
				move.capturedPiece = capturedPawn;
				newBoard[captureRow][to.col] = null;
				setCapturedPieces([...capturedPieces, capturedPawn]);
			}
		}

		// Update the piece's hasMoved status
		newBoard[to.row][to.col] = { ...piece, hasMoved: true };
		newBoard[from.row][from.col] = null;

		// Handle pawn promotion (simplification - auto-promote to queen)
		if (piece.type === "pawn" && (to.row === 0 || to.row === 7)) {
			move.isPromotion = true;
			newBoard[to.row][to.col] = {
				type: "queen",
				color: piece.color,
				hasMoved: true,
			};
		}

		// Add captured piece to the list
		if (capturedPiece && !move.isEnPassant) {
			setCapturedPieces([...capturedPieces, capturedPiece]);
		}

		// Update game state
		setBoard(newBoard);
		setMoveHistory([...moveHistory, move]);
		setSelectedPiece(null);
		setValidMoves([]);
		setCurrentPlayer(currentPlayer === "white" ? "black" : "white");

		// Check for check/checkmate (simplified implementation)
		checkForCheckAndMate(
			newBoard,
			currentPlayer === "white" ? "black" : "white"
		);
	};

	// Check if king is in check and if it's checkmate
	const checkForCheckAndMate = (board: Board, playerColor: PieceColor) => {
		// Find king position
		let kingPos: Position | null = null;
		for (let r = 0; r < 8; r++) {
			for (let c = 0; c < 8; c++) {
				const piece = board[r][c];
				if (
					piece &&
					piece.type === "king" &&
					piece.color === playerColor
				) {
					kingPos = { row: r, col: c };
					break;
				}
			}
			if (kingPos) break;
		}

		if (!kingPos) {
			// This should never happen in a valid chess game
			setIsCheckmate(true);
			return;
		}

		// Check if any opponent piece can capture the king
		const opponentColor = playerColor === "white" ? "black" : "white";
		let inCheck = false;

		// Check if the king is under attack
		for (let r = 0; r < 8; r++) {
			for (let c = 0; c < 8; c++) {
				const piece = board[r][c];
				if (piece && piece.color === opponentColor) {
					const canAttackKing = checkIfPieceCanAttack(
						{ row: r, col: c },
						kingPos,
						piece,
						board
					);

					if (canAttackKing) {
						inCheck = true;
						break;
					}
				}
			}
			if (inCheck) break;
		}

		setIsCheck(inCheck);

		// If king is in check, check for checkmate
		if (inCheck) {
			let hasLegalMove = false;

			// Check all pieces of the current player
			for (let r = 0; r < 8; r++) {
				for (let c = 0; c < 8; c++) {
					const piece = board[r][c];
					if (piece && piece.color === playerColor) {
						const pos = { row: r, col: c };

						// Generate valid moves based on piece type
						const potentialMoves: Position[] = [];

						// Based on piece type, add potential destination squares
						switch (piece.type) {
							case "pawn": {
								const direction =
									piece.color === "white" ? -1 : 1;
								const startingRow =
									piece.color === "white" ? 6 : 1;

								// Forward moves
								if (
									isValidPosition({
										row: r + direction,
										col: c,
									})
								) {
									if (!board[r + direction][c]) {
										potentialMoves.push({
											row: r + direction,
											col: c,
										});

										// Double move from starting position
										if (
											r === startingRow &&
											!board[r + 2 * direction][c]
										) {
											potentialMoves.push({
												row: r + 2 * direction,
												col: c,
											});
										}
									}
								}

								// Capture moves
								for (const dc of [-1, 1]) {
									if (
										isValidPosition({
											row: r + direction,
											col: c + dc,
										})
									) {
										const targetPiece =
											board[r + direction][c + dc];
										if (
											targetPiece &&
											targetPiece.color !== piece.color
										) {
											potentialMoves.push({
												row: r + direction,
												col: c + dc,
											});
										}
									}
								}
								break;
							}

							case "knight": {
								const knightMoves = [
									{ dr: -2, dc: -1 },
									{ dr: -2, dc: 1 },
									{ dr: -1, dc: -2 },
									{ dr: -1, dc: 2 },
									{ dr: 1, dc: -2 },
									{ dr: 1, dc: 2 },
									{ dr: 2, dc: -1 },
									{ dr: 2, dc: 1 },
								];

								for (const move of knightMoves) {
									const newR = r + move.dr;
									const newC = c + move.dc;

									if (
										isValidPosition({
											row: newR,
											col: newC,
										})
									) {
										const targetPiece = board[newR][newC];
										if (
											!targetPiece ||
											targetPiece.color !== piece.color
										) {
											potentialMoves.push({
												row: newR,
												col: newC,
											});
										}
									}
								}
								break;
							}

							case "bishop": {
								const directions = [
									{ dr: 1, dc: 1 },
									{ dr: 1, dc: -1 },
									{ dr: -1, dc: 1 },
									{ dr: -1, dc: -1 },
								];

								for (const dir of directions) {
									let newR = r + dir.dr;
									let newC = c + dir.dc;

									while (
										isValidPosition({
											row: newR,
											col: newC,
										})
									) {
										const targetPiece = board[newR][newC];

										if (!targetPiece) {
											potentialMoves.push({
												row: newR,
												col: newC,
											});
										} else {
											if (
												targetPiece.color !==
												piece.color
											) {
												potentialMoves.push({
													row: newR,
													col: newC,
												});
											}
											break; // Stop if we hit any piece
										}

										newR += dir.dr;
										newC += dir.dc;
									}
								}
								break;
							}

							case "rook": {
								const directions = [
									{ dr: 0, dc: 1 },
									{ dr: 0, dc: -1 },
									{ dr: 1, dc: 0 },
									{ dr: -1, dc: 0 },
								];

								for (const dir of directions) {
									let newR = r + dir.dr;
									let newC = c + dir.dc;

									while (
										isValidPosition({
											row: newR,
											col: newC,
										})
									) {
										const targetPiece = board[newR][newC];

										if (!targetPiece) {
											potentialMoves.push({
												row: newR,
												col: newC,
											});
										} else {
											if (
												targetPiece.color !==
												piece.color
											) {
												potentialMoves.push({
													row: newR,
													col: newC,
												});
											}
											break; // Stop if we hit any piece
										}

										newR += dir.dr;
										newC += dir.dc;
									}
								}
								break;
							}

							case "queen": {
								const directions = [
									{ dr: 0, dc: 1 },
									{ dr: 0, dc: -1 },
									{ dr: 1, dc: 0 },
									{ dr: -1, dc: 0 },
									{ dr: 1, dc: 1 },
									{ dr: 1, dc: -1 },
									{ dr: -1, dc: 1 },
									{ dr: -1, dc: -1 },
								];

								for (const dir of directions) {
									let newR = r + dir.dr;
									let newC = c + dir.dc;

									while (
										isValidPosition({
											row: newR,
											col: newC,
										})
									) {
										const targetPiece = board[newR][newC];

										if (!targetPiece) {
											potentialMoves.push({
												row: newR,
												col: newC,
											});
										} else {
											if (
												targetPiece.color !==
												piece.color
											) {
												potentialMoves.push({
													row: newR,
													col: newC,
												});
											}
											break; // Stop if we hit any piece
										}

										newR += dir.dr;
										newC += dir.dc;
									}
								}
								break;
							}

							case "king": {
								const kingMoves = [
									{ dr: -1, dc: -1 },
									{ dr: -1, dc: 0 },
									{ dr: -1, dc: 1 },
									{ dr: 0, dc: -1 },
									{ dr: 0, dc: 1 },
									{ dr: 1, dc: -1 },
									{ dr: 1, dc: 0 },
									{ dr: 1, dc: 1 },
								];

								for (const move of kingMoves) {
									const newR = r + move.dr;
									const newC = c + move.dc;

									if (
										isValidPosition({
											row: newR,
											col: newC,
										})
									) {
										const targetPiece = board[newR][newC];
										if (
											!targetPiece ||
											targetPiece.color !== piece.color
										) {
											potentialMoves.push({
												row: newR,
												col: newC,
											});
										}
									}
								}

								// Castling logic would go here
								break;
							}
						}

						// Check if any move can get out of check
						for (const movePos of potentialMoves) {
							if (
								!wouldMoveLeaveKingInCheck(
									pos,
									movePos,
									playerColor,
									board
								)
							) {
								hasLegalMove = true;
								break;
							}
						}

						if (hasLegalMove) break;
					}
				}
				if (hasLegalMove) break;
			}

			// If no legal moves and king is in check, it's checkmate
			setIsCheckmate(!hasLegalMove);
		} else {
			setIsCheckmate(false);
		}
	};

	const wouldMoveLeaveKingInCheck = (
		fromPos: Position,
		toPos: Position,
		playerColor: PieceColor,
		currentBoard: Board
	): boolean => {
		// Create a deep copy of the board to simulate the move
		const tempBoard: Board = JSON.parse(JSON.stringify(currentBoard));
		const movingPiece = tempBoard[fromPos.row][fromPos.col];

		if (!movingPiece) return false;

		// Handle special moves like en passant
		let capturedPawnPos: Position | null = null;
		if (
			movingPiece.type === "pawn" &&
			fromPos.col !== toPos.col &&
			!tempBoard[toPos.row][toPos.col]
		) {
			// This might be an en passant capture
			capturedPawnPos = { row: fromPos.row, col: toPos.col };
			tempBoard[capturedPawnPos.row][capturedPawnPos.col] = null;
		}

		// Temporarily make the move
		tempBoard[toPos.row][toPos.col] = { ...movingPiece, hasMoved: true };
		tempBoard[fromPos.row][fromPos.col] = null;

		// Handle castling
		if (
			movingPiece.type === "king" &&
			Math.abs(fromPos.col - toPos.col) > 1
		) {
			const row = fromPos.row;
			// Move the appropriate rook too
			if (toPos.col === 2) {
				// Queenside
				tempBoard[row][3] = tempBoard[row][0];
				tempBoard[row][0] = null;
			} else if (toPos.col === 6) {
				// Kingside
				tempBoard[row][5] = tempBoard[row][7];
				tempBoard[row][7] = null;
			}
		}

		// Find the king's position after the move
		let kingPos: Position | null = null;

		// If we're moving the king, use the destination as king position
		if (movingPiece.type === "king") {
			kingPos = { ...toPos };
		} else {
			// Otherwise, find the king on the board
			for (let r = 0; r < 8; r++) {
				for (let c = 0; c < 8; c++) {
					const piece = tempBoard[r][c];
					if (
						piece &&
						piece.type === "king" &&
						piece.color === playerColor
					) {
						kingPos = { row: r, col: c };
						break;
					}
				}
				if (kingPos) break;
			}
		}

		if (!kingPos) return false; // This shouldn't happen in a valid chess game

		// Check if any opponent piece can attack the king
		const opponentColor = playerColor === "white" ? "black" : "white";
		let isInCheck = false;

		for (let r = 0; r < 8; r++) {
			for (let c = 0; c < 8; c++) {
				const piece = tempBoard[r][c];
				if (piece && piece.color === opponentColor) {
					// Check if this opponent piece can attack the king
					const canAttackKing = checkIfPieceCanAttack(
						{ row: r, col: c },
						kingPos,
						piece,
						tempBoard
					);

					if (canAttackKing) {
						isInCheck = true;
						break;
					}
				}
			}
			if (isInCheck) break;
		}

		return isInCheck; // Return true if the king would be in check
	};

	// Helper function to check if a piece can attack a position
	const checkIfPieceCanAttack = (
		from: Position,
		to: Position,
		piece: ChessPiece,
		board: Board
	): boolean => {
		// This is a simplified implementation to check if a piece can attack a position
		// In a complete chess implementation, we would reuse the getValidMoves logic

		// For pawns, check diagonal attacks
		if (piece.type === "pawn") {
			const direction = piece.color === "white" ? -1 : 1;
			return (
				to.row === from.row + direction &&
				Math.abs(to.col - from.col) === 1
			);
		}

		// For knights, check L-shaped moves
		if (piece.type === "knight") {
			const dr = Math.abs(to.row - from.row);
			const dc = Math.abs(to.col - from.col);
			return (dr === 1 && dc === 2) || (dr === 2 && dc === 1);
		}

		// For kings, check adjacent squares
		if (piece.type === "king") {
			const dr = Math.abs(to.row - from.row);
			const dc = Math.abs(to.col - from.col);
			return dr <= 1 && dc <= 1 && (dr > 0 || dc > 0);
		}

		// For sliding pieces (bishop, rook, queen), check path is clear
		const dr = to.row - from.row;
		const dc = to.col - from.col;

		// Bishop must move diagonally
		if (piece.type === "bishop") {
			if (Math.abs(dr) !== Math.abs(dc)) return false;
		}

		// Rook must move straight
		if (piece.type === "rook") {
			if (dr !== 0 && dc !== 0) return false;
		}

		// Queen can move diagonally or straight
		if (piece.type === "queen") {
			if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc))
				return false;
		}

		// Check if path is clear (simplified)
		const rStep = dr === 0 ? 0 : dr > 0 ? 1 : -1;
		const cStep = dc === 0 ? 0 : dc > 0 ? 1 : -1;

		let r = from.row + rStep;
		let c = from.col + cStep;

		while (r !== to.row || c !== to.col) {
			if (board[r][c] !== null) return false;
			r += rStep;
			c += cStep;
		}

		return true;
	};

	// Reset the game
	const resetGame = () => {
		setBoard(initialBoard);
		setCurrentPlayer("white");
		setSelectedPiece(null);
		setMoveHistory([]);
		setCapturedPieces([]);
		setValidMoves([]);
		setIsCheck(false);
		setIsCheckmate(false);
	};

	return {
		board,
		currentPlayer,
		selectedPiece,
		moveHistory,
		capturedPieces,
		validMoves,
		isCheck,
		isCheckmate,
		selectPiece,
		resetGame,
		positionToAlgebraic,
		algebraicToPosition,
		wouldMoveLeaveKingInCheck,
	};
};

export default useChessGame;
