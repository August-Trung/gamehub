import { useState, useCallback } from "react";

export type PieceType =
	| "general" // tướng/vua
	| "advisor" // sĩ
	| "elephant" // tượng
	| "horse" // mã
	| "chariot" // xe
	| "cannon" // pháo
	| "soldier"; // tốt/binh

export type Player = "red" | "black";

export interface ChessPiece {
	id: string;
	type: PieceType;
	player: Player;
	position: [number, number]; // [row, col]
}

export interface GameState {
	pieces: ChessPiece[];
	currentPlayer: Player;
	selectedPiece: ChessPiece | null;
	gameOver: boolean;
	winner: Player | null;
	inCheck: boolean;
	moveHistory: {
		piece: ChessPiece;
		from: [number, number];
		to: [number, number];
		capturedPiece?: ChessPiece;
		wasCheck?: boolean;
	}[];
}

// Kích thước bàn cờ: 10x9
const BOARD_HEIGHT = 10;
const BOARD_WIDTH = 9;

// Vị trí ban đầu của các quân cờ
const initialPieces: ChessPiece[] = [
	// Quân đỏ (Red)
	{ id: "r-general", type: "general", player: "red", position: [9, 4] },
	{ id: "r-advisor1", type: "advisor", player: "red", position: [9, 3] },
	{ id: "r-advisor2", type: "advisor", player: "red", position: [9, 5] },
	{ id: "r-elephant1", type: "elephant", player: "red", position: [9, 2] },
	{ id: "r-elephant2", type: "elephant", player: "red", position: [9, 6] },
	{ id: "r-horse1", type: "horse", player: "red", position: [9, 1] },
	{ id: "r-horse2", type: "horse", player: "red", position: [9, 7] },
	{ id: "r-chariot1", type: "chariot", player: "red", position: [9, 0] },
	{ id: "r-chariot2", type: "chariot", player: "red", position: [9, 8] },
	{ id: "r-cannon1", type: "cannon", player: "red", position: [7, 1] },
	{ id: "r-cannon2", type: "cannon", player: "red", position: [7, 7] },
	{ id: "r-soldier1", type: "soldier", player: "red", position: [6, 0] },
	{ id: "r-soldier2", type: "soldier", player: "red", position: [6, 2] },
	{ id: "r-soldier3", type: "soldier", player: "red", position: [6, 4] },
	{ id: "r-soldier4", type: "soldier", player: "red", position: [6, 6] },
	{ id: "r-soldier5", type: "soldier", player: "red", position: [6, 8] },

	// Quân đen (Black)
	{ id: "b-general", type: "general", player: "black", position: [0, 4] },
	{ id: "b-advisor1", type: "advisor", player: "black", position: [0, 3] },
	{ id: "b-advisor2", type: "advisor", player: "black", position: [0, 5] },
	{ id: "b-elephant1", type: "elephant", player: "black", position: [0, 2] },
	{ id: "b-elephant2", type: "elephant", player: "black", position: [0, 6] },
	{ id: "b-horse1", type: "horse", player: "black", position: [0, 1] },
	{ id: "b-horse2", type: "horse", player: "black", position: [0, 7] },
	{ id: "b-chariot1", type: "chariot", player: "black", position: [0, 0] },
	{ id: "b-chariot2", type: "chariot", player: "black", position: [0, 8] },
	{ id: "b-cannon1", type: "cannon", player: "black", position: [2, 1] },
	{ id: "b-cannon2", type: "cannon", player: "black", position: [2, 7] },
	{ id: "b-soldier1", type: "soldier", player: "black", position: [3, 0] },
	{ id: "b-soldier2", type: "soldier", player: "black", position: [3, 2] },
	{ id: "b-soldier3", type: "soldier", player: "black", position: [3, 4] },
	{ id: "b-soldier4", type: "soldier", player: "black", position: [3, 6] },
	{ id: "b-soldier5", type: "soldier", player: "black", position: [3, 8] },
];

