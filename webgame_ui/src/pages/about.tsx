import DefaultLayout from "@/layouts/default";
import { useLanguage } from "@/contexts/LanguageContext";

const ABOUT_COPY = {
	vi: {
		eyebrow: "Giới thiệu",
		title: "Game Hub AT là sân chơi indie nhỏ nhưng cháy",
		description:
			"Mình tạo hub này để gom những mini-game tự phát của cộng đồng dev Việt. Không quảng cáo, không paywall — chỉ cần trình duyệt và tinh thần thử nghiệm.",
		primaryCta: "Tham gia Discord",
		secondaryCta: "Gửi góp ý",
		missionTitle: "Sứ mệnh",
		missionText:
			"Khi game web Việt được chăm chút đủ, người chơi sẽ ở lại lâu hơn với nội dung bản địa. Game Hub đặt mục tiêu trở thành “phòng thí nghiệm” nơi mọi người thử ý tưởng lạ, cơ chế mới, hoặc đưa giáo dục vào trò chơi.",
		values: [
			{
				label: "Tôn trọng văn hoá Việt",
				desc: "Ưu tiên trò chơi dân gian, câu chữ thuần Việt và meme quốc dân.",
			},
			{
				label: "Xây nhanh – tinh gọn",
				desc: "Prototype liên tục, lắng nghe người chơi rồi chỉnh ngay tuần sau.",
			},
			{
				label: "Chia sẻ mở",
				desc: "Mã nguồn public, khuyến khích mọi người fork, remix, đóng góp.",
			},
		],
		profileTitle: "Hồ sơ cá nhân",
		profileText:
			"Tôi là AT — ban ngày làm việc với React/Node, ban đêm học cách kể chuyện bằng UI và nhạc synthwave. Game Hub là dự án cá nhân nhưng luôn mở cửa cho cộng đồng chung tay.",
		milestonesTitle: "Cột mốc",
		milestones: [
			{ year: "2023", text: "Khởi động với vài mini-game học thuật đơn giản." },
			{
				year: "2024",
				text: "Tái thiết kế giao diện neon, kết nối hơn 1.000 người chơi thử.",
			},
			{
				year: "2025",
				text: "Ra mắt Game Hub AT public beta, chuẩn bị leaderboard & event tuần.",
			},
		],
		teamTitle: "Đội ngũ",
		team: [
			{
				name: "AT",
				role: "Founding Dev / UI Composer",
				desc: "Code chính, dựng UI, viết nhạc nền và quản lý cộng đồng Discord.",
			},
			{
				name: "Bạn?",
				role: "Contributor tương lai",
				desc: "Chỉ cần mê game web, biết code hoặc kể chuyện là đã có vị trí.",
			},
		],
		contactTitle: "Liên hệ",
		contactLinks: [
			{ label: "hello@gamehub.dev", hint: "Email phản hồi & hợp tác" },
			{ label: "@gamehub.at", hint: "Instagram khoảnh khắc UI đẹp" },
			{ label: "discord.gg/gamehub", hint: "Phòng #build-in-public" },
		],
		contactButton: "Book lịch trò chuyện 15 phút",
	},
	en: {
		eyebrow: "About",
		title: "Game Hub AT is a tiny but fiery indie playground",
		description:
			"I built this hub to gather mini-games crafted by the Vietnamese dev community. No ads, no paywall—just a browser and curiosity.",
		primaryCta: "Join Discord",
		secondaryCta: "Send feedback",
		missionTitle: "Mission",
		missionText:
			"When Vietnamese web games get proper care, players stay longer with local content. Game Hub aims to be a “lab” for experimenting with mechanics, culture, and even education.",
		values: [
			{
				label: "Celebrate local culture",
				desc: "Bring folk games, Vietnamese copy, and local memes into the product.",
			},
			{
				label: "Build fast & lean",
				desc: "Prototype constantly, listen to players, iterate the next week.",
			},
			{
				label: "Share openly",
				desc: "Open-source code inviting folks to fork, remix, and contribute ideas.",
			},
		],
		profileTitle: "Profile",
		profileText:
			"I'm AT — React/Node engineer by day, synthwave storyteller by night. Game Hub is a personal project, but the doors are wide open for community collabs.",
		milestonesTitle: "Milestones",
		milestones: [
			{ year: "2023", text: "Started with a couple of educational mini-games." },
			{
				year: "2024",
				text: "Redesigned the neon UI and reached 1,000 playtesters.",
			},
			{
				year: "2025",
				text: "Launched Game Hub AT public beta and prepared weekly events.",
			},
		],
		teamTitle: "Team",
		team: [
			{
				name: "AT",
				role: "Founding Dev / UI Composer",
				desc: "Codes, designs, scores the music, and moderates Discord.",
			},
			{
				name: "You?",
				role: "Future contributor",
				desc: "If you love web games and can code or write, there’s a spot.",
			},
		],
		contactTitle: "Contact",
		contactLinks: [
			{ label: "hello@gamehub.dev", hint: "Feedback & collaboration email" },
			{ label: "@gamehub.at", hint: "Instagram snapshots of pretty UI" },
			{ label: "discord.gg/gamehub", hint: "Join the #build-in-public room" },
		],
		contactButton: "Book a 15-minute chat",
	},
} as const;

