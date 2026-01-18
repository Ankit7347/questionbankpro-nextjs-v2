import React from "react";

function CourseCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6 bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h2>
            <p className="text-gray-700 dark:text-gray-300">{description}</p>
        </div>
    );
}

export default function CoursesPage() {
    const courses = [
        {
            title: "React Basics",
            description: "Learn the fundamentals of React, including components, state, and props.",
        },
        {
            title: "TypeScript Essentials",
            description: "Master TypeScript to write safer and more robust JavaScript code.",
        },
        {
            title: "Next.js Advanced",
            description: "Dive into advanced Next.js features for building scalable web apps.",
        },
    ];

    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
            <h1 className="text-3xl font-bold mb-6">Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <CourseCard key={course.title} title={course.title} description={course.description} />
                ))}
            </div>
        </div>
    );
}
