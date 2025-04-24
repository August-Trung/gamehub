interface ControlsProps {
	isPaused: boolean;
	gameOver: boolean;
	startGame: () => void;
	pauseGame: () => void;
	resetGame: () => void;
	movePlayer: (dir: number) => void;
	moveDown: () => void;
	rotate: () => void;
	hardDrop: () => void;
	isMobile?: boolean;
}

const Controls: React.FC<ControlsProps> = ({
	isPaused,
	gameOver,
	startGame,
	pauseGame,
	resetGame,
	movePlayer,
	moveDown,
	rotate,
	hardDrop,
	isMobile,
}) => {
	return (
		<div className="tetris-controls-panel">
			<div className="tetris-button-container">
				<button
					onClick={isPaused ? startGame : pauseGame}
					className="tetris-button">
					{gameOver ? "New" : isPaused ? "Start" : "Pause"}
				</button>
				<button onClick={resetGame} className="tetris-button">
					{isMobile ? "Reset" : "Reset"}
				</button>
			</div>

			<div className="tetris-controls-container">
				<div className="tetris-control-row">
					<button
						onClick={rotate}
						disabled={isPaused || gameOver}
						className={`tetris-control-button ${
							isPaused || gameOver ? "disabled" : ""
						}`}>
						{isMobile ? "↻" : "Rotate"}
					</button>
				</div>
				<div className="tetris-direction-button-container">
					<button
						onClick={() => movePlayer(-1)}
						disabled={isPaused || gameOver}
						className={`tetris-direction-button ${
							isPaused || gameOver ? "disabled" : ""
						}`}>
						{isMobile ? "←" : "Left"}
					</button>
					<button
						onClick={moveDown}
						disabled={isPaused || gameOver}
						className={`tetris-direction-button ${
							isPaused || gameOver ? "disabled" : ""
						}`}>
						{isMobile ? "↓" : "Down"}
					</button>
					<button
						onClick={() => movePlayer(1)}
						disabled={isPaused || gameOver}
						className={`tetris-direction-button ${
							isPaused || gameOver ? "disabled" : ""
						}`}>
						{isMobile ? "→" : "Right"}
					</button>
				</div>
				<div className="tetris-control-row">
					<button
						onClick={hardDrop}
						disabled={isPaused || gameOver}
						className={`tetris-control-button ${
							isPaused || gameOver ? "disabled" : ""
						}`}>
						{isMobile ? "⤓" : "Drop"}
					</button>
				</div>
			</div>

			{!isMobile && (
				<div className="tetris-keyboard-help">
					<h4 className="tetris-keyboard-header">
						Keyboard Controls:
					</h4>
					<p className="tetris-keyboard-instruction">
						← → : Move left/right
					</p>
					<p className="tetris-keyboard-instruction">↑ : Rotate</p>
					<p className="tetris-keyboard-instruction">↓ : Move down</p>
					<p className="tetris-keyboard-instruction">
						Space : Hard drop
					</p>
					<p className="tetris-keyboard-instruction">P : Pause</p>
				</div>
			)}

			{isMobile && (
				<div className="tetris-keyboard-help">
					<p className="tetris-keyboard-instruction">
						Tap buttons to play
					</p>
				</div>
			)}
		</div>
	);
};

export default Controls;
