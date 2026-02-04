"use client";

import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InputField = ({ label, id, type = "text", value, readOnly = false }: { label: string; id: string; type?: string; value: string | null | undefined; readOnly?: boolean }) => (
  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 dark:sm:border-gray-700 sm:pt-5">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2">
      {label}
    </label>
    <div className="mt-1 sm:mt-0 sm:col-span-2">
      <Input
        type={type}
        name={id}
        id={id}
        defaultValue={value || ''}
        readOnly={readOnly}
        className={`max-w-lg ${readOnly ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-600' : ''}`}
      />
    </div>
  </div>
);

export default function EditProfilePage() {
  const { data: session } = useSession();

  return (
    <form>
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Edit Profile
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Update your personal and academic information.
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          <InputField label="Full name" id="name" value={session?.user?.name} />
          <InputField label="Email address" id="email" type="email" value={session?.user?.email} readOnly />
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 dark:sm:border-gray-700 sm:pt-5">
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2">
              Current Class/Grade
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <Select>
                <SelectTrigger className="w-full max-w-lg sm:text-sm">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class-10">Class 10</SelectItem>
                  <SelectItem value="class-12">Class 12</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-right sm:px-6 rounded-b-lg">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
