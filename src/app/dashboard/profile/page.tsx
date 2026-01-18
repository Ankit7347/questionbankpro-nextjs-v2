'use client';
import React, { useState } from 'react';

type Course = {
  id: number;
  title: string;
  description: string;
};

type Profile = {
  name: string;
  email: string;
  bio: string;
  courses: Course[];
};

const mockProfile: Profile = {
  name: 'Name',
  email: 'test@example.com',
  bio: 'Passionate learner and educator.',
  courses: [
    { id: 1, title: 'React Basics', description: 'Learn the basics of React.' },
    { id: 2, title: 'TypeScript Advanced', description: 'Deep dive into TypeScript.' },
  ],
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(mockProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  const handleEdit = () => {
    setForm(profile);
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfile(form);
    setEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Profile</h1>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow mb-8 text-gray-800 dark:text-gray-100">
        {editing ? (
          <>
            <div className="mb-4">
              <label className="block font-medium mb-1">Name:</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Email:</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Bio:</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <p className="mb-2">
              <strong>Name:</strong> {profile.name}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {profile.email}
            </p>
            <p className="mb-4">
              <strong>Bio:</strong> {profile.bio}
            </p>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">My Courses</h2>
        <ul className="space-y-4">
          {profile.courses.map((course) => (
            <li key={course.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow text-gray-900 dark:text-gray-100">
              <strong className="block">{course.title}</strong>
              <p className="mt-1 text-sm">{course.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
