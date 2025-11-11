// src/GameHub.tsx
import { useMemo, useState } from "react";

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
import ChineseChessGame from "@/components/games/chinesechessgame/ChineseChessGame";
import MandarinSquareCapturingGame from "@/components/games/mandarinsquarecapturing/MandarinSquareCapturingGame";
import { GameItem } from "@/types/game";
import { useLanguage } from "@/contexts/LanguageContext";

type Localized = { vi: string; en: string };

type GameDefinition = {
	id: string;
	component: JSX.Element;
	icon: string;
	status?: string;
	gradient?: string;
	name: Localized;
	tagline: Localized;
	category: Localized;
	categoryKey: string;
	difficulty: Localized;
	players: Localized;
};

const GAME_LIBRARY: GameDefinition[] = [
	{
		id: "wordle",
		component: <WordleGame />,
		icon: "🧠",
		status: "Hot",
		gradient: "from-fuchsia-500/70 via-purple-500/60 to-slate-900/40",
		name: { vi: "Wordle", en: "Wordle" },
		tagline: {
			vi: "Giải mã từ 5 chữ trước khi hết lượt.",
			en: "Crack the five-letter code before your streak ends.",
		},
		category: { vi: "Giải đố", en: "Puzzle" },
		categoryKey: "puzzle",
		difficulty: { vi: "Hại não", en: "Brainy" },
		players: { vi: "Chơi một mình", en: "Solo" },
	},
	{
		id: "2048",
		component: <Game2048 />,
		icon: "⚡",
		status: "Legend",
		gradient: "from-amber-400/80 via-orange-500/70 to-slate-900/50",
		name: { vi: "2048", en: "2048" },
		tagline: {
			vi: "Vuốt ghép ô số để leo lên mốc huyền thoại.",
			en: "Swipe, merge, and climb to legendary tiles.",
		},
		category: { vi: "Arcade", en: "Arcade" },
		categoryKey: "arcade",
		difficulty: { vi: "Thử thách", en: "Challenging" },
		players: { vi: "Chơi một mình", en: "Solo" },
	},
	{
		id: "sudoku",
		component: <SudokuGame />,
		icon: "🧩",
		status: "New",
		gradient: "from-emerald-400/70 via-teal-500/60 to-slate-900/40",
		name: { vi: "Sudoku", en: "Sudoku" },
		tagline: {
			vi: "Bảng số kinh điển với chế độ tập trung thư thái.",
			en: "Classic grids reimagined with soothing focus mode.",
		},
		category: { vi: "Giải đố", en: "Puzzle" },
		categoryKey: "puzzle",
		difficulty: { vi: "Thư giãn", en: "Calm" },
		players: { vi: "Chơi một mình", en: "Solo" },
	},
	{
		id: "caro",
		component: <CaroGame />,
		icon: "🎯",
		gradient: "from-blue-500/70 via-sky-500/60 to-slate-900/40",
		name: { vi: "Caro", en: "Caro" },
		tagline: {
			vi: "Caro quốc dân trong diện mạo eSports.",
			en: "Vietnam's crowd favorite in a sleek esports skin.",
		},
		category: { vi: "Bàn cờ", en: "Board" },
		categoryKey: "board",
		difficulty: { vi: "Cạnh tranh", en: "Competitive" },
		players: { vi: "2 người", en: "2 Players" },
	},
	{
		id: "battleship",
		component: <BattleshipGame />,
		icon: "🚢",
		gradient: "from-cyan-400/70 via-blue-600/50 to-slate-900/50",
		name: { vi: "Battleship", en: "Battleship" },
		tagline: {
			vi: "Dàn hạm đội, định vị radar và thống trị đại dương.",
			en: "Deploy fleets, read blips, rule the high seas.",
		},
		category: { vi: "Chiến thuật", en: "Strategy" },
		categoryKey: "strategy",
		difficulty: { vi: "Chiến thuật", en: "Tactical" },
		players: { vi: "2 người", en: "2 Players" },
	},
	{
		id: "tetrisGame",
		component: <TetrisGame />,
		icon: "🧱",
		gradient: "from-pink-500/70 via-rose-500/60 to-slate-900/40",
		name: { vi: "Tetris", en: "Tetris" },
		tagline: {
			vi: "Khối neon rơi siêu tốc, groove bất tận.",
			en: "Neon blocks, hyper-speed drops, endless groove.",
		},
		category: { vi: "Arcade", en: "Arcade" },
		categoryKey: "arcade",
		difficulty: { vi: "Tốc độ", en: "Fast" },
		players: { vi: "Chơi một mình", en: "Solo" },
	},
	{
		id: "chessGame",
		component: <ChessGame />,
		icon: "♟️",
		gradient: "from-slate-500/70 via-slate-800/60 to-black/70",
		name: { vi: "Chess", en: "Chess" },
		tagline: {
			vi: "Luyện đẳng cấp cờ vua với vibe điện ảnh.",
			en: "Grandmaster-grade training with cinematic flair.",
		},
		category: { vi: "Chiến thuật", en: "Strategy" },
		categoryKey: "strategy",
		difficulty: { vi: "Cao thủ", en: "Master" },
		players: { vi: "2 người", en: "2 Players" },
	},
	{
		id: "hangmanGame",
		component: <HangmanGame />,
		icon: "✏️",
		gradient: "from-violet-400/70 via-indigo-500/60 to-slate-900/40",
		name: { vi: "Hangman", en: "Hangman" },
		tagline: {
			vi: "Săn chữ mỗi ngày với nét vẽ vui nhộn.",
			en: "Daily word hunts with playful art drops.",
		},
		category: { vi: "Giải đố", en: "Puzzle" },
		categoryKey: "puzzle",
		difficulty: { vi: "Nhẹ nhàng", en: "Casual" },
		players: { vi: "Chơi một mình", en: "Solo" },
	},
	{
		id: "ludo",
		component: <LudoGame />,
		icon: "🎲",
		gradient: "from-lime-400/70 via-emerald-500/60 to-slate-900/40",
		name: { vi: "Ludo", en: "Ludo" },
		tagline: {
			vi: "Không khí party-night kèm emoji phản ứng.",
			en: "Party-night chaos with reactive emotes.",
		},
		category: { vi: "Party", en: "Party" },
		categoryKey: "party",
		difficulty: { vi: "Thư giãn", en: "Chill" },
		players: { vi: "4 người", en: "4 Players" },
	},
	{
		id: "chinesechessgame",
		component: <ChineseChessGame />,
		icon: "🀄",
		gradient: "from-red-500/70 via-rose-600/60 to-slate-900/50",
		name: { vi: "Cờ tướng", en: "Chinese Chess" },
		tagline: {
			vi: "Cờ tướng nét mực neon chuẩn Á Đông.",
			en: "Xiangqi battles rendered in neon ink strokes.",
		},
		category: { vi: "Chiến thuật", en: "Strategy" },
		categoryKey: "strategy",
		difficulty: { vi: "Nâng cao", en: "Advanced" },
		players: { vi: "2 người", en: "2 Players" },
	},
	{
		id: "mandarinsquarecapturing",
		component: <MandarinSquareCapturingGame />,
		icon: "🏯",
		gradient: "from-yellow-400/70 via-amber-500/60 to-slate-900/40",
		name: { vi: "Ô ăn quan", en: "Mandarin Square" },
		tagline: {
			vi: "Ô ăn quan cổ truyền khoác UI hiện đại.",
			en: "Ancient royal strategy with modern UX polish.",
		},
		category: { vi: "Chiến thuật", en: "Strategy" },
		categoryKey: "strategy",
		difficulty: { vi: "Chiến thuật", en: "Tactical" },
		players: { vi: "2 người", en: "2 Players" },
	},
];