export default function AboutPage() {
	const { language } = useLanguage();
	const copy = ABOUT_COPY[language];

	return (
		<DefaultLayout>
			<div className="space-y-12 text-white">
				<section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="space-y-5">
						<p className="text-xs uppercase tracking-[0.5em] text-cyan-200">
							{copy.eyebrow}
						</p>
						<h1 className="text-4xl font-bold leading-tight">
							{copy.title}
						</h1>
						<p className="text-lg text-white/70">{copy.description}</p>
						<div className="flex gap-4">
							<button className="rounded-full bg-cyan-400 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-slate-950 hover:bg-cyan-300">
								{copy.primaryCta}
							</button>
							<button className="rounded-full border border-white/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white/70 hover:border-white/60">
								{copy.secondaryCta}
							</button>
						</div>
					</div>
					<div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/40 to-white/5 p-6">
						<p className="text-sm uppercase tracking-[0.3em] text-white/60">
							{copy.missionTitle}
						</p>
						<p className="mt-3 text-2xl font-semibold">{copy.missionText}</p>
					</div>
				</section>

				<section className="grid gap-6 md:grid-cols-3">
					{copy.values.map((value) => (
						<div
							key={value.label}
							className="rounded-3xl border border-white/10 bg-white/5 p-6">
							<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
								{language === "vi" ? "Giá trị" : "Values"}
							</p>
							<h3 className="mt-3 text-xl font-semibold">
								{value.label}
							</h3>
							<p className="mt-2 text-sm text-white/70">{value.desc}</p>
						</div>
					))}
				</section>

				<section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
					<div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
						<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
							{copy.profileTitle}
						</p>
						<p className="mt-3 text-2xl font-semibold">{copy.profileText}</p>
					</div>
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
							{copy.milestonesTitle}
						</p>
						<ul className="mt-4 space-y-5">
							{copy.milestones.map((item) => (
								<li
									key={item.year}
									className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4">
									<div className="text-lg font-semibold text-cyan-300">
										{item.year}
									</div>
									<p className="text-white/80">{item.text}</p>
								</li>
							))}
						</ul>
					</div>
				</section>

				<section className="grid gap-6 md:grid-cols-2">
					{copy.team.map((member) => (
						<div
							key={member.name}
							className="rounded-3xl border border-white/10 bg-white/5 p-6">
							<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
								{copy.teamTitle}
							</p>
							<h3 className="mt-3 text-2xl font-semibold">
								{member.name}
							</h3>
							<p className="text-sm uppercase tracking-[0.3em] text-white/50">
								{member.role}
							</p>
							<p className="mt-3 text-sm text-white/70">{member.desc}</p>
						</div>
					))}
				</section>

				<section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
					<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
						{copy.contactTitle}
					</p>
					<div className="mt-4 grid gap-4 md:grid-cols-3">
						{copy.contactLinks.map((link) => (
							<div
								key={link.label}
								className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
								<p className="font-semibold">{link.label}</p>
								<p className="text-white/60">{link.hint}</p>
							</div>
						))}
					</div>
					<button className="mt-6 w-full rounded-full border border-white/20 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white hover:border-white">
						{copy.contactButton}
					</button>
				</section>
			</div>
		</DefaultLayout>
	);
}
