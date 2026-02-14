"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status, router]);

	if (status === "loading") {
		return (
			<div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-gray-900">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
				<p className="text-gray-500 animate-pulse">Loading your dashboard...</p>
			</div>
		);
	}

	return (
		<div className="bg-gray-50 dark:bg-gray-950 px-4 py-10 md:px-10">
			{/* Header Section */}
			<div className="max-w-6xl mx-auto mb-10 text-left">
				<h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
					Welcome back,{" "}
					<Link
						href="/dashboard/profile"
						className="text-blue-600 hover:text-blue-700 hover:underline decoration-2 underline-offset-4 transition-all"
					>
						{session?.user?.name || "Student"}
					</Link>
					!
				</h1>
				<p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
					What would you like to study today?
				</p>
			</div>

			{/* Features Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
				{features.map((feature) => (
					<Link
						key={feature.href}
						href={feature.href}
						className="group bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
					>
						<div className={`p-3 rounded-lg inline-block mb-4 bg-gray-50 dark:bg-gray-700/50 ${feature.color}`}>
							<feature.icon size={28} />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
							{feature.title}
						</h2>
						<p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
							{feature.desc}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
}
