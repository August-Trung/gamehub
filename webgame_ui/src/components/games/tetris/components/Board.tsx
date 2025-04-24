import Cell from "./Cell";
import { PlayerType } from "../types/types";

interface BoardProps {
	board: number[][];
	player: PlayerType;
	gameOver: boolean;
	isPaused: boolean;
}

const Board: React.FC<BoardProps> = ({ board, player, gameOver }) => {
	const renderBoard = () => {
		// Create a copy of the board
		const boardCopy = board.map((row) => [...row]);

		// Add the current tetromino to the board copy
		if (!gameOver && player.tetromino) {
			player.tetromino.forEach((row, y) => {
				row.forEach((value, x) => {
					if (value !== 0) {
						const boardY = y + player.pos.y;
						const boardX = x + player.pos.x;
						if (
							boardY >= 0 &&
							boardY < board.length &&
							boardX >= 0 &&
							boardX < board[0].length
						) {
							boardCopy[boardY][boardX] = value;
						}
					}
				});
			});
		}

		return boardCopy.map((row, y) => (
			<div key={y} className="tetris-row">
				{row.map((cell, x) => (
					<Cell key={`${y}-${x}`} type={cell} />
				))}
			</div>
		));
	};

	return <>{renderBoard()}</>;
};

export default Board;
