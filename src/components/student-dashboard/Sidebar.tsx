'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
	X, LayoutDashboard, BookOpen, NotebookPen, 
	FileText, Brain, ClipboardList, FileCheck, 
	User, Settings 
} from 'lucide-react'; // ✅ Lucide icons

// 🔧 Sidebar Links with Icons
const links = [
	{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/dashboard/courses', label: 'Courses', icon: BookOpen },
	{ href: '/dashboard/notes', label: 'Notes', icon: NotebookPen },
	{ href: '/dashboard/previous-papers', label: 'Previous-Year-Paper', icon: FileText },
	{ href: '/dashboard/quiz', label: 'Quiz', icon: Brain },
	{ href: '/dashboard/solved-papers', label: 'Solved-Paper', icon: ClipboardList },
	{ href: '/dashboard/syllabus', label: 'Syllabus', icon: FileCheck },
	{ href: '/dashboard/profile', label: 'Profile', icon: User },
	{ href: '/dashboard/settings', label: 'Settings', icon: Settings }
];

type SidebarProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
	const pathname = usePathname();

	return (
		<>
			{/* Overlay for mobile */}
			<div
				className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity md:hidden ${
					isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
				}`}
				onClick={onClose}
			/>

			{/* Sidebar container */}
			<aside className={`fixed z-40 top-0 left-0 h-full w-64 bg-gray-100 dark:bg-black shadow transition-transform transform md:translate-x-0 md:relative md:z-0 md:block md:h-screen ${
				isOpen ? 'translate-x-0' : '-translate-x-full'
			}`}>
				<div className="p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700 md:hidden">
					<h2 className="text-lg font-bold text-gray-800 dark:text-white">Menu</h2>
					<button onClick={onClose}>
						<X className="w-6 h-6 text-gray-800 dark:text-white" />
					</button>
				</div>
				<div className="p-4 space-y-2">
					{links.map(({ href, label, icon: Icon }) => (
						<Link key={href} href={href}>
							<span
								className={`flex items-center gap-2 p-2 m-2 rounded cursor-pointer 
									hover:bg-gray-300 dark:hover:bg-gray-700 
									text-gray-800 dark:text-gray-100 
									${pathname === href ? 'bg-gray-300 dark:bg-gray-700 font-semibold' : ''}`}
								onClick={onClose}
							>
								<Icon className="w-5 h-5" />
								{label}
							</span>
						</Link>
					))}
				</div>
			</aside>
		</>
	);
}