const HOME_COPY = {
	vi: {
		hero: {
			eyebrow: "Game Hub AT",
			title: "Cổng game indie & esports mini ngay trên trình duyệt",
			description:
				"Săn thử thách mới mỗi ngày, mở game tức thì không cần tải, phù hợp mọi thiết bị. Được build thủ công với UX mượt và hiệu ứng neon cực cháy.",
			stats: [
				{ key: "games", label: "Mini game", value: "" },
				{ key: "drops", label: "Game mới", value: "3" },
				{ key: "session", label: "Phiên trung bình", value: "12 phút" },
			],
			ctas: { primary: "Chơi ngẫu nhiên", secondary: "Xem thư viện" },
		},
		playing: {
			label: "Đang chơi",
			random: "Ngẫu nhiên",
			back: "Về sảnh",
		},
		featured: {
			label: "Trò nổi bật",
			mode: "Chế độ",
			flow: "Nhịp độ",
			genre: "Thể loại",
			button: "Chơi ngay",
		},
		library: {
			eyebrow: "Game library",
			heading: "Chọn sân chơi cho mood hiện tại",
			searchPlaceholder: "Tìm game, thể loại, mood...",
			allLabel: "Tất cả",
			buttonLabel: "Vào chơi",
			emptyTitle: "Không tìm thấy game hợp mood này 😢",
			emptyDescription:
				"Thử đổi từ khóa hoặc quay lại trạng thái tất cả thể loại nhé.",
		},
	},
	en: {
		hero: {
			eyebrow: "Game Hub AT",
			title: "Indie & esports mini games right in your browser",
			description:
				"Discover fresh challenges daily, launch instantly without installs, and enjoy smooth neon-coated UX across every device.",
			stats: [
				{ key: "games", label: "Mini games", value: "" },
				{ key: "drops", label: "New drops", value: "3" },
				{ key: "session", label: "Avg. session", value: "12 min" },
			],
			ctas: { primary: "Play something fresh", secondary: "Browse library" },
		},
		playing: {
			label: "Now playing",
			random: "Random game",
			back: "Back to lobby",
		},
		featured: {
			label: "Featured drop",
			mode: "Mode",
			flow: "Flow",
			genre: "Genre",
			button: "Launch experience",
		},
		library: {
			eyebrow: "Game library",
			heading: "Pick the playground that fits your vibe",
			searchPlaceholder: "Search games, genres, moods...",
			allLabel: "All",
			buttonLabel: "Launch now",
			emptyTitle: "No games match this vibe 😢",
			emptyDescription: "Try a different keyword or return to all genres.",
		},
	},
} as const;

