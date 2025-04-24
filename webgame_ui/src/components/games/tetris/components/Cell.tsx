import { TETROMINO_COLORS } from "../constants/constants";

interface CellProps {
	type: number;
}

const Cell: React.FC<CellProps> = ({ type }) => (
	<div
		className="tetris-cell"
		style={{
			backgroundColor: TETROMINO_COLORS[type] || "#111",
		}}
	/>
);

export default Cell;
