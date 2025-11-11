import { TETROMINO_COLORS } from "../constants/constants";

interface CellProps {
	type: number;
	isActive?: boolean;
}

const Cell: React.FC<CellProps> = ({ type, isActive = false }) => (
	<div
		className={`tetris-cell ${isActive ? "tetris-cell-active" : ""}`}
		style={{
			backgroundColor: TETROMINO_COLORS[type] || "#111",
		}}
	/>
);

export default Cell;
