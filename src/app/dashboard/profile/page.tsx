"use client";
import { useSession } from "next-auth/react";

const DetailItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="mx-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
      {value || "Not set"}
    </dd>
  </div>
);

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          User Profile
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Your personal and academic information.
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          <DetailItem label="Full name" value={session?.user?.name} />
          <DetailItem label="Email address" value={session?.user?.email} />
          <DetailItem label="Role" value="Student" />
          <DetailItem label="Current Class/Grade" value="Class 12" />
          <DetailItem label="Board/University" value="CBSE" />
          <DetailItem label="Stream/Major" value="Science (PCM)" />
          <DetailItem label="Quizzes Attempted" value="42" />
          <DetailItem label="Average Score" value="88%" />
        </dl>
      </div>
    </div>
  );
}
