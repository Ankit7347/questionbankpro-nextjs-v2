"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Edit, Shield } from "lucide-react";
import Image from "next/image";

const profileNavLinks = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Edit Profile", href: "/dashboard/profile/edit", icon: Edit },
  { name: "Security", href: "/dashboard/profile/security", icon: Shield },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center space-x-5 mb-8">
          <div className="relative h-20 w-20">
            <Image
                className="rounded-full object-cover"
                src={'/student.svg'}
                alt="User avatar"
                fill
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {session?.user?.name}
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {session?.user?.email}
            </p>
          </div>
        </div>

        {/* Navigation and Content */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {profileNavLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    ${
                      pathname === item.href
                        ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                    group rounded-md px-3 py-2 flex items-center text-sm font-medium transition-colors
                  `}
                >
                  <item.icon
                    className={`
                      ${
                        pathname === item.href
                          ? "text-blue-500 dark:text-blue-400"
                          : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                      }
                      flex-shrink-0 -ml-1 mr-3 h-6 w-6 transition-colors
                    `}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              ))}
            </nav>
          </aside>

          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <div className="bg-white dark:bg-gray-800/50 shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}