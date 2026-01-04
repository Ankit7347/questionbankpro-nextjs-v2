// components/FriendlyError.tsx
import Link from "next/link";

interface FriendlyErrorProps {
  title?: string;
  description?: string;
}

export default function FriendlyError({
  title = "Page Not Found",
  description = "Oops! The page you're looking for doesn't exist.",
}: FriendlyErrorProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div
        className="
          w-full max-w-lg text-center rounded-xl border
          bg-gradient-to-br from-blue-50 to-green-100
          dark:from-gray-900 dark:to-black
          border-gray-200 dark:border-gray-800
          p-8
        "
      >
        <h1 className="text-6xl font-extrabold text-green-600 dark:text-green-400">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h2>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {description}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="
              inline-flex justify-center items-center
              bg-green-600 text-white px-6 py-2 rounded-md
              hover:bg-green-700 transition shadow
              dark:bg-green-500 dark:hover:bg-green-600
            "
          >
            Go to Home
          </Link>

          <Link
            href="/contact"
            className="
              inline-flex justify-center items-center
              border border-gray-300 dark:border-gray-700
              px-6 py-2 rounded-md text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800 transition
            "
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
