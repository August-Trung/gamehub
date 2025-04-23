const LudoGame = () => {
	return (
		<div style={{ width: "100%", height: "100vh", maxHeight: "900px" }}>
			<iframe
				src="/games/ludo/index.html"
				title="Ludo Game"
				style={{
					width: "100%",
					height: "100%",
					border: "none",
					display: "block",
				}}
				allowFullScreen
			/>
		</div>
	);
};

export default LudoGame;
