"use client";

import { Input } from "@/components/ui/input";

const SecurityInputField = ({ label, id, type = "password" }: { label: string; id: string; type?: string; }) => (
  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start py-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2">
      {label}
    </label>
    <div className="mt-1 sm:mt-0 sm:col-span-2">
      <Input
        type={type}
        name={id}
        id={id}
        required
        className="max-w-lg"
      />
    </div>
  </div>
);

export default function SecurityPage() {
  return (
    <form>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Security
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Manage your password and account security.
          </p>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-0 divide-y divide-gray-200 dark:divide-gray-700">
            <SecurityInputField label="Current password" id="current-password" />
            <SecurityInputField label="New password" id="new-password" />
            <SecurityInputField label="Confirm new password" id="confirm-password" />
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-right sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Password
          </button>
        </div>
      </div>
    </form>
  );
}
