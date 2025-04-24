// src/GameHub.tsx
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WordleGame from "@/components/games/wordle/WordleGame";
import Game2048 from "@/components/games/2048/Game2048";
import SudokuGame from "@/components/games/sudoku/SudokuGame";
import CaroGame from "@/components/games/caro/CaroGame";
import BattleshipGame from "@/components/games/battleship/BattleshipGame";
import TetrisGame from "@/components/games/tetris/TetrisGame";
import ChessGame from "@/components/games/chess/ChessGame";
import HangmanGame from "@/components/games/hangman/HangmanGame";
import LudoGame from "@/components/games/ludo/LudoGame";
import { GameItem } from "@/types/game";

export default function GameHub(): JSX.Element {
	const [currentGame, setCurrentGame] = useState<string | null>(null);

	const games: GameItem[] = [
		{ id: "wordle", name: "Wordle", component: <WordleGame /> },
		{ id: "2048", name: "2048", component: <Game2048 /> },
		{ id: "sudoku", name: "Sudoku", component: <SudokuGame /> },
		{ id: "caro", name: "Caro", component: <CaroGame /> },
		{ id: "battleship", name: "Battleship", component: <BattleshipGame /> },
		{ id: "tetrisGame", name: "TetrisGame", component: <TetrisGame /> },
		{ id: "chessGame", name: "ChessGame", component: <ChessGame /> },
		{ id: "hangmanGame", name: "HangmanGame", component: <HangmanGame /> },
		{ id: "ludo", name: "Ludo", component: <LudoGame /> },
	];

	games.sort((a, b) => a.name.localeCompare(b.name));

	const handleBackToMenu = () => {
		setCurrentGame(null);
	};

	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<Header currentGame={currentGame} onBackToMenu={handleBackToMenu} />

			<main className="container mx-auto p-4 w-full flex-grow flex items-start">
				{currentGame ? (
					<div className="animate-fadeIn w-full">
						{
							games.find((game) => game.id === currentGame)
								?.component
						}
					</div>
				) : (
					<div className="w-full">
						<h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
							🎮 Choose a Game to Play
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{games.map((game, index) => (
								<div
									key={game.id}
									className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer"
									onClick={() => setCurrentGame(game.id)}
									style={{
										animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
									}}>
									<h3 className="text-lg font-medium mb-2">
										{game.name}
									</h3>
									<p className="text-gray-600">
										Play {game.name}
									</p>
								</div>
							))}

							<div
								className="bg-gray-200 p-6 rounded-lg shadow border-2 border-dashed border-gray-400 flex items-center justify-center transform hover:scale-105 transition duration-300"
								style={{
									animation: `fadeInUp 0.5s ease-out 0.3s both`,
								}}>
								<p className="text-gray-500 text-center">
									More games coming soon!
								</p>
							</div>
						</div>
					</div>
				)}
			</main>

			<Footer />

			<style>{`
				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out forwards;
				}
			`}</style>
		</div>
	);
}
