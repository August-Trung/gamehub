// components/TetrisControls.tsx
import React from "react";

interface TetrisControlsProps {
	isPaused: boolean;
	gameOver: boolean;
	onStart: () => void;
	onPause: () => void;
	onReset: () => void;
	onMoveLeft: () => void;
	onMoveRight: () => void;
	onRotate: () => void;
	onMoveDown: () => void;
	onHardDrop: () => void;
}

const TetrisControls: React.FC<TetrisControlsProps> = ({
	isPaused,
	gameOver,
	onStart,
	onPause,
	onReset,
	onMoveLeft,
	onMoveRight,
	onRotate,
	onMoveDown,
	onHardDrop,
}) => {
	return (
		<div className="tetris-controls">
			<div className="game-buttons">
				{gameOver ? (
					<button onClick={onStart}>New Game</button>
				) : (
					<button onClick={isPaused ? onStart : onPause}>
						{isPaused ? "Resume" : "Pause"}
					</button>
				)}
				<button onClick={onReset}>Reset</button>
			</div>

			<div className="mobile-controls">
				<div className="control-row">
					<button onClick={onRotate}>Rotate</button>
				</div>
				<div className="control-row">
					<button onClick={onMoveLeft}>Left</button>
					<button onClick={onMoveDown}>Down</button>
					<button onClick={onMoveRight}>Right</button>
				</div>
				<div className="control-row">
					<button onClick={onHardDrop}>Drop</button>
				</div>
			</div>

			<div className="keyboard-instructions">
				<h4>Keyboard Controls:</h4>
				<p>← → : Move left/right</p>
				<p>↑ : Rotate</p>
				<p>↓ : Move down</p>
				<p>Space : Hard drop</p>
				<p>P : Pause</p>
			</div>
		</div>
	);
};

export default TetrisControls;