export const useChineseChessGame = () => {
	const [gameState, setGameState] = useState<GameState>({
		pieces: [...initialPieces],
		currentPlayer: "red",
		selectedPiece: null,
		gameOver: false,
		winner: null,
		inCheck: false,
		moveHistory: [],
	});

	// Kiểm tra xem vị trí [row, col] có nằm trong bàn cờ không
	const isInBoard = useCallback((row: number, col: number): boolean => {
		return row >= 0 && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH;
	}, []);

	// Lấy quân cờ tại vị trí [row, col]
	const getPieceAt = useCallback(
		(
			row: number,
			col: number,
			pieces = gameState.pieces
		): ChessPiece | null => {
			return (
				pieces.find(
					(piece) =>
						piece.position[0] === row && piece.position[1] === col
				) || null
			);
		},
		[gameState.pieces]
	);

	// Kiểm tra nước đi hợp lệ cho từng loại quân
	const getValidMoves = useCallback(
		(
			piece: ChessPiece,
			pieces = gameState.pieces,
			checkForCheck = true
		): [number, number][] => {
			const [row, col] = piece.position;
			let validMoves: [number, number][] = [];

			switch (piece.type) {
				case "general": {
					// Tướng chỉ có thể di chuyển trong cung điện (3x3)
					const palaceTop = piece.player === "red" ? 7 : 0;
					const palaceBottom = piece.player === "red" ? 9 : 2;

					// Di chuyển 1 ô theo phương ngang hoặc dọc
					const possibleMoves = [
						[row + 1, col],
						[row - 1, col],
						[row, col + 1],
						[row, col - 1],
					];

					for (const [newRow, newCol] of possibleMoves) {
						if (
							isInBoard(newRow, newCol) &&
							newRow >= palaceTop &&
							newRow <= palaceBottom &&
							newCol >= 3 &&
							newCol <= 5
						) {
							const pieceAtTarget = getPieceAt(
								newRow,
								newCol,
								pieces
							);
							if (
								!pieceAtTarget ||
								pieceAtTarget.player !== piece.player
							) {
								validMoves.push([newRow, newCol]);
							}
						}
					}

					// Kiểm tra nước "bay đầu" (nước đặc biệt khi hai tướng đối mặt)
					const oppositeGeneral = pieces.find(
						(p) => p.type === "general" && p.player !== piece.player
					);

					if (
						oppositeGeneral &&
						oppositeGeneral.position[1] === col
					) {
						let hasObstacle = false;
						const minRow = Math.min(
							row,
							oppositeGeneral.position[0]
						);
						const maxRow = Math.max(
							row,
							oppositeGeneral.position[0]
						);

						for (let r = minRow + 1; r < maxRow; r++) {
							if (getPieceAt(r, col, pieces)) {
								hasObstacle = true;
								break;
							}
						}

						if (!hasObstacle) {
							validMoves.push(oppositeGeneral.position);
						}
					}
					break;
				}

				case "advisor": {
					// Sĩ chỉ có thể di chuyển trong cung điện theo đường chéo
					const palaceTop = piece.player === "red" ? 7 : 0;
					const palaceBottom = piece.player === "red" ? 9 : 2;

					const possibleMoves = [
						[row + 1, col + 1],
						[row + 1, col - 1],
						[row - 1, col + 1],
						[row - 1, col - 1],
					];

					for (const [newRow, newCol] of possibleMoves) {
						if (
							isInBoard(newRow, newCol) &&
							newRow >= palaceTop &&
							newRow <= palaceBottom &&
							newCol >= 3 &&
							newCol <= 5
						) {
							const pieceAtTarget = getPieceAt(
								newRow,
								newCol,
								pieces
							);
							if (
								!pieceAtTarget ||
								pieceAtTarget.player !== piece.player
							) {
								validMoves.push([newRow, newCol]);
							}
						}
					}
					break;
				}

				case "elephant": {
					// Tượng di chuyển theo quy tắc "điểm, thu" (2 ô chéo) và không qua sông
					const riverBoundary =
						piece.player === "red"
							? row >= 5 // Đỏ ở dưới
							: row <= 4; // Đen ở trên

					if (riverBoundary) {
						const possibleMoves = [
							[row + 2, col + 2],
							[row + 2, col - 2],
							[row - 2, col + 2],
							[row - 2, col - 2],
						];

						for (const [newRow, newCol] of possibleMoves) {
							// Kiểm tra vị trí mới có hợp lệ và không vượt qua sông
							if (
								isInBoard(newRow, newCol) &&
								(piece.player === "red"
									? newRow >= 5
									: newRow <= 4)
							) {
								// Kiểm tra điểm giữa có bị chặn không
								const middleRow = (row + newRow) / 2;
								const middleCol = (col + newCol) / 2;
								const middlePiece = getPieceAt(
									middleRow,
									middleCol,
									pieces
								);

								if (!middlePiece) {
									const targetPiece = getPieceAt(
										newRow,
										newCol,
										pieces
									);
									if (
										!targetPiece ||
										targetPiece.player !== piece.player
									) {
										validMoves.push([newRow, newCol]);
									}
								}
							}
						}
					}
					break;
				}

				case "horse": {
					// Mã di chuyển theo quy tắc "mã đi hình chữ L" nhưng bị cản nếu có quân ở ô kề
					const possibleMoves = [
						[row + 2, col + 1],
						[row + 2, col - 1],
						[row - 2, col + 1],
						[row - 2, col - 1],
						[row + 1, col + 2],
						[row + 1, col - 2],
						[row - 1, col + 2],
						[row - 1, col - 2],
					];

					for (const [newRow, newCol] of possibleMoves) {
						if (isInBoard(newRow, newCol)) {
							// Kiểm tra xem có bị "vướng chân" không
							const blockRow = row + Math.sign(newRow - row);
							const blockCol = col + Math.sign(newCol - col);

							// Nếu đi ngang 2 bước, ta cần kiểm tra ô ngang
							// Nếu đi dọc 2 bước, ta cần kiểm tra ô dọc
							const blockingPiece =
								Math.abs(newRow - row) === 2
									? getPieceAt(blockRow, col, pieces)
									: getPieceAt(row, blockCol, pieces);

							if (!blockingPiece) {
								const targetPiece = getPieceAt(
									newRow,
									newCol,
									pieces
								);
								if (
									!targetPiece ||
									targetPiece.player !== piece.player
								) {
									validMoves.push([newRow, newCol]);
								}
							}
						}
					}
					break;
				}

				case "chariot": {
					// Xe di chuyển theo hàng dọc hoặc ngang, không giới hạn số ô
					// Kiểm tra 4 hướng: trên, dưới, trái, phải
					const directions = [
						[1, 0],
						[-1, 0],
						[0, 1],
						[0, -1],
					];

					for (const [dr, dc] of directions) {
						let newRow = row + dr;
						let newCol = col + dc;

						while (isInBoard(newRow, newCol)) {
							const pieceAtTarget = getPieceAt(
								newRow,
								newCol,
								pieces
							);

							if (!pieceAtTarget) {
								// Nếu ô trống, có thể di chuyển
								validMoves.push([newRow, newCol]);
							} else {
								// Nếu ô có quân, chỉ có thể ăn quân địch
								if (pieceAtTarget.player !== piece.player) {
									validMoves.push([newRow, newCol]);
								}
								break; // Không thể đi xa hơn nữa
							}

							newRow += dr;
							newCol += dc;
						}
					}
					break;
				}

				case "cannon": {
					// Pháo di chuyển như xe nhưng phải nhảy qua đúng 1 quân để ăn
					const directions = [
						[1, 0],
						[-1, 0],
						[0, 1],
						[0, -1],
					];

					for (const [dr, dc] of directions) {
						let newRow = row + dr;
						let newCol = col + dc;
						let hasJumped = false;

						while (isInBoard(newRow, newCol)) {
							const pieceAtTarget = getPieceAt(
								newRow,
								newCol,
								pieces
							);

							if (!pieceAtTarget) {
								// Nếu chưa nhảy qua quân nào, có thể di chuyển đến ô trống
								if (!hasJumped) {
									validMoves.push([newRow, newCol]);
								}
							} else {
								if (!hasJumped) {
									// Đã gặp quân đầu tiên, đánh dấu đã nhảy và tiếp tục tìm kiếm
									hasJumped = true;
								} else {
									// Đã nhảy qua 1 quân, nếu gặp quân địch thì có thể ăn
									if (pieceAtTarget.player !== piece.player) {
										validMoves.push([newRow, newCol]);
									}
									break; // Không thể đi xa hơn nữa sau khi tìm thấy quân thứ hai
								}
							}

							newRow += dr;
							newCol += dc;
						}
					}
					break;
				}

				case "soldier": {
					// Tốt di chuyển tùy theo vị trí
					const forwardDir = piece.player === "red" ? -1 : 1;
					let possibleMoves: [number, number][] = [];

					// Kiểm tra xem tốt đã qua sông hay chưa
					const hasCrossedRiver =
						piece.player === "red"
							? row < 5 // Đỏ di chuyển lên
							: row > 4; // Đen di chuyển xuống

					// Tốt luôn có thể đi thẳng
					possibleMoves.push([row + forwardDir, col]);

					// Nếu đã qua sông, tốt có thể đi ngang
					if (hasCrossedRiver) {
						possibleMoves.push([row, col + 1]);
						possibleMoves.push([row, col - 1]);
					}

					// Lọc các nước đi hợp lệ
					for (const [newRow, newCol] of possibleMoves) {
						if (isInBoard(newRow, newCol)) {
							const targetPiece = getPieceAt(
								newRow,
								newCol,
								pieces
							);
							if (
								!targetPiece ||
								targetPiece.player !== piece.player
							) {
								validMoves.push([newRow, newCol]);
							}
						}
					}
					break;
				}
			}

			// Lọc ra các nước đi không dẫn đến chiếu tướng
			if (checkForCheck) {
				validMoves = validMoves.filter(([toRow, toCol]) => {
					// Tạo một bản sao của bàn cờ để thử nước đi
					const nextPieces = pieces.map((p) => ({ ...p }));

					// Tìm quân được di chuyển trong bản sao
					const movingPiece = nextPieces.find(
						(p) => p.id === piece.id
					);

					if (!movingPiece) return false;

					// Tìm quân bị ăn trong bản sao (nếu có)
					const capturedIndex = nextPieces.findIndex(
						(p) =>
							p.position[0] === toRow &&
							p.position[1] === toCol &&
							p.player !== piece.player
					);

					// Loại bỏ quân bị ăn nếu có
					if (capturedIndex >= 0) {
						nextPieces.splice(capturedIndex, 1);
					}

					// Thực hiện di chuyển trên bản sao
					movingPiece.position = [toRow, toCol];

					// Kiểm tra xem sau nước đi này, tướng của người chơi hiện tại có bị chiếu không
					return !isInCheck(piece.player, nextPieces);
				});
			}

			return validMoves;
		},
		[isInBoard, getPieceAt, gameState.pieces]
	);

	// Kiểm tra liệu một phe có bị chiếu không
	const isInCheck = useCallback(
		(player: Player, pieces = gameState.pieces): boolean => {
			// Tìm tướng của phe đang kiểm tra
			const general = pieces.find(
				(p) => p.type === "general" && p.player === player
			);

			if (!general) return false; // Không tìm thấy tướng (không thể xảy ra trong trò chơi thông thường)

			const [genRow, genCol] = general.position;

			// Kiểm tra từng quân của đối phương
			for (const piece of pieces) {
				if (piece.player === player) continue; // Bỏ qua quân cùng phe

				// Kiểm tra xem quân này có thể ăn tướng không
				const validMoves = getValidMoves(piece, pieces, false); // Không kiểm tra chiếu để tránh đệ quy vô hạn

				if (
					validMoves.some(
						([row, col]) => row === genRow && col === genCol
					)
				) {
					return true; // Tướng bị chiếu
				}
			}

			return false;
		},
		[getValidMoves]
	);

	// Chọn quân cờ
	const selectPiece = useCallback(
		(piece: ChessPiece | null) => {
			if (!piece || gameState.gameOver) return;

			// Chỉ được chọn quân của người chơi hiện tại
			if (piece.player === gameState.currentPlayer) {
				setGameState((prev) => ({
					...prev,
					selectedPiece: piece,
				}));
			}
		},
		[gameState.currentPlayer, gameState.gameOver]
	);

	// Di chuyển quân cờ
	const movePiece = useCallback(
		(toRow: number, toCol: number) => {
			const { selectedPiece, pieces, currentPlayer } = gameState;

			if (!selectedPiece || gameState.gameOver) return;

			// Kiểm tra nước đi có hợp lệ không
			const validMoves = getValidMoves(selectedPiece);
			const isValidMove = validMoves.some(
				([row, col]) => row === toRow && col === toCol
			);

			if (!isValidMove) return;

			// Kiểm tra xem có ăn quân không
			const targetPiece = getPieceAt(toRow, toCol);

			// Cập nhật vị trí quân cờ
			const updatedPieces = pieces
				.map((piece) => {
					if (piece.id === selectedPiece.id) {
						return {
							...piece,
							position: [toRow, toCol] as [number, number],
						};
					}
					return piece;
				})
				.filter((piece) => {
					// Loại bỏ quân bị ăn
					if (targetPiece && piece.id === targetPiece.id) {
						return false;
					}
					return true;
				});

			// Xác định người chơi tiếp theo
			const nextPlayer = currentPlayer === "red" ? "black" : "red";

			// Kiểm tra xem người chơi tiếp theo có bị chiếu không
			const isNextPlayerInCheck = isInCheck(nextPlayer, updatedPieces);

			// FIX: Kiểm tra ngay lập tức nếu nước đi dẫn đến chiếu bí
			let gameOver = false;
			let winner: Player | null = null;

			// Kiểm tra xem đã ăn tướng chưa
			if (targetPiece && targetPiece.type === "general") {
				gameOver = true;
				winner = currentPlayer;
			} else if (isNextPlayerInCheck) {
				// Kiểm tra xem có phải chiếu bí không bằng cách cập nhật các quân cờ
				// tạm thời và sau đó kiểm tra
				const isNextPlayerCheckmated = true; // Force to check if checkmate

				if (isNextPlayerCheckmated) {
					// Tạo một bản sao của mảng quân cờ để kiểm tra
					const checkmateTest = updatedPieces.map((p) => ({ ...p }));

					// Kiểm tra từng quân của người chơi tiếp theo
					const nextPlayerPieces = checkmateTest.filter(
						(p) => p.player === nextPlayer
					);
					let canEscapeCheck = false;

					// Kiểm tra từng quân xem có thể thoát chiếu không
					for (const piece of nextPlayerPieces) {
						// Lấy các nước đi hợp lệ cho quân này
						const pieceMoves = getValidMoves(piece, checkmateTest);

						if (pieceMoves.length > 0) {
							canEscapeCheck = true;
							break;
						}
					}

					// Nếu không thể thoát chiếu, đây là chiếu bí
					if (!canEscapeCheck) {
						gameOver = true;
						winner = currentPlayer;
					}
				}
			}

			// Lưu lịch sử nước đi
			const moveHistoryEntry = {
				piece: selectedPiece,
				from: [...selectedPiece.position] as [number, number],
				to: [toRow, toCol] as [number, number],
				capturedPiece: targetPiece || undefined,
				wasCheck: isNextPlayerInCheck,
			};

			setGameState((prev) => ({
				...prev,
				pieces: updatedPieces,
				currentPlayer: nextPlayer,
				selectedPiece: null,
				gameOver,
				winner,
				inCheck: isNextPlayerInCheck,
				moveHistory: [...prev.moveHistory, moveHistoryEntry],
			}));
		},
		[gameState, getValidMoves, getPieceAt, isInCheck]
	);

	// Đặt lại game
	const resetGame = useCallback(() => {
		setGameState({
			pieces: [...initialPieces],
			currentPlayer: "red",
			selectedPiece: null,
			gameOver: false,
			winner: null,
			inCheck: false,
			moveHistory: [],
		});
	}, []);

	// Đi lại nước cờ trước đó
	const undoMove = useCallback(() => {
		if (gameState.moveHistory.length === 0) return;

		const lastMove =
			gameState.moveHistory[gameState.moveHistory.length - 1];
		const { piece, from, capturedPiece } = lastMove;

		// Khôi phục vị trí quân cờ
		const updatedPieces = gameState.pieces.map((p) => {
			if (p.id === piece.id) {
				return {
					...p,
					position: [from[0], from[1]] as [number, number],
				};
			}
			return p;
		});

		// Nếu có quân bị ăn, thêm lại vào bàn cờ
		if (capturedPiece) {
			updatedPieces.push(capturedPiece);
		}

		// Kiểm tra xem người chơi trước đó có bị chiếu không
		const previousPlayer =
			gameState.currentPlayer === "red" ? "black" : "red";
		const isPreviousPlayerInCheck =
			gameState.moveHistory.length >= 2 &&
			gameState.moveHistory[gameState.moveHistory.length - 2].wasCheck;

		setGameState((prev) => ({
			...prev,
			pieces: updatedPieces,
			currentPlayer: previousPlayer,
			selectedPiece: null,
			gameOver: false,
			winner: null,
			inCheck: !!isPreviousPlayerInCheck,
			moveHistory: prev.moveHistory.slice(0, -1),
		}));
	}, [gameState.pieces, gameState.moveHistory, gameState.currentPlayer]);

	return {
		pieces: gameState.pieces,
		currentPlayer: gameState.currentPlayer,
		selectedPiece: gameState.selectedPiece,
		gameOver: gameState.gameOver,
		winner: gameState.winner,
		inCheck: gameState.inCheck,
		moveHistory: gameState.moveHistory,
		selectPiece,
		movePiece,
		getValidMoves,
		resetGame,
		undoMove,
	};
};
