import React from "react";
import BattleshipBoard from "./components/BattleshipBoard";
import ShipSelectionPanel from "./components/ShipSelectionPanel";
import { useBattleshipGame } from "./hooks/useBattleshipGame";
import "./BattleshipGame.css";

const BattleshipGame: React.FC = () => {
	const {
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
	} = useBattleshipGame();

	if (showSwitchScreen) {
		return (
			<div className="player-switch-screen">
				<h2>Chuyển lượt</h2>
				<p>
					Vui lòng chuyển máy tính cho{" "}
					{gamePhase === "placement1"
						? "Người chơi 2"
						: gamePhase === "placement2"
							? "Người chơi 1"
							: currentPlayer === "player1"
								? "Người chơi 2"
								: "Người chơi 1"}
				</p>
				<button onClick={confirmPlayerSwitch}>Đã sẵn sàng</button>
			</div>
		);
	}

	// Xác định xem có đang trong giai đoạn đặt tàu không
	const isPlacementPhase =
		gamePhase === "placement1" || gamePhase === "placement2";
	const currentPlayerName =
		gamePhase === "placement1"
			? "Người chơi 1"
			: gamePhase === "placement2"
				? "Người chơi 2"
				: currentPlayer === "player1"
					? "Người chơi 1"
					: "Người chơi 2";

	return (
		<div className="battleship-game">
			<h1>Battleship Game - {currentPlayerName}</h1>

			{isPlacementPhase ? (
				<div className="placement-phase">
					<h2>Đặt tàu của bạn</h2>
					<ShipSelectionPanel
						ships={getCurrentPlayerShips()}
						selectedShip={selectedShip}
						onSelectShip={handleShipSelect}
						onRotateShip={handleShipRotate}
					/>
					<BattleshipBoard
						board={getOwnBoard()}
						onClick={handleCellClick}
						showShips={true}
					/>
					<button
						onClick={nextPhase}
						disabled={
							!getCurrentPlayerShips().every(
								(ship) => ship.placed
							)
						}>
						{gamePhase === "placement1"
							? "Hoàn tất đặt tàu - Chuyển sang Người chơi 2"
							: "Bắt đầu trận đấu"}
					</button>
				</div>
			) : (
				<div className="battle-phase">
					<div className="boards-container">
						<div className="board-wrapper">
							<h2>Bảng của bạn</h2>
							<BattleshipBoard
								board={getOwnBoard()}
								onClick={() => {}}
								showShips={true}
							/>
						</div>
						<div className="board-wrapper">
							<h2>Bảng đối thủ</h2>
							<BattleshipBoard
								board={getOpponentBoard()}
								onClick={handleCellClick}
								showShips={false}
							/>
						</div>
					</div>

					<div className="game-status">
						<p>{gameStatus}</p>
						{gameStatus.includes("chiến thắng") && (
							<button onClick={resetGame}>Chơi lại</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default BattleshipGame;
