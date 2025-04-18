import { useState, useEffect, useCallback } from "react";

export type CellState = {
	hasShip: boolean;
	isHit: boolean;
	isMiss: boolean;
	shipId?: number;
};

export type BoardType = CellState[][];

export type Ship = {
	id: number;
	name: string;
	size: number;
	placed: boolean;
	positions: { x: number; y: number }[];
	isVertical: boolean;
	hits: number;
};

export type PlayerType = "player1" | "player2";

export const useBattleshipGame = () => {
	const BOARD_SIZE = 10;

	// Khởi tạo bảng trống
	const createEmptyBoard = (): BoardType => {
		return Array(BOARD_SIZE)
			.fill(null)
			.map(() =>
				Array(BOARD_SIZE)
					.fill(null)
					.map(() => ({
						hasShip: false,
						isHit: false,
						isMiss: false,
					}))
			);
	};

	// Khởi tạo các tàu
	const createShips = (): Ship[] => {
		return [
			{
				id: 1,
				name: "Tàu tuần tra",
				size: 2,
				placed: false,
				positions: [],
				isVertical: false,
				hits: 0,
			},
			{
				id: 2,
				name: "Tàu khu trục",
				size: 3,
				placed: false,
				positions: [],
				isVertical: false,
				hits: 0,
			},
			{
				id: 3,
				name: "Tàu chiến",
				size: 3,
				placed: false,
				positions: [],
				isVertical: false,
				hits: 0,
			},
			{
				id: 4,
				name: "Tàu sân bay",
				size: 4,
				placed: false,
				positions: [],
				isVertical: false,
				hits: 0,
			},
			{
				id: 5,
				name: "Thiết giáp hạm",
				size: 5,
				placed: false,
				positions: [],
				isVertical: false,
				hits: 0,
			},
		];
	};

	const [player1Board, setPlayer1Board] =
		useState<BoardType>(createEmptyBoard());
	const [player2Board, setPlayer2Board] =
		useState<BoardType>(createEmptyBoard());
	const [player1Ships, setPlayer1Ships] = useState<Ship[]>(createShips());
	const [player2Ships, setPlayer2Ships] = useState<Ship[]>(createShips());
	const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
	const [gamePhase, setGamePhase] = useState<
		"placement1" | "placement2" | "battle"
	>("placement1");
	const [currentPlayer, setCurrentPlayer] = useState<PlayerType>("player1");
	const [gameStatus, setGameStatus] = useState<string>(
		"Người chơi 1: Đặt tàu của bạn"
	);
	const [showSwitchScreen, setShowSwitchScreen] = useState<boolean>(false);

	// Kiểm tra vị trí đặt tàu có hợp lệ không
	const isValidPlacement = (
		board: BoardType,
		x: number,
		y: number,
		size: number,
		isVertical: boolean
	): boolean => {
		if (
			(isVertical && y + size > BOARD_SIZE) ||
			(!isVertical && x + size > BOARD_SIZE)
		) {
			return false;
		}

		for (let i = 0; i < size; i++) {
			const checkX = isVertical ? x : x + i;
			const checkY = isVertical ? y + i : y;

			if (board[checkY][checkX].hasShip) {
				return false;
			}

			// Kiểm tra các ô xung quanh
			for (let dx = -1; dx <= 1; dx++) {
				for (let dy = -1; dy <= 1; dy++) {
					const nx = checkX + dx;
					const ny = checkY + dy;

					if (
						nx >= 0 &&
						nx < BOARD_SIZE &&
						ny >= 0 &&
						ny < BOARD_SIZE &&
						board[ny][nx].hasShip
					) {
						return false;
					}
				}
			}
		}

		return true;
	};

	// Đặt tàu lên bảng
	const placeShip = (x: number, y: number): void => {
		if (!selectedShip) return;

		const currentBoard =
			gamePhase === "placement1" ? player1Board : player2Board;
		const currentShips =
			gamePhase === "placement1" ? player1Ships : player2Ships;

		if (
			!isValidPlacement(
				currentBoard,
				x,
				y,
				selectedShip.size,
				selectedShip.isVertical
			)
		) {
			return;
		}

		const updatedShip = {
			...selectedShip,
			placed: true,
			positions: Array(selectedShip.size)
				.fill(null)
				.map((_, i) => ({
					x: selectedShip.isVertical ? x : x + i,
					y: selectedShip.isVertical ? y + i : y,
				})),
		};

		const newBoard = [...currentBoard];
		updatedShip.positions.forEach((pos) => {
			newBoard[pos.y][pos.x] = {
				...newBoard[pos.y][pos.x],
				hasShip: true,
				shipId: selectedShip.id,
			};
		});

		if (gamePhase === "placement1") {
			setPlayer1Board(newBoard);
			setPlayer1Ships(
				currentShips.map((s) =>
					s.id === selectedShip.id ? updatedShip : s
				)
			);
		} else {
			setPlayer2Board(newBoard);
			setPlayer2Ships(
				currentShips.map((s) =>
					s.id === selectedShip.id ? updatedShip : s
				)
			);
		}

		setSelectedShip(null);
	};

	// Xoay tàu đang chọn
	const handleShipRotate = () => {
		if (selectedShip) {
			setSelectedShip({
				...selectedShip,
				isVertical: !selectedShip.isVertical,
			});
		}
	};

	// Xử lý khi người chơi nhấp vào ô
	const handleCellClick = (x: number, y: number) => {
		if (gamePhase === "placement1" || gamePhase === "placement2") {
			if (selectedShip && !selectedShip.placed) {
				placeShip(x, y);
			}
		} else if (gamePhase === "battle") {
			// Xử lý bắn trong phase chiến đấu
			const attackingBoard =
				currentPlayer === "player1" ? player2Board : player1Board;
			const defendingShips =
				currentPlayer === "player1" ? player2Ships : player1Ships;

			if (attackingBoard[y][x].isHit || attackingBoard[y][x].isMiss) {
				return; // Ô đã bắn
			}

			const newBoard = [...attackingBoard];

			if (newBoard[y][x].hasShip) {
				// Trúng tàu
				newBoard[y][x].isHit = true;

				// Cập nhật số lần trúng của tàu
				const shipId = newBoard[y][x].shipId!;
				const updatedShips = defendingShips.map((ship) => {
					if (ship.id === shipId) {
						const updatedHits = ship.hits + 1;
						return { ...ship, hits: updatedHits };
					}
					return ship;
				});

				// Kiểm tra tàu đã bị phá hủy chưa
				const hitShip = updatedShips.find((ship) => ship.id === shipId);
				if (hitShip && hitShip.hits === hitShip.size) {
					setGameStatus(
						`${currentPlayer === "player1" ? "Người chơi 1" : "Người chơi 2"} đã phá hủy ${hitShip.name}!`
					);
				} else {
					setGameStatus(
						`Trúng! ${currentPlayer === "player1" ? "Người chơi 1" : "Người chơi 2"} tiếp tục lượt.`
					);
				}

				// Kiểm tra thắng cuộc
				if (updatedShips.every((ship) => ship.hits === ship.size)) {
					setGameStatus(
						`${currentPlayer === "player1" ? "Người chơi 1" : "Người chơi 2"} đã chiến thắng!`
					);
					return;
				}

				// Cập nhật trạng thái tàu
				if (currentPlayer === "player1") {
					setPlayer2Board(newBoard);
					setPlayer2Ships(updatedShips);
				} else {
					setPlayer1Board(newBoard);
					setPlayer1Ships(updatedShips);
				}
			} else {
				// Không trúng
				newBoard[y][x].isMiss = true;
				if (currentPlayer === "player1") {
					setPlayer2Board(newBoard);
				} else {
					setPlayer1Board(newBoard);
				}

				setGameStatus(
					`Hụt! Đến lượt ${currentPlayer === "player1" ? "Người chơi 2" : "Người chơi 1"}.`
				);
				setShowSwitchScreen(true);
			}
		}
	};

	// Chuyển sang giai đoạn kế tiếp
	const nextPhase = () => {
		if (gamePhase === "placement1") {
			if (player1Ships.every((ship) => ship.placed)) {
				setGamePhase("placement2");
				setGameStatus("Người chơi 2: Đặt tàu của bạn");
				setShowSwitchScreen(true);
			}
		} else if (gamePhase === "placement2") {
			if (player2Ships.every((ship) => ship.placed)) {
				setGamePhase("battle");
				setCurrentPlayer("player1");
				setGameStatus("Trận đấu bắt đầu! Lượt của Người chơi 1");
				setShowSwitchScreen(true);
			}
		}
	};

	// Xác nhận đã chuyển người chơi
	const confirmPlayerSwitch = () => {
		setShowSwitchScreen(false);
		if (gamePhase === "battle" && !gameStatus.includes("chiến thắng")) {
			setCurrentPlayer(
				currentPlayer === "player1" ? "player2" : "player1"
			);
		}
	};

	// Chọn tàu
	const handleShipSelect = (ship: Ship) => {
		if (!ship.placed) {
			setSelectedShip(ship);
		}
	};

	// Chơi lại
	const resetGame = () => {
		setPlayer1Board(createEmptyBoard());
		setPlayer2Board(createEmptyBoard());
		setPlayer1Ships(createShips());
		setPlayer2Ships(createShips());
		setSelectedShip(null);
		setGamePhase("placement1");
		setCurrentPlayer("player1");
		setGameStatus("Người chơi 1: Đặt tàu của bạn");
		setShowSwitchScreen(false);
	};

	// Lấy ships và board của người chơi hiện tại
	const getCurrentPlayerShips = () => {
		if (gamePhase === "placement1") return player1Ships;
		if (gamePhase === "placement2") return player2Ships;
		return currentPlayer === "player1" ? player1Ships : player2Ships;
	};

	const getOwnBoard = () => {
		if (gamePhase === "placement1") return player1Board;
		if (gamePhase === "placement2") return player2Board;
		return currentPlayer === "player1" ? player1Board : player2Board;
	};

	const getOpponentBoard = () => {
		return currentPlayer === "player1" ? player2Board : player1Board;
	};

	return {
		player1Board,
		player2Board,
		gamePhase,
		currentPlayer,
		selectedShip,
		gameStatus,
		showSwitchScreen,
		getCurrentPlayerShips,
		getOwnBoard,
		getOpponentBoard,
		handleCellClick,
		handleShipSelect,
		handleShipRotate,
		nextPhase,
		confirmPlayerSwitch,
		resetGame,
	};
};
