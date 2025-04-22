import React, { useState, useEffect } from "react";

const PLAYERS = ["red", "blue", "green", "yellow"] as const;
type PlayerColor = (typeof PLAYERS)[number];
const HUMAN_PLAYER = "blue" as PlayerColor;
const PIECES_PER_PLAYER = 4;
// const BOARD_SIZE_GRID = 15;
const SQUARE_SIZE = 40;
const PATH_LENGTH = 52;
const HOME_PATH_LENGTH = 6;

const START_POSITIONS: { [key in PlayerColor]: number } = {
	red: 0,
	blue: 13,
	green: 26,
	yellow: 39,
};
const PRE_HOME_POSITIONS: { [key in PlayerColor]: number } = {
	red: 51,
	blue: 12,
	green: 25,
	yellow: 38,
};

const pathDef = [
	{ r: 6, c: 1 },
	{ r: 6, c: 2 },
	{ r: 6, c: 3 },
	{ r: 6, c: 4 },
	{ r: 6, c: 5 },
	{ r: 5, c: 6 },
	{ r: 4, c: 6 },
	{ r: 3, c: 6 },
	{ r: 2, c: 6 },
	{ r: 1, c: 6 },
	{ r: 0, c: 6 },
	{ r: 0, c: 7 },
	{ r: 0, c: 8 },
	{ r: 1, c: 8 },
	{ r: 2, c: 8 },
	{ r: 3, c: 8 },
	{ r: 4, c: 8 },
	{ r: 5, c: 8 },
	{ r: 6, c: 9 },
	{ r: 6, c: 10 },
	{ r: 6, c: 11 },
	{ r: 6, c: 12 },
	{ r: 6, c: 13 },
	{ r: 6, c: 14 },
	{ r: 7, c: 14 },
	{ r: 8, c: 14 },
	{ r: 8, c: 13 },
	{ r: 8, c: 12 },
	{ r: 8, c: 11 },
	{ r: 8, c: 10 },
	{ r: 8, c: 9 },
	{ r: 9, c: 8 },
	{ r: 10, c: 8 },
	{ r: 11, c: 8 },
	{ r: 12, c: 8 },
	{ r: 13, c: 8 },
	{ r: 14, c: 8 },
	{ r: 14, c: 7 },
	{ r: 14, c: 6 },
	{ r: 13, c: 6 },
	{ r: 12, c: 6 },
	{ r: 11, c: 6 },
	{ r: 10, c: 6 },
	{ r: 9, c: 6 },
	{ r: 8, c: 5 },
	{ r: 8, c: 4 },
	{ r: 8, c: 3 },
	{ r: 8, c: 2 },
	{ r: 8, c: 1 },
	{ r: 8, c: 0 },
	{ r: 7, c: 0 },
	{ r: 6, c: 0 },
];

const homePathDefs = {
	red: [
		{ r: 7, c: 1 },
		{ r: 7, c: 2 },
		{ r: 7, c: 3 },
		{ r: 7, c: 4 },
		{ r: 7, c: 5 },
		{ r: 7, c: 6 },
	],
	blue: [
		{ r: 1, c: 7 },
		{ r: 2, c: 7 },
		{ r: 3, c: 7 },
		{ r: 4, c: 7 },
		{ r: 5, c: 7 },
		{ r: 6, c: 7 },
	],
	green: [
		{ r: 7, c: 13 },
		{ r: 7, c: 12 },
		{ r: 7, c: 11 },
		{ r: 7, c: 10 },
		{ r: 7, c: 9 },
		{ r: 7, c: 8 },
	],
	yellow: [
		{ r: 13, c: 7 },
		{ r: 12, c: 7 },
		{ r: 11, c: 7 },
		{ r: 10, c: 7 },
		{ r: 9, c: 7 },
		{ r: 8, c: 7 },
	],
};

