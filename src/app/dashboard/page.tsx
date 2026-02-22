"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	BookOpen,
	FileText,
	CheckSquare,
	Layout,
	ClipboardList,
	GraduationCap,
	Settings,
	Clock,
	Bookmark,
} from "lucide-react";
import {
	Card,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

// Added icons to the features array
const features = [
	{ title: "Courses", href: "/dashboard/courses", desc: "Browse and enroll in helpful courses", icon: GraduationCap, color: "text-blue-500" },
	{ title: "Previous Year Papers", href: "/dashboard/previous-papers", desc: "Access board-wise past papers", icon: FileText, color: "text-purple-500" },
	{ title: "Solved Papers", href: "/dashboard/solved-papers", desc: "View solved papers with detailed answers", icon: CheckSquare, color: "text-green-500" },
	{ title: "Quizzes", href: "/dashboard/quiz", desc: "Practice topic-based MCQs and mock tests", icon: ClipboardList, color: "text-orange-500" },
	{ title: "Notes", href: "/dashboard/notes", desc: "Get concise notes for quick revision", icon: BookOpen, color: "text-red-500" },
	{ title: "Syllabus", href: "/dashboard/syllabus", desc: "Explore official board syllabus", icon: Layout, color: "text-cyan-500" },
	{ title: "Bookmarks", href: "/dashboard/bookmarks", desc: "View your saved topics and materials", icon: Bookmark, color: "text-pink-500" },
	{ title: "History", href: "/dashboard/history", desc: "See what you have viewed recently", icon: Clock, color: "text-yellow-500" },
	{ title: "Performance", href: "/dashboard/performance", desc: "Check your quiz scores and trends", icon: CheckSquare, color: "text-indigo-500" },
	{ title: "Settings", href: "/dashboard/settings", desc: "Manage your account preferences", icon: Settings, color: "text-gray-500" },
];

export default function DashboardPage() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (
			<div className="px-4 py-10 md:px-10 max-w-8xl mx-auto">
				{/* Header Skeleton */}
				<div className="mb-10 rounded-2xl p-6 md:p-8 bg-gradient-to-br from-emerald-400/40 to-green-500/40 animate-pulse">
					<div className="space-y-4 max-w-xl">
						<div className="h-3 w-1/4 bg-white/50 rounded" />
						<div className="h-8 w-2/3 bg-white/60 rounded" />
						<div className="h-4 w-1/2 bg-white/50 rounded" />
					</div>
				</div>

				{/* Feature Cards Skeleton Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					{Array.from({ length: 10 }).map((_, i) => (
						<div key={i} className="rounded-xl border p-6 animate-pulse bg-gray-100 dark:bg-gray-800 flex flex-col justify-between">
							<div className="flex flex-col items-center space-y-3">
								<div className="w-12 aspect-square rounded-lg bg-gray-300 dark:bg-gray-700" />
								<div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
							</div>

							<div className="mt-6 space-y-2">
								<div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded" />
								<div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="md:px-10 max-w-8xl mx-auto">
			{/* Header Section */}
			<div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/70 to-green-600/70 backdrop-blur-xl border border-white/20 p-6 md:p-8 shadow-xl">

				{/* Glass highlight overlay */}
				<div className="absolute inset-0 bg-white/10 backdrop-blur-2xl" />

				<div className="relative z-10 max-w-2xl">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/20 text-white text-xs font-medium mb-4">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-300 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-lime-400"></span>
						</span>
						Ready to learn
					</div>

					<h1 className="text-2xl md:text-4xl font-bold text-white leading-snug">
						Welcome back,{" "}
						<Link
							href="/dashboard/profile"
							className="text-lime-200 hover:text-white transition-colors underline decoration-white/40 underline-offset-4"
						>
							{session?.user?.name?.split(" ")[0] || "Student"}
						</Link>
						!
					</h1>

					<p className="mt-3 text-green-100 text-sm md:text-base max-w-lg">
						You've made progress this week. What’s your focus today?
					</p>

					<div className="mt-5">
						<div className="px-3 py-1.5 rounded-lg bg-white/15 border border-white/20 text-white text-xs backdrop-blur-sm inline-block">
							<span className="opacity-70">Current Goal:</span> Exam Prep 2026
						</div>
					</div>
				</div>
			</div>

			{/* Features Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
				{features.map((feature) => (
					<Link key={feature.href} href={feature.href} className="block h-full group" >
						<Card className="h-full flex flex-col p-4 text-center items-center justify-between transition-all duration-300 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 hover:-translate-y-1 min-h-[160px] md:min-h-[180px] bg-white dark:bg-slate-900">
							{/* Top Section: Icon and Title */}
							<div className="flex flex-col items-center w-full">
								<div className={`p-2.5 rounded-lg mb-3 bg-gray-50 dark:bg-slate-900 ${feature.color} group-hover:scale-110 transition-transform`}>
									<feature.icon size={24} />
								</div>
								<CardTitle className="text-sm md:text-base font-bold group-hover:text-blue-600 transition-colors line-clamp-1">
									{feature.title}
								</CardTitle>
							</div>

							{/* Bottom Section: Description */}
							<CardDescription className="text-[10px] md:text-xs mt-2 line-clamp-2 text-gray-500 dark:text-gray-400">
								{feature.desc}
							</CardDescription>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}