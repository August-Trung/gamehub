import DefaultLayout from "@/layouts/default";
import { useLanguage } from "@/contexts/LanguageContext";

const BLOG_COPY = {
	vi: {
		heroEyebrow: "Blog Studio",
		heroTitle: "Kể chuyện làm game indie tiếng Việt",
		heroDescription:
			"Nơi lưu lại mọi thứ: devlog, design system, cộng đồng và cả những cú fail. Đọc nhanh để theo kịp hành trình Game Hub AT.",
		categories: ["Devlog", "Thiết kế", "Community", "Product update"],
		followButton: "Theo dõi cập nhật",
		questionButton: "Gửi câu hỏi",
		hotLabel: "Tin nóng",
		hotTitle: "Roadmap Q2/2025: tích hợp leaderboard real-time",
		hotDescription:
			"Mình đang thử Supabase + WebSocket để tạo bảng điểm trực tiếp giữa người chơi, đồng thời mở giải đấu mini cuối tuần. Release note dự kiến cuối tháng 6.",
		hotMeta: ["Devlog", "11/05/2025", "7 phút đọc"],
		posts: [
			{
				title: "Hậu trường dựng UI neon cho Game Hub AT",
				summary:
					"Chia sẻ cách mình kết hợp Tailwind + Framer Motion để giữ FPS cao mà vẫn 'cháy' thị giác.",
				tag: "Thiết kế",
				date: "18/04/2025",
				readingTime: "6 phút",
			},
			{
				title: "Tối ưu input cho mini-game đa nền tảng",
				summary:
					"Từ bàn phím, chuột đến cảm ứng: unify event thế nào để không delay thao tác.",
				tag: "Devlog",
				date: "02/04/2025",
				readingTime: "8 phút",
			},
			{
				title: "Checklist QA trước khi push game mới",
				summary:
					"Danh sách nhỏ giúp tự test logic, accessibility và cảm giác chơi.",
				tag: "Quy trình",
				date: "21/03/2025",
				readingTime: "4 phút",
			},
		],
		newsletter: {
			title: "Bản tin nhanh",
			subtitle: "Đăng ký newsletter 5 phút",
			description: "Mình gửi email 2 lần/tháng, không spam.",
			placeholder: "email của bạn",
			button: "Đăng ký",
			benefits: [
				"Nhận roadmap & changelog gọn trong 5 phút đọc.",
				"Early access mini-game mới để bạn test trước.",
				"Bộ wallpaper/artwork độc quyền mỗi tháng một lần.",
			],
		},
		community: {
			title: "Community highlight",
			items: [
				{
					title: "Cộng đồng Discord chạm mốc 300 thành viên",
					desc: "Đang mở chuyên mục #playtest để mọi người drop feedback nhanh.",
				},
				{
					title: "Mini-game Sudoku nhận 20 PR cải tiến",
					desc: "Cảm ơn mọi người đã giúp fix UI mobile và thêm dark mode matrix.",
				},
			],
			button: "Tham gia Discord",
		},
		readButton: "Đọc bài viết",
	},
	en: {
		heroEyebrow: "Blog Studio",
		heroTitle: "Stories from building Vietnamese indie games",
		heroDescription:
			"Devlogs, design systems, community experiments, and even the fails—read fast to keep up with Game Hub AT.",
		categories: ["Devlog", "Design", "Community", "Product update"],
		followButton: "Follow updates",
		questionButton: "Ask a question",
		hotLabel: "Hot drop",
		hotTitle: "Q2/2025 roadmap: realtime leaderboard rollout",
		hotDescription:
			"I'm testing Supabase + WebSocket for live scoreboards and mini weekend tournaments. Release notes drop at the end of June.",
		hotMeta: ["Devlog", "May 11 2025", "7 min read"],
		posts: [
			{
				title: "Behind the neon UI facelift",
				summary:
					"How Tailwind + Framer Motion keep FPS high while the visuals stay spicy.",
				tag: "Design",
				date: "Apr 18 2025",
				readingTime: "6 min",
			},
			{
				title: "Input handling across devices",
				summary:
					"Keyboard, mouse, touch—sharing one event layer without lag.",
				tag: "Devlog",
				date: "Apr 02 2025",
				readingTime: "8 min",
			},
			{
				title: "QA checklist before shipping a game",
				summary:
					"A tiny list to self-test logic, accessibility, and feel.",
				tag: "Process",
				date: "Mar 21 2025",
				readingTime: "4 min",
			},
		],
		newsletter: {
			title: "Quick newsletter",
			subtitle: "Subscribe in five minutes",
			description: "Two emails per month—no spam.",
			placeholder: "your email",
			button: "Subscribe",
			benefits: [
				"Roadmap + changelog digest in under five minutes.",
				"Early access builds so you can test first.",
				"Exclusive wallpapers/artwork once a month.",
			],
		},
		community: {
			title: "Community highlight",
			items: [
				{
					title: "Discord community hits 300 members",
					desc: "New #playtest channel is live for instant feedback drops.",
				},
				{
					title: "Sudoku mini-game got 20 PR improvements",
					desc: "Thanks for fixing mobile UI and adding the matrix dark mode!",
				},
			],
			button: "Join Discord",
		},
		readButton: "Read article",
	},
} as const;