const pathCoordinates = pathDef.map((pos) => ({
	top: pos.r * SQUARE_SIZE,
	left: pos.c * SQUARE_SIZE,
}));
const homePathCoordinates: {
	[key in PlayerColor]: { top: number; left: number }[];
} = {
	red: homePathDefs.red.map((pos) => ({
		top: pos.r * SQUARE_SIZE,
		left: pos.c * SQUARE_SIZE,
	})),
	blue: homePathDefs.blue.map((pos) => ({
		top: pos.r * SQUARE_SIZE,
		left: pos.c * SQUARE_SIZE,
	})),
	green: homePathDefs.green.map((pos) => ({
		top: pos.r * SQUARE_SIZE,
		left: pos.c * SQUARE_SIZE,
	})),
	yellow: homePathDefs.yellow.map((pos) => ({
		top: pos.r * SQUARE_SIZE,
		left: pos.c * SQUARE_SIZE,
	})),
};

interface Piece {
	player: PlayerColor;
	id: string;
	state: "stable" | "on_path" | "in_home_path" | "finished";
	position: number;
	stepsTaken: number;
}

interface GameState {
	pieces: { [key: string]: Piece };
	diceValue: number | null;
	currentPlayer: PlayerColor;
	turnState:
		| "waiting_for_roll"
		| "waiting_for_move"
		| "ai_thinking"
		| "executing_move"
		| "game_over";
	difficulty: "easy" | "normal" | "hard";
	validMoves: Move[];
}

interface Move {
	pieceId: string;
	targetPos: number;
	targetState: string;
	moveType: string;
	isCapture: boolean;
	capturedPieceId: string | null;
}

