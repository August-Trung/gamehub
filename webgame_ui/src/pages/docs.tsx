import DefaultLayout from "@/layouts/default";
import { useLanguage } from "@/contexts/LanguageContext";

const DOCS_COPY = {
	vi: {
		heroEyebrow: "Tài liệu Game Hub",
		heroTitle: "Xây trải nghiệm game web chỉ trong vài bước",
		heroDescription:
			"Bộ doc này gom đủ guideline để bạn tùy biến hub theo phong cách riêng: từ khởi động dự án, thêm mini-game, đến tối ưu hành vi người chơi.",
		demoButton: "Mở demo",
		sourceButton: "Xem source",
		quickStarts: [
			{
				title: "1. Khởi động dự án",
				desc: "Clone repo, chạy `npm install` rồi `npm run dev` để mở trên localhost.",
				icon: "⚡",
				accent: "from-cyan-400/30 via-blue-500/20 to-white/0",
			},
			{
				title: "2. Cấu trúc module game",
				desc: "Mỗi mini-game nằm ở `src/components/games/*` với hook riêng, dễ nhân bản.",
				icon: "🧩",
				accent: "from-purple-500/30 via-fuchsia-500/20 to-white/0",
			},
			{
				title: "3. Xuất bản",
				desc: "Build bằng Vite, deploy lên Vercel / Netlify / Cloudflare Workers.",
				icon: "🚀",
				accent: "from-emerald-400/30 via-teal-500/20 to-white/0",
			},
		],
		guides: [
			{
				label: "Tùy biến giao diện",
				content:
					"Tailwind + theme neon giúp bạn chỉnh màu, font và motion chỉ với vài class.",
			},
			{
				label: "Thêm mini-game mới",
				content:
					"Tạo component, đăng ký trong `GameItem`, cung cấp metadata là xong.",
			},
			{
				label: "Tối ưu hiệu năng",
				content:
					"Dùng lazy import + suspense với game nặng, tái sử dụng hook âm thanh & input.",
			},
		],
		contributionSteps: [
			{
				step: "Fork & Issue",
				desc: "Báo bug hoặc đề xuất mini-game mới trên GitHub Issues.",
			},
			{
				step: "Pull Request",
				desc: "Gửi PR kèm mô tả rõ ràng, screenshot và checklist test.",
			},
			{
				step: "Launch",
				desc: "Được mention trong changelog & gắn badge contributor.",
			},
		],
		guideHeading: "Cẩm nang nhanh",
		guideSubHeading: "Trợ giúp thiết kế & phát triển",
		contributionHeading: "Lộ trình đóng góp",
	},
	en: {
		heroEyebrow: "Game Hub Docs",
		heroTitle: "Build a web-game experience in just a few steps",
		heroDescription:
			"This doc bundle shows you everything: project bootstrapping, adding new mini-games, and fine-tuning player experience.",
		demoButton: "Open demo",
		sourceButton: "View source",
		quickStarts: [
			{
				title: "1. Kick off the project",
				desc: "Clone the repo, run `npm install` then `npm run dev` to spin up localhost.",
				icon: "⚡",
				accent: "from-cyan-400/30 via-blue-500/20 to-white/0",
			},
			{
				title: "2. Game module structure",
				desc: "Each mini-game lives under `src/components/games/*` with its own hook.",
				icon: "🧩",
				accent: "from-purple-500/30 via-fuchsia-500/20 to-white/0",
			},
			{
				title: "3. Ship it",
				desc: "Build with Vite and deploy to Vercel, Netlify, or Cloudflare Workers.",
				icon: "🚀",
				accent: "from-emerald-400/30 via-teal-500/20 to-white/0",
			},
		],
		guides: [
			{
				label: "Style customization",
				content:
					"Tailwind + the neon theme let you tweak color, fonts, and motion effortlessly.",
			},
			{
				label: "Adding new mini-games",
				content:
					"Create a component, register it in `GameItem`, provide metadata—and you’re done.",
			},
			{
				label: "Performance tips",
				content:
					"Use lazy import + suspense for heavy games and reuse audio/input hooks.",
			},
		],
		contributionSteps: [
			{
				step: "Fork & Issue",
				desc: "Report bugs or pitch new mini-games via GitHub Issues.",
			},
			{
				step: "Pull Request",
				desc: "Submit a PR with clear description, screenshots, and tests.",
			},
			{
				step: "Launch",
				desc: "Get shouted out in the changelog and earn a contributor badge.",
			},
		],
		guideHeading: "Quick playbook",
		guideSubHeading: "Design & development helpers",
		contributionHeading: "Contribution flow",
	},
} as const;

export default function DocsPage() {
	const { language } = useLanguage();
	const copy = DOCS_COPY[language];

	return (
		<DefaultLayout>
			<div className="space-y-12 text-white">
				<section className="space-y-6 text-center">
					<p className="text-xs uppercase tracking-[0.5em] text-cyan-200">
						{copy.heroEyebrow}
					</p>
					<h1 className="text-4xl font-bold">{copy.heroTitle}</h1>
					<p className="text-lg text-white/70 max-w-3xl mx-auto">
						{copy.heroDescription}
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<a
							className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-lg shadow-cyan-400/40 hover:bg-cyan-300"
							href="/">
							{copy.demoButton}
						</a>
						<a
							className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/80 hover:border-white/70"
							href="https://github.com"
							target="_blank"
							rel="noreferrer">
							{copy.sourceButton}
						</a>
					</div>
				</section>

				<section className="grid gap-6 md:grid-cols-3">
					{copy.quickStarts.map((item) => (
						<div
							key={item.title}
							className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
							<div
								className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent}`}
							/>
							<div className="relative space-y-3">
								<div className="text-3xl">{item.icon}</div>
								<h3 className="text-xl font-semibold">
									{item.title}
								</h3>
								<p className="text-sm text-white/70">
									{item.desc}
								</p>
							</div>
						</div>
					))}
				</section>

				<section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
						<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
							{copy.guideHeading}
						</p>
						<h2 className="mt-3 text-2xl font-semibold">
							{copy.guideSubHeading}
						</h2>
						<div className="mt-6 space-y-6">
							{copy.guides.map((guide) => (
								<div
									key={guide.label}
									className="rounded-2xl border border-white/10 bg-white/5 p-4">
									<p className="text-sm uppercase tracking-[0.3em] text-white/50">
										{guide.label}
									</p>
									<p className="mt-2 text-base text-white/80">
										{guide.content}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
							{copy.contributionHeading}
						</p>
						<ol className="mt-4 space-y-5">
							{copy.contributionSteps.map((entry, index) => (
								<li
									key={entry.step}
									className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
									<div className="mt-1 h-10 w-10 rounded-2xl bg-white/10 text-center text-lg font-bold leading-[2.5rem] text-cyan-300">
										{index + 1}
									</div>
									<div>
										<p className="text-sm uppercase tracking-[0.4em] text-white/50">
											{entry.step}
										</p>
										<p className="text-base text-white">
											{entry.desc}
										</p>
									</div>
								</li>
							))}
						</ol>
					</div>
				</section>
			</div>
		</DefaultLayout>
	);
}
