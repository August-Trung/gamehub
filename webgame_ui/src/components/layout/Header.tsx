// src/components/layout/Header.tsx
interface HeaderProps {
	currentGame: string | null;
	onBackToMenu: () => void;
}

export default function Header({ currentGame, onBackToMenu }: HeaderProps) {
	return (
		<header className="bg-blue-600 text-white p-4 shadow-md">
			<div className="container mx-auto flex justify-between items-center">
				<h1 className="text-2xl font-bold">Game Hub</h1>
				{currentGame && (
					<button
						onClick={onBackToMenu}
						className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded transition duration-300">
						Back to Menu
					</button>
				)}
			</div>
		</header>
	);
}
