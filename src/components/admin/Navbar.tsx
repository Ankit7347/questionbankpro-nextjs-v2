// File: components/admin/Navbar.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { Menu } from 'lucide-react';

type NavbarProps = {
	onToggleSidebar?: () => void;
};

export default function Navbar({ onToggleSidebar }: NavbarProps) {
	const { data: session } = useSession();

	return (
		<header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
			<div className="flex items-center gap-4">
				{/* Hamburger menu on mobile */}
				<button onClick={onToggleSidebar} className="md:hidden">
					<Menu className="w-6 h-6 text-gray-800" />
				</button>
				<h1 className="text-lg font-bold">Admin Panel</h1>
			</div>

			<div className="flex items-center space-x-4">
				{session?.user && (
					<p className="text-sm text-gray-600">
						{session.user.name} ({session.user.role})
					</p>
				)}
				<button
					onClick={() => signOut()}
					className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
				>
					Logout
				</button>
			</div>
		</header>
	);
}