export default function GameHub(): JSX.Element {
	const { language } = useLanguage();
	const copy = HOME_COPY[language];

	const [currentGame, setCurrentGame] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	const games: (GameItem & { categoryKey?: string })[] = useMemo(() => {
		return GAME_LIBRARY.map((game) => ({
			...game,
			name: game.name[language],
			tagline: game.tagline[language],
			category: game.category[language],
			difficulty: game.difficulty[language],
			players: game.players[language],
		}))
			.sort((a, b) => a.name.localeCompare(b.name))
			.map((game) => ({
				...game,
				categoryKey: game.categoryKey,
			}));
	}, [language]);

	const heroStats = useMemo(() => {
		return copy.hero.stats.map((stat) =>
			stat.key === "games"
				? { ...stat, value: games.length.toString() }
				: stat,
		);
	}, [copy.hero.stats, games.length]);

	const categoryFilters = useMemo(() => {
		const keys = Array.from(
			new Set(GAME_LIBRARY.map((game) => game.categoryKey)),
		);
		return [
			{ key: "all", label: copy.library.allLabel },
			...keys.map((key) => {
				const sample = GAME_LIBRARY.find(
					(game) => game.categoryKey === key,
				);
				return {
					key,
					label: sample ? sample.category[language] : key,
				};
			}),
		];
	}, [copy.library.allLabel, language]);

	const filteredGames = useMemo(() => {
		const normalizedTerm = searchTerm.trim().toLowerCase();
		return games.filter((game) => {
			const matchesCategory =
				selectedCategory === "all" ||
				game.categoryKey === selectedCategory;
			const matchesSearch =
				normalizedTerm.length === 0 ||
				game.name.toLowerCase().includes(normalizedTerm) ||
				game.tagline?.toLowerCase().includes(normalizedTerm);

			return matchesCategory && matchesSearch;
		});
	}, [games, searchTerm, selectedCategory]);

	const featuredGame =
		games.find((game) => game.status === "New") ?? games[0] ?? null;

	const trendingGames = useMemo(
		() =>
			games
				.filter((game) => ["Hot", "Legend"].includes(game.status || ""))
				.slice(0, 3),
		[games],
	);

	const handleBackToMenu = () => {
		setCurrentGame(null);
	};

	const handleRandomGame = () => {
		const randomGame =
			games[Math.floor(Math.random() * Math.max(games.length, 1))];
		if (randomGame) {
			setCurrentGame(randomGame.id);
		}
	};

	const handlePlayGame = (gameId: string) => {
		setCurrentGame(gameId);
	};

	return (
		<div className="min-h-screen bg-slate-950 text-white flex flex-col">
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]" />
			<Header currentGame={currentGame} onBackToMenu={handleBackToMenu} />

			<main className="container mx-auto px-4 md:px-8 lg:px-12 py-10 flex-grow w-full">
				{currentGame ? (
					<section className="animate-fadeIn rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
						<div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
							<div>
								<p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
									{copy.playing.label}
								</p>
								<h2 className="text-3xl font-semibold text-white">
									{
										games.find(
											(game) =>
												game.id === currentGame,
										)?.name
									}
								</h2>
							</div>
							<div className="flex gap-3">
								<button
									onClick={handleRandomGame}
									className="px-4 py-2 rounded-full border border-white/20 text-sm font-medium hover:bg-white/10 transition">
									{copy.playing.random}
								</button>
								<button
									onClick={handleBackToMenu}
									className="px-4 py-2 rounded-full bg-cyan-400/90 text-slate-950 text-sm font-semibold hover:bg-cyan-300 transition">
									{copy.playing.back}
								</button>
							</div>
						</div>
						<div className="rounded-2xl overflow-hidden bg-slate-950/70 border border-white/5">
							{
								games.find((game) => game.id === currentGame)
									?.component
							}
						</div>
					</section>
				) : (
					<div className="space-y-10">
						<section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
							<div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-950 shadow-2xl shadow-cyan-500/20 p-8">
								<div className="absolute -right-12 top-0 h-64 w-64 rounded-full bg-cyan-500/30 blur-3xl" />
								<div className="space-y-6 relative">
									<p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">
										{copy.hero.eyebrow}
									</p>
									<h1 className="text-4xl md:text-5xl font-bold leading-tight">
										{copy.hero.title}
									</h1>
									<p className="text-lg text-slate-200/80 max-w-2xl">
										{copy.hero.description}
									</p>
									<div className="flex flex-wrap gap-4">
										<button
											onClick={handleRandomGame}
											className="px-6 py-3 rounded-full bg-cyan-400 text-slate-950 font-semibold text-sm uppercase tracking-wide hover:bg-cyan-300 transition shadow-lg shadow-cyan-400/50">
											{copy.hero.ctas.primary}
										</button>
										<button
											onClick={() => {
												document
													.getElementById(
														"game-library",
													)
													?.scrollIntoView({
														behavior: "smooth",
													});
											}}
											className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-sm uppercase tracking-wide hover:bg-white/10 transition">
											{copy.hero.ctas.secondary}
										</button>
									</div>
									<div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
										{heroStats.map((stat) => (
											<div
												key={stat.label}
												className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
												<p className="text-3xl font-bold text-cyan-300">
													{stat.value}
												</p>
												<p className="text-xs uppercase tracking-[0.3em] text-white/70">
													{stat.label}
												</p>
											</div>
										))}
									</div>
								</div>
								<div className="mt-8 flex flex-wrap gap-3">
									{trendingGames.map((game) => (
										<button
											key={game.id}
											onClick={() => handlePlayGame(game.id)}
											className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm flex items-center gap-2 transition">
											<span>{game.icon}</span>
											<span>{game.name}</span>
											<span className="text-xs uppercase tracking-[0.3em] text-cyan-200">
												{game.status}
											</span>
										</button>
									))}
								</div>
							</div>
							{featuredGame && (
								<div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/10 backdrop-blur-2xl p-6 flex flex-col justify-between shadow-[0_20px_60px_rgba(15,118,230,0.25)]">
									<div className="space-y-4">
										<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
											{copy.featured.label}
										</p>
										<div className="flex items-center gap-4">
											<div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
												{featuredGame.icon}
											</div>
											<div>
												<h3 className="text-2xl font-semibold">
													{featuredGame.name}
												</h3>
												<p className="text-sm text-white/70">
													{featuredGame.tagline}
												</p>
											</div>
										</div>
									</div>
									<div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
										<div className="rounded-2xl border border-white/10 p-3 bg-white/5">
											<p className="uppercase tracking-[0.3em] text-white/60">
												{copy.featured.mode}
											</p>
											<p className="text-sm font-semibold">
												{featuredGame.players}
											</p>
										</div>
										<div className="rounded-2xl border border-white/10 p-3 bg-white/5">
											<p className="uppercase tracking-[0.3em] text-white/60">
												{copy.featured.flow}
											</p>
											<p className="text-sm font-semibold">
												{featuredGame.difficulty}
											</p>
										</div>
										<div className="rounded-2xl border border-white/10 p-3 bg-white/5">
											<p className="uppercase tracking-[0.3em] text-white/60">
												{copy.featured.genre}
											</p>
											<p className="text-sm font-semibold">
												{featuredGame.category}
											</p>
										</div>
									</div>
									<button
										onClick={() =>
											handlePlayGame(featuredGame.id)
										}
										className="mt-6 w-full rounded-full bg-white text-slate-900 font-semibold py-3 text-sm uppercase tracking-wide hover:bg-gray-100 transition">
										{copy.featured.button}
									</button>
								</div>
							)}
						</section>

						<section
							id="game-library"
							className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-2xl shadow-2xl shadow-black/40">
							<div className="flex flex-col gap-6">
								<div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
									<div>
										<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
											{copy.library.eyebrow}
										</p>
										<h2 className="text-3xl font-semibold">
											{copy.library.heading}
										</h2>
									</div>
									<div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
										<div className="relative flex-1">
											<input
												type="search"
												value={searchTerm}
												onChange={(event) =>
													setSearchTerm(
														event.target.value,
													)
												}
												placeholder={
													copy.library
														.searchPlaceholder
												}
												className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-3 text-sm placeholder:text-white/40 focus:border-cyan-300 focus:outline-none"
											/>
										</div>
									</div>
								</div>
								<div className="flex flex-wrap gap-3">
									{categoryFilters.map((category) => (
										<button
											key={category.key}
											onClick={() =>
												setSelectedCategory(
													category.key,
												)
											}
											className={`px-4 py-2 rounded-full border text-sm transition ${
												selectedCategory ===
												category.key
													? "border-cyan-300 bg-cyan-400/20 text-cyan-200"
													: "border-white/10 bg-white/5 text-white/70 hover:border-white/40"
											}`}>
											{category.label}
										</button>
									))}
								</div>
							</div>

							<div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
								{filteredGames.map((game) => (
									<div
										key={game.id}
										className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-5 transition hover:-translate-y-1 hover:border-cyan-300/60">
										<div
											className={`absolute inset-0 opacity-0 group-hover:opacity-70 transition bg-gradient-to-br ${
												game.gradient ||
												"from-cyan-400/40 to-blue-500/40"
											}`}
										/>
										<div className="relative space-y-4">
											<div className="flex items-start justify-between">
												<div className="flex items-center gap-3">
													<div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
														{game.icon || "🎮"}
													</div>
													<div>
														<h3 className="text-xl font-semibold">
															{game.name}
														</h3>
														<p className="text-sm text-white/70">
															{game.tagline ||
																copy.library
																	.buttonLabel}
														</p>
													</div>
												</div>
												{game.status && (
													<span className="text-xs uppercase tracking-[0.3em] text-cyan-200">
														{game.status}
													</span>
												)}
											</div>
											<div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
												<span className="rounded-full border border-white/20 px-3 py-1">
													{game.category || "Arcade"}
												</span>
												<span className="rounded-full border border-white/20 px-3 py-1">
													{game.difficulty || "Casual"}
												</span>
												<span className="rounded-full border border-white/20 px-3 py-1">
													{game.players || "Solo"}
												</span>
											</div>
											<button
												onClick={() =>
													handlePlayGame(game.id)
												}
												className="mt-4 inline-flex items-center justify-center w-full rounded-2xl bg-white/10 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-white/80 hover:text-slate-900 transition">
												{copy.library.buttonLabel}
											</button>
										</div>
									</div>
								))}
								{filteredGames.length === 0 && (
									<div className="col-span-full rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/70">
										<p className="text-lg font-medium">
											{copy.library.emptyTitle}
										</p>
										<p className="text-sm mt-2">
											{copy.library.emptyDescription}
										</p>
									</div>
								)}
							</div>
						</section>
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
