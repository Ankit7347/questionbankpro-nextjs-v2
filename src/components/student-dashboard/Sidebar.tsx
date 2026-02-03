'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
	X, LayoutDashboard, BookOpen, NotebookPen,
	FileText, Brain, ClipboardList, FileCheck,
	User, Settings
} from 'lucide-react';

type SidebarProps = {
	isOpen: boolean;       // mobile/tablet toggle
	onClose: () => void;   // close for mobile/tablet
};

/* -------------------------------------------
   SECTIONED NAVIGATION STRUCTURE
-------------------------------------------- */

const sections = [
	{
		title: "General",
		items: [
			{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
			{ href: '/dashboard/courses', label: 'Courses', icon: BookOpen },
		]
	},
	{
		title: "Study Tools",
		items: [
			{ href: '/dashboard/notes', label: 'Notes', icon: NotebookPen },
			{ href: '/dashboard/previous-papers', label: 'Previous-Year-Paper', icon: FileText },
			{ href: '/dashboard/quiz', label: 'Quiz', icon: Brain },
			{ href: '/dashboard/solved-papers', label: 'Solved-Paper', icon: ClipboardList },
			{ href: '/dashboard/syllabus', label: 'Syllabus', icon: FileCheck },
		]
	},
	{
		title: "Account",
		items: [
			{ href: '/dashboard/profile', label: 'Profile', icon: User },
			{ href: '/dashboard/settings', label: 'Settings', icon: Settings },
		]
	}
];

/* -------------------------------------------
   FINAL SIDEBAR COMPONENT
-------------------------------------------- */

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
	const pathname = usePathname();

	return (
		<>
			{/* Overlay on mobile & tablet only */}
			<div className={`fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={onClose} />

			{/* SIDEBAR */}
			<aside className={`fixed top-0 left-0 z-40 h-full w-64 backdrop-blur-xl bg-white/40 dark:bg-[#0A1224]/40 border-r border-white/20 dark:border-white/10 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:block`}>

				{/* Mobile header */}
				<div className="md:hidden p-4 flex justify-between items-center border-b border-white/20 dark:border-white/10">
					<h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Menu</h2>
					<button onClick={onClose}>
						<X className="w-6 h-6 text-gray-800 dark:text-gray-100" />
					</button>
				</div>

				{/* SECTIONS */}
				<div className="p-4 space-y-6">

					{sections.map(section => (
						<div key={section.title}>
							{/* Section Label */}
							<p className="uppercase text-[11px] font-semibold tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">
								{section.title}
							</p>

							{/* Section items */}
							{section.items.map(({ href, label, icon: Icon }) => {
								const active = pathname === href;

								return (
									<Link key={href} href={href}>
										<span
											onClick={onClose}
											className={`relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 text-gray-800 dark:text-gray-200 ${active ? "bg-blue-100/40 dark:bg-blue-900/30 font-semibold": "hover:bg-blue-50/40 dark:hover:bg-blue-800/20"}`}
										>

											{/* Animated Left Active Bar */}
											{active && (
												<span className="absolute left-0 top-0 h-full w-1 bg-blue-600 dark:bg-blue-400 rounded-r transition-all"></span>
											)}

											{/* Gradient Icon */}
											<Icon
												className={`w-5 h-5 text-transparent bg-clip-text ${active ? "bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-300 dark:to-purple-400": "bg-gradient-to-br from-gray-500 to-gray-600 dark:from-gray-400 dark:to-gray-500"}`}
											/>

											{label}
										</span>
									</Link>
								);
							})}
						</div>
					))}

				</div>
			</aside>
		</>
	);
}
