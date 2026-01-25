/**
 * Path: /admin/dashboard
 * Role:
 * - Entry point for Admin Control Panel
 * - Navigation-only page
 * - NO data fetching
 * - NO business logic
 */
import Link from "next/link";

const adminSections = [
  {
    title: "Exam Management",
    description: "Create & manage Exams and SubExams",
    href: "/admin/exams",
  },
  {
    title: "Syllabus Management",
    description: "Subjects, Chapters, Topics (Official Syllabus)",
    href: "/admin/syllabus",
  },
  {
    title: "Syllabus Mapping",
    description: "SubjectMap, ChapterMap, TopicMap",
    href: "/admin/mappings",
  },
  {
    title: "Course Management",
    description: "Commercial courses mapped to SubExams",
    href: "/admin/courses",
  },
  {
    title: "Coupons & Access",
    description: "Coupons, validity, enrollment rules",
    href: "/admin/coupons",
  },
  {
    title: "Question Bank",
    description: "Questions, quizzes, submissions (later phase)",
    href: "/admin/questions",
  },
  {
    title: "Users & Roles",
    description: "Admins, students, permissions",
    href: "/admin/users",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="border rounded-lg p-5 hover:shadow-md transition bg-white"
          >
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

