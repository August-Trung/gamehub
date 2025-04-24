import { useEffect, useRef, useState } from "react";

const LudoGame = () => {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [iframeHeight, setIframeHeight] = useState<number>(600);

	useEffect(() => {
		const handleResizeMessage = (event: MessageEvent) => {
			const data = event.data;
			if (
				data &&
				typeof data === "object" &&
				data.type === "ludo-resize" &&
				typeof data.height === "number"
			) {
				setIframeHeight(data.height);
			}
		};

		window.addEventListener("message", handleResizeMessage);
		return () => window.removeEventListener("message", handleResizeMessage);
	}, []);

	const iframeStyles: React.CSSProperties = {
		width: "100%",
		height: `${iframeHeight}px`,
		border: "none",
		display: "block",
	};

	return (
		<div style={{ width: "100%" }}>
			<iframe
				ref={iframeRef}
				src="/games/ludo/index.html"
				title="Ludo Game"
				style={iframeStyles}
				allowFullScreen
			/>
		</div>
	);
};

export default LudoGame;