export default function BlogPage() {
	const { language } = useLanguage();
	const copy = BLOG_COPY[language];

	return (
		<DefaultLayout>
			<div className="space-y-12 text-white">
				<section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/40 to-cyan-500/10 p-8 md:p-10">
					<p className="text-xs uppercase tracking-[0.5em] text-cyan-200">
						{copy.heroEyebrow}
					</p>
					<div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end">
						<div className="flex-1 space-y-4">
							<h1 className="text-4xl font-bold leading-tight">
								{copy.heroTitle}
							</h1>
							<p className="text-lg text-white/70">
								{copy.heroDescription}
							</p>
							<div className="flex flex-wrap gap-3">
								{copy.categories.map((category) => (
									<span
										key={category}
										className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-[0.4em] text-white/70">
										{category}
									</span>
								))}
							</div>
						</div>
						<div className="flex gap-3">
							<button className="rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-slate-900 hover:bg-cyan-50">
								{copy.followButton}
							</button>
							<button className="rounded-full border border-white/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white/70 hover:border-white/60">
								{copy.questionButton}
							</button>
						</div>
					</div>
				</section>

				<section className="grid gap-6 md:grid-cols-2">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:col-span-2">
						<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
							{copy.hotLabel}
						</p>
						<h2 className="mt-3 text-2xl font-semibold">
							{copy.hotTitle}
						</h2>
						<p className="mt-4 text-white/70">{copy.hotDescription}</p>
						<div className="mt-6 flex flex-wrap gap-3 text-sm text-white/60">
							{copy.hotMeta.map((meta) => (
								<span
									key={meta}
									className="rounded-full border border-white/20 px-4 py-1">
									{meta}
								</span>
							))}
						</div>
					</div>

					{copy.posts.map((post) => (
						<article
							key={post.title}
							className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
							<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
								{post.tag}
							</p>
							<h3 className="mt-3 text-2xl font-semibold">
								{post.title}
							</h3>
							<p className="mt-3 text-sm text-white/70">
								{post.summary}
							</p>
							<div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
								<span>{post.date}</span>
								<span>{post.readingTime}</span>
							</div>
							<button className="mt-6 w-full rounded-2xl bg-white/10 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:bg-white/80 hover:text-slate-900">
								{copy.readButton}
							</button>
						</article>
					))}
				</section>

				<section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
							{copy.newsletter.title}
						</p>
						<h2 className="mt-3 text-2xl font-semibold">
							{copy.newsletter.subtitle}
						</h2>
						<p className="mt-2 text-sm text-white/70">
							{copy.newsletter.description}
						</p>
						<ul className="mt-4 space-y-3 text-sm text-white/80">
							{copy.newsletter.benefits.map((benefit) => (
								<li key={benefit} className="flex items-start gap-2">
									<span className="text-cyan-300">•</span>
									<span>{benefit}</span>
								</li>
							))}
						</ul>
						<div className="mt-5 flex flex-col gap-3 sm:flex-row">
							<input
								type="email"
								placeholder={copy.newsletter.placeholder}
								className="flex-1 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm placeholder:text-white/40 focus:border-cyan-300 focus:outline-none"
							/>
							<button className="rounded-2xl bg-cyan-400 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-slate-900 hover:bg-cyan-300">
								{copy.newsletter.button}
							</button>
						</div>
					</div>

					<div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
						<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
							{copy.community.title}
						</p>
						<div className="mt-4 space-y-4">
							{copy.community.items.map((item) => (
								<div
									key={item.title}
									className="rounded-2xl border border-white/10 bg-white/5 p-4">
									<p className="text-base font-semibold">
										{item.title}
									</p>
									<p className="mt-2 text-sm text-white/70">
										{item.desc}
									</p>
								</div>
							))}
						</div>
						<button className="mt-5 w-full rounded-2xl border border-white/15 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white hover:border-white">
							{copy.community.button}
						</button>
					</div>
				</section>
			</div>
		</DefaultLayout>
	);
}