const Ludo: React.FC = () => {
	const [gameState, setGameState] = useState<GameState>({
		pieces: {},
		diceValue: null,
		currentPlayer: HUMAN_PLAYER,
		turnState: "waiting_for_roll",
		difficulty: "normal",
		validMoves: [],
	});
	const [isGameStarted, setIsGameStarted] = useState(false);
	const [message, setMessage] = useState("Chọn độ khó và nhấn Bắt đầu.");

	useEffect(() => {
		if (isGameStarted) {
			initGame();
		}
	}, [isGameStarted]);

	const initGame = () => {
		const newPieces: { [key: string]: Piece } = {};
		PLAYERS.forEach((player) => {
			for (let i = 0; i < PIECES_PER_PLAYER; i++) {
				const pieceId = `${player}-${i}`;
				newPieces[pieceId] = {
					player,
					id: pieceId,
					state: "stable",
					position: -1,
					stepsTaken: 0,
				};
			}
		});
		setGameState({
			pieces: newPieces,
			diceValue: null,
			currentPlayer: HUMAN_PLAYER,
			turnState: "waiting_for_roll",
			difficulty: gameState.difficulty,
			validMoves: [],
		});
		setMessage(`Lượt của bạn (${HUMAN_PLAYER}). Hãy tung xúc xắc!`);
	};

	const rollDice = () => {
		if (gameState.turnState !== "waiting_for_roll") return;
		const diceValue = Math.floor(Math.random() * 6) + 1;
		setGameState((prev) => ({ ...prev, diceValue }));
		setMessage(`${gameState.currentPlayer} tung được ${diceValue}.`);
		findValidMoves(diceValue);

		if (gameState.validMoves.length > 0) {
			if (gameState.currentPlayer === HUMAN_PLAYER) {
				setGameState((prev) => ({
					...prev,
					turnState: "waiting_for_move",
				}));
				setMessage(
					`Bạn (${HUMAN_PLAYER}) tung được ${diceValue}. Chọn quân để đi.`
				);
			} else {
				setGameState((prev) => ({ ...prev, turnState: "ai_thinking" }));
				setMessage(
					`Máy (${gameState.currentPlayer}) tung được ${diceValue}. Đang suy nghĩ...`
				);
				setTimeout(aiChooseMove, 1000);
			}
		} else {
			setMessage(
				`${gameState.currentPlayer} tung được ${diceValue} nhưng không có nước đi hợp lệ.`
			);
			setTimeout(switchTurn, 1500);
		}
	};

	const findValidMoves = (dice: number) => {
		const validMoves: Move[] = [];
		const player = gameState.currentPlayer;

		Object.values(gameState.pieces).forEach((piece) => {
			if (piece.player !== player || piece.state === "finished") return;

			let targetPos = -1;
			let targetState = piece.state;
			let moveType = "invalid";
			let isCapture = false;
			let capturedPieceId: string | null = null;
			let isPathBlocked = false;

			if (piece.state === "stable" && (dice === 1 || dice === 6)) {
				targetPos = START_POSITIONS[player];
				targetState = "on_path";
				moveType = "stable_out";
			} else if (piece.state === "on_path") {
				const currentPos = piece.position;
				const preHomePos = PRE_HOME_POSITIONS[player];
				const startPos = START_POSITIONS[player];
				const potentialStepsTaken = piece.stepsTaken + dice;
				const stepsToPreHome =
					preHomePos >= startPos
						? preHomePos - startPos + 1
						: PATH_LENGTH - startPos + preHomePos + 1;

				if (potentialStepsTaken < stepsToPreHome) {
					for (let i = 1; i < dice; i++) {
						if (
							getPieceAtBoardPosition(
								(currentPos + i) % PATH_LENGTH,
								"on_path"
							)
						) {
							isPathBlocked = true;
							break;
						}
					}
					if (!isPathBlocked) {
						targetPos = (currentPos + dice) % PATH_LENGTH;
						targetState = "on_path";
						moveType = "normal";
					}
				} else {
					const homePathIndex =
						potentialStepsTaken - (stepsToPreHome - 1);
					if (homePathIndex <= HOME_PATH_LENGTH) {
						for (let i = 1; i < dice; i++) {
							const intermediatePos =
								(currentPos + i) % PATH_LENGTH;
							if (
								getPieceAtBoardPosition(
									intermediatePos,
									"on_path"
								)
							) {
								isPathBlocked = true;
								break;
							}
						}
						if (!isPathBlocked) {
							targetPos = homePathIndex;
							targetState = "in_home_path";
							moveType =
								homePathIndex === HOME_PATH_LENGTH
									? "finish"
									: "home_path";
						}
					}
				}
			} else if (piece.state === "in_home_path") {
				const currentHomePos = piece.position;
				const potentialHomePos = currentHomePos + dice;
				if (potentialHomePos <= HOME_PATH_LENGTH) {
					for (let i = 1; i < dice; i++) {
						if (
							getPieceAtBoardPosition(
								currentHomePos + i,
								"in_home_path",
								player
							)
						) {
							isPathBlocked = true;
							break;
						}
					}
					if (!isPathBlocked) {
						targetPos = potentialHomePos;
						targetState = "in_home_path";
						moveType =
							potentialHomePos === HOME_PATH_LENGTH
								? "finish"
								: "home_path";
					}
				}
			}

			if (moveType !== "invalid") {
				let isTargetValid = true;
				if (targetState === "on_path") {
					const occupyingPiece = getPieceAtBoardPosition(
						targetPos,
						"on_path"
					);
					if (occupyingPiece) {
						if (occupyingPiece.player === player) {
							isTargetValid = false;
						} else {
							isCapture = true;
							moveType =
								moveType === "stable_out"
									? "stable_out_capture"
									: "capture";
							capturedPieceId = occupyingPiece.id;
						}
					}
				} else if (
					targetState === "in_home_path" &&
					moveType !== "finish"
				) {
					if (
						getPieceAtBoardPosition(
							targetPos,
							"in_home_path",
							player
						)
					) {
						isTargetValid = false;
					}
				}

				if (isTargetValid) {
					validMoves.push({
						pieceId: piece.id,
						targetPos,
						targetState,
						moveType,
						isCapture,
						capturedPieceId,
					});
				}
			}
		});

		setGameState((prev) => ({ ...prev, validMoves }));
	};

	const getPieceAtBoardPosition = (
		position: number,
		stateType: string,
		targetPlayer: string | null = null
	) => {
		return (
			Object.values(gameState.pieces).find(
				(piece) =>
					piece.state === stateType &&
					piece.position === position &&
					(!targetPlayer || piece.player === targetPlayer)
			) || null
		);
	};

	const handlePieceClick = (piece: Piece) => {
		if (
			gameState.turnState !== "waiting_for_move" ||
			gameState.currentPlayer !== HUMAN_PLAYER
		)
			return;
		const validMove = gameState.validMoves.find(
			(move) => move.pieceId === piece.id
		);
		if (validMove) {
			executeMove(validMove);
		} else {
			setMessage(
				"Nước đi không hợp lệ cho quân cờ này. Hãy chọn quân khác."
			);
		}
	};

	const executeMove = (move: Move) => {
		setGameState((prev) => {
			const piece = prev.pieces[move.pieceId];
			if (!piece || prev.turnState === "game_over") return prev;

			const newPieces = { ...prev.pieces };
			if (move.isCapture && move.capturedPieceId) {
				newPieces[move.capturedPieceId] = {
					...newPieces[move.capturedPieceId],
					state: "stable",
					position: -1,
					stepsTaken: 0,
				};
				setMessage(
					`${piece.player} (${piece.id}) đá quân ${move.capturedPieceId} của ${newPieces[move.capturedPieceId].player}!`
				);
			}

			switch (move.moveType) {
				case "stable_out":
					newPieces[move.pieceId] = {
						...piece,
						state: "on_path",
						position: move.targetPos,
						stepsTaken: 0,
					};
					break;
				case "normal":
				case "capture":
					newPieces[move.pieceId] = {
						...piece,
						state: "on_path",
						position: move.targetPos,
						stepsTaken: piece.stepsTaken + prev.diceValue!,
					};
					break;
				case "home_path":
					newPieces[move.pieceId] = {
						...piece,
						state: "in_home_path",
						position: move.targetPos,
					};
					break;
				case "finish":
					newPieces[move.pieceId] = {
						...piece,
						state: "finished",
						position: -1,
					};
					break;
			}

			return { ...prev, pieces: newPieces, turnState: "executing_move" };
		});

		if (checkWinCondition(gameState.currentPlayer)) return;

		if (
			gameState.diceValue === 1 ||
			gameState.diceValue === 6 ||
			move.isCapture
		) {
			let reason = "";
			if (gameState.diceValue === 1) reason = "tung được 1";
			else if (gameState.diceValue === 6) reason = "tung được 6";
			if (move.isCapture)
				reason += (reason ? " và " : "") + "đá được quân";
			setMessage(
				`${gameState.currentPlayer} ${reason}. Được tung thêm lượt!`
			);
			setGameState((prev) => ({
				...prev,
				turnState: "waiting_for_roll",
			}));
			if (gameState.currentPlayer !== HUMAN_PLAYER)
				setTimeout(rollDice, 1000);
		} else {
			setTimeout(switchTurn, 500);
		}
	};

	const switchTurn = () => {
		if (gameState.turnState === "game_over") return;
		const currentIndex = PLAYERS.indexOf(gameState.currentPlayer);
		setGameState((prev) => ({
			...prev,
			currentPlayer: PLAYERS[(currentIndex + 1) % PLAYERS.length],
			diceValue: null,
			validMoves: [],
			turnState: "waiting_for_roll",
		}));
		setMessage(
			gameState.currentPlayer === HUMAN_PLAYER
				? `Lượt của bạn (${HUMAN_PLAYER}). Hãy tung xúc xắc!`
				: `Đến lượt Máy (${gameState.currentPlayer})...`
		);
		if (gameState.currentPlayer !== HUMAN_PLAYER)
			setTimeout(rollDice, 1500);
	};

	const checkWinCondition = (player: PlayerColor) => {
		const finishedCount = Object.values(gameState.pieces).filter(
			(p) => p.player === player && p.state === "finished"
		).length;
		if (finishedCount === PIECES_PER_PLAYER) {
			setGameState((prev) => ({ ...prev, turnState: "game_over" }));
			setMessage(`Chúc mừng ${player.toUpperCase()} đã chiến thắng!`);
			setIsGameStarted(false);
			return true;
		}
		return false;
	};

	const aiChooseMove = () => {
		if (
			gameState.turnState !== "ai_thinking" ||
			gameState.validMoves.length === 0
		) {
			setTimeout(switchTurn, 500);
			return;
		}

		let bestMove: Move | null = null;
		const difficulty = gameState.difficulty;

		if (difficulty === "easy") {
			bestMove =
				gameState.validMoves[
					Math.floor(Math.random() * gameState.validMoves.length)
				];
		} else {
			const scoredMoves = gameState.validMoves.map((move) => {
				let score = 0;
				const piece = gameState.pieces[move.pieceId];
				if (move.moveType === "finish") score += 1000;
				if (move.isCapture) score += 500;
				if (move.moveType === "stable_out")
					score += gameState.diceValue === 6 ? 210 : 200;
				if (move.moveType === "home_path") score += 300;
				if (move.targetState === "on_path") {
					let currentRelPos =
						piece.position - START_POSITIONS[piece.player];
					if (currentRelPos < 0) currentRelPos += PATH_LENGTH;
					let targetRelPos =
						move.targetPos - START_POSITIONS[piece.player];
					if (targetRelPos < 0) targetRelPos += PATH_LENGTH;
					score +=
						targetRelPos > currentRelPos
							? targetRelPos
							: targetRelPos + PATH_LENGTH;
				} else if (move.targetState === "in_home_path") {
					score += move.targetPos * 10;
				}
				if (difficulty === "hard") {
					const preHomePos = PRE_HOME_POSITIONS[piece.player];
					const startPos = START_POSITIONS[piece.player];
					const stepsToPreHome =
						preHomePos >= startPos
							? preHomePos - startPos + 1
							: PATH_LENGTH - startPos + preHomePos + 1;
					if (piece.state === "on_path")
						score += (stepsToPreHome - piece.stepsTaken) * 2;
					else if (piece.state === "in_home_path")
						score += (HOME_PATH_LENGTH - piece.position) * 5;
				}
				return { move, score };
			});

			scoredMoves.sort((a, b) => b.score - a.score);
			bestMove = scoredMoves[0].move;
			if (difficulty === "hard") {
				const topScore = scoredMoves[0].score;
				const bestMoves = scoredMoves.filter(
					(m) => m.score === topScore
				);
				bestMove =
					bestMoves[Math.floor(Math.random() * bestMoves.length)]
						.move;
			}
		}

		if (bestMove) {
			setMessage(
				`Máy (${gameState.currentPlayer}) chọn đi quân ${bestMove.pieceId}.`
			);
			executeMove(bestMove);
		} else {
			setTimeout(switchTurn, 500);
		}
	};

	const PieceSVG: React.FC<{ player: string }> = ({ player }) => {
		const strokeColor =
			player === "yellow"
				? "#d4b81f"
				: player === "green"
					? "darkgreen"
					: player === "blue"
						? "mediumblue"
						: player;
		return (
			<svg
				viewBox="0 0 40 40"
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMid meet">
				<path
					d="M 8 32 A 12 12 0 0 1 32 32"
					fill="none"
					stroke={strokeColor}
					strokeWidth="6"
					strokeLinecap="round"
				/>
			</svg>
		);
	};

	return (
		<div
			style={{
				fontFamily: "sans-serif",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				backgroundColor: "#f0f0f0",
				padding: "20px",
			}}>
			<h1>Cờ Cá Ngựa (Chơi với Máy)</h1>
			<div
				id="game-setup"
				style={{
					display: isGameStarted ? "none" : "block",
					marginBottom: "20px",
					backgroundColor: "white",
					padding: "15px",
					borderRadius: "8px",
					boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
				}}>
				<label
					htmlFor="difficulty"
					style={{
						margin: "5px",
						padding: "8px 12px",
						fontSize: "1em",
					}}>
					Chọn độ khó:
				</label>
				<select
					id="difficulty"
					value={gameState.difficulty}
					onChange={(e) =>
						setGameState((prev) => ({
							...prev,
							difficulty: e.target.value as
								| "easy"
								| "normal"
								| "hard",
						}))
					}
					style={{
						margin: "5px",
						padding: "8px 12px",
						fontSize: "1em",
					}}>
					<option value="easy">Dễ (Easy)</option>
					<option value="normal">Thường (Normal)</option>
					<option value="hard">Khó (Hard)</option>
				</select>
				<button
					onClick={() => setIsGameStarted(true)}
					style={{
						margin: "5px",
						padding: "8px 12px",
						fontSize: "1em",
						cursor: "pointer",
					}}>
					Bắt đầu chơi
				</button>
			</div>
			<div
				id="game-container"
				style={{
					display: isGameStarted ? "flex" : "none",
					alignItems: "flex-start",
					gap: "30px",
				}}>
				<div
					id="board"
					style={{
						width: "600px",
						height: "600px",
						border: "3px solid #333",
						position: "relative",
						backgroundColor: "#fff",
						boxSizing: "border-box",
					}}>
					{pathCoordinates.map((coord, index) => {
						const isStartSquare = Object.entries(
							START_POSITIONS
						).some(([, startPos]) => index === startPos);
						const player = Object.keys(START_POSITIONS).find(
							(p) => START_POSITIONS[p as PlayerColor] === index
						);
						return (
							<div
								key={`path-${index}`}
								className={
									isStartSquare
										? `square start-square ${player}`
										: "square"
								}
								style={{
									width: "40px",
									height: "40px",
									border: "1px solid #ccc",
									position: "absolute",
									top: `${coord.top}px`,
									left: `${coord.left}px`,
									boxSizing: "border-box",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									fontSize: "10px",
									backgroundColor: isStartSquare
										? player === "red"
											? "#ffdddd"
											: player === "blue"
												? "#ddddff"
												: player === "green"
													? "#ddffdd"
													: "#ffffdd"
										: "white",
									zIndex: 1,
								}}
							/>
						);
					})}
					{PLAYERS.map((player) =>
						homePathCoordinates[player].map((coord, index) => (
							<div
								key={`${player}-home-${index}`}
								className={`square home-path ${player}`}
								style={{
									width: "40px",
									height: "40px",
									border: "1px solid #ccc",
									position: "absolute",
									top: `${coord.top}px`,
									left: `${coord.left}px`,
									boxSizing: "border-box",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									fontSize: "10px",
									backgroundColor:
										player === "red"
											? "#ffcccc"
											: player === "blue"
												? "#ccccff"
												: player === "green"
													? "#ccffcc"
													: "#ffffcc",
									zIndex: 1,
								}}
							/>
						))
					)}
					{PLAYERS.map((player) => (
						<div
							key={`stable-${player}`}
							className={`stable ${player}`}
							style={{
								width: "240px",
								height: "240px",
								border: `2px solid ${player === "red" ? "red" : player === "blue" ? "blue" : player === "green" ? "green" : "#ccad00"}`,
								position: "absolute",
								top:
									player === "red" || player === "blue"
										? "0px"
										: "360px",
								left:
									player === "red" || player === "yellow"
										? "0px"
										: "360px",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								boxSizing: "border-box",
								zIndex: 0,
								backgroundColor:
									player === "red"
										? "#ffdddd"
										: player === "blue"
											? "#ddddff"
											: player === "green"
												? "#ddffdd"
												: "#ffffdd",
								color:
									player === "red"
										? "red"
										: player === "blue"
											? "blue"
											: player === "green"
												? "green"
												: "#ccad00",
							}}>
							<div
								className="stable-inner"
								style={{
									width: "90%",
									height: "90%",
									border: "1px dashed #666",
									display: "flex",
									flexWrap: "wrap",
									justifyContent: "space-around",
									alignItems: "center",
									fontWeight: "bold",
									fontSize: "1.1em",
									padding: "5px",
									boxSizing: "border-box",
								}}>
								{Object.values(gameState.pieces)
									.filter(
										(piece) =>
											piece.player === player &&
											piece.state === "stable"
									)
									.map((piece) => (
										<div
											key={piece.id}
											className={`piece in-stable ${gameState.validMoves.some((m) => m.pieceId === piece.id) ? "highlight" : ""}`}
											onClick={() =>
												handlePieceClick(piece)
											}
											style={{
												width: "28px",
												height: "28px",
												boxSizing: "border-box",
												cursor: "pointer",
												transition:
													"top 0.3s ease, left 0.3s ease, box-shadow 0.2s ease",
												zIndex: 10,
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												overflow: "hidden",
												margin: "2px",
												flexShrink: 0,
												boxShadow:
													gameState.validMoves.some(
														(m) =>
															m.pieceId ===
															piece.id
													)
														? "0 0 8px 4px gold"
														: "none",
											}}>
											<PieceSVG player={piece.player} />
										</div>
									))}
							</div>
						</div>
					))}
					{Object.values(gameState.pieces)
						.filter(
							(piece) =>
								piece.state === "on_path" ||
								piece.state === "in_home_path"
						)
						.map((piece) => {
							const coord =
								piece.state === "on_path"
									? pathCoordinates[piece.position]
									: homePathCoordinates[piece.player][
											piece.position - 1
										];
							return (
								<div
									key={piece.id}
									className={`piece ${piece.player} ${gameState.validMoves.some((m) => m.pieceId === piece.id) ? "highlight" : ""}`}
									onClick={() => handlePieceClick(piece)}
									style={{
										width: "32px",
										height: "32px",
										boxSizing: "border-box",
										cursor: "pointer",
										transition:
											"top 0.3s ease, left 0.3s ease, box-shadow 0.2s ease",
										zIndex: 10,
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										overflow: "hidden",
										position: "absolute",
										top: `${coord.top + (SQUARE_SIZE - 32) / 2}px`,
										left: `${coord.left + (SQUARE_SIZE - 32) / 2}px`,
										boxShadow: gameState.validMoves.some(
											(m) => m.pieceId === piece.id
										)
											? "0 0 8px 4px gold"
											: "none",
									}}>
									<PieceSVG player={piece.player} />
								</div>
							);
						})}
					<div
						id="center-area"
						style={{
							position: "absolute",
							width: "120px",
							height: "120px",
							top: "240px",
							left: "240px",
							backgroundColor: "#ddd",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							fontWeight: "bold",
							fontSize: "1.5em",
							textAlign: "center",
							boxSizing: "border-box",
							border: "2px solid #999",
							zIndex: 0,
						}}>
						Đích
					</div>
				</div>
				<div
					id="controls"
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						backgroundColor: "white",
						padding: "20px",
						borderRadius: "8px",
						boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
						minWidth: "200px",
					}}>
					<div id="dice-area" style={{ marginBottom: "15px" }}>
						<div
							id="dice"
							style={{
								width: "60px",
								height: "60px",
								border: "2px solid #666",
								borderRadius: "5px",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								fontSize: "2em",
								fontWeight: "bold",
								backgroundColor: "#f9f9f9",
							}}>
							{gameState.diceValue || "?"}
						</div>
					</div>
					<button
						id="roll-button"
						onClick={rollDice}
						disabled={
							gameState.turnState !== "waiting_for_roll" ||
							gameState.currentPlayer !== HUMAN_PLAYER
						}
						style={{
							padding: "10px 20px",
							fontSize: "1.1em",
							cursor:
								gameState.turnState === "waiting_for_roll" &&
								gameState.currentPlayer === HUMAN_PLAYER
									? "pointer"
									: "not-allowed",
							marginBottom: "15px",
							opacity:
								gameState.turnState !== "waiting_for_roll" ||
								gameState.currentPlayer !== HUMAN_PLAYER
									? 0.6
									: 1,
						}}>
						Tung Xúc Xắc
					</button>
					<div
						id="message-area"
						style={{
							marginTop: "10px",
							padding: "10px",
							backgroundColor: "#e7f3fe",
							borderLeft: "5px solid #2196F3",
							minHeight: "40px",
							width: "90%",
							textAlign: "center",
							fontStyle: "italic",
							fontSize: "0.95em",
						}}>
						{message}
					</div>
					<div
						id="turn-indicator"
						style={{ marginTop: "15px", fontWeight: "bold" }}>
						Lượt của:{" "}
						<span
							style={{
								color:
									gameState.currentPlayer === "red"
										? "red"
										: gameState.currentPlayer === "blue"
											? "blue"
											: gameState.currentPlayer ===
												  "green"
												? "green"
												: "#ccad00",
							}}>
							{gameState.currentPlayer}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Ludo;
