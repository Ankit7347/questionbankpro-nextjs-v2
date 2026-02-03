"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const features = [
	{ title: "Courses", href: "/dashboard/courses", desc: "Browse and enroll in helpful courses" },
	{ title: "Previous Year Papers", href: "/dashboard/previous-papers", desc: "Access board-wise past papers" },
	{ title: "Solved Papers", href: "/dashboard/solved-papers", desc: "View solved papers with detailed answers" },
	{ title: "Quizzes", href: "/dashboard/quiz", desc: "Practice topic-based MCQs and mock tests" },
	{ title: "Notes", href: "/dashboard/notes", desc: "Get concise notes for quick revision" },
	{ title: "Syllabus", href: "/dashboard/syllabus", desc: "Explore official board syllabus" },
];

export default function DashboardPage() {
	const { status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status, router]);

	if (status === "loading") {
		return <div className="flex justify-center items-center h-screen">Loading...</div>;
	}

	return (
		<div className="flex flex-col items-center px-4 py-10 bg-white dark:bg-gray-900">
			<h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
				Welcome to Dashboard
			</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
				{features.map((feature) => (
					<Link
						key={feature.href}
						href={feature.href}
						className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md hover:scale-[1.02] transition-all"
					>
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h2>
						<p className="text-gray-700 dark:text-gray-400">{feature.desc}</p>
					</Link>
				))}
			</div>
		</div>
	);
}
