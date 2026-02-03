'use client';

import { useSession, signOut } from 'next-auth/react';
import { Menu } from 'lucide-react';
import { FiLogOut } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

type NavbarProps = {
	onToggleSidebar?: () => void;
};

export default function Navbar({ onToggleSidebar }: NavbarProps) {
	const { data: session } = useSession();
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<header className="sticky top-0 z-[60] flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
			<div className="flex items-center gap-4">
				{/* Hamburger menu on mobile */}
				<button onClick={onToggleSidebar} className="md:hidden">
					<Menu className="w-6 h-6 text-gray-800 dark:text-white" />
				</button>
				<h1 className="text-lg font-bold text-gray-800 dark:text-white">Student Dashboard</h1>
			</div>

			<div className="relative" ref={menuRef}>
				{/* 👤 Profile Icon */}
				<button
					onClick={() => setMenuOpen((prev) => !prev)}
					className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
					title="User menu"
				>
					<FaUserCircle className="w-6 h-6" />
				</button>

				{/* Dropdown menu */}
				{menuOpen && (
					<div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded shadow-md z-50 dark:bg-gray-800 dark:border-gray-700">
						<div className="p-3 text-sm text-gray-800 dark:text-gray-200">
							<p className="font-medium">{session?.user?.name || 'User'}</p>
							{/* <p className="text-gray-500 truncate dark:text-gray-400">
								{session?.user?.email}
							</p> */}
							<Link
								href="/dashboard"
								onClick={() => setMenuOpen(false)}
								className="block mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
							>
								Go to Dashboard
							</Link>
							<button
								onClick={() => {
									setMenuOpen(false);
									signOut();
								}}
								className="flex items-center gap-2 text-red-500 mt-3 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 w-full"
							>
								<FiLogOut /> Logout
							</button>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
