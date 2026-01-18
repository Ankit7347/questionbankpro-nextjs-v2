// src/components/layout/Footer.tsx
import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from 'lucide-react';

// --- CONFIGURATION START ---
const COURSES = [
  {
    examSlug: "cbse-board",
    label: "School (CBSE)",
    courses: [{ name: "Class 6", slug: "class-6" }],
  },
  {
    examSlug: "engineering-entrance",
    label: "Engineering",
    courses: [{ name: "JEE Main", slug: "jee-main" }],
  },
  {
    examSlug: "medical-entrance",
    label: "Medical",
    courses: [{ name: "NEET UG", slug: "neet-ug" }],
  },
  {
    examSlug: "undergraduate-programs",
    // We can use the label as a heading or just list the courses
    label: "Degree Programs", 
    courses: [
        { name: "BTech", slug: "btech" },
        { name: "MBA", slug: "mba" },
        { name: "PGDM", slug: "pgdm" }
    ],
  },
  {
    examSlug: "gate-exam",
    label: "GATE Exam",
    courses: [{ name: "GATE CS-IT", slug: "gate-2026-cs-it" }],
  },
];

const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://facebook.com", icon: Facebook },
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "X", href: "https://x.com", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { name: "YouTube", href: "https://youtube.com", icon: Youtube },
];
// --- CONFIGURATION END ---

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full px-4 sm:px-6 py-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 text-sm">
        
        {/* About Section - Detailed */}
        <div className="space-y-3 col-span-1 md:col-span-1">
          <h4 className="text-base font-semibold">About QuestionBankPro</h4>
          <p className="leading-relaxed text-gray-600 dark:text-gray-400">
            QuestionBankPro is a comprehensive digital learning ecosystem designed to empower students. 
            We bridge the gap between preparation and success by providing high-quality 
            <strong> structured syllabus guides</strong>, <strong>authentic past year papers</strong>, 
            and <strong>interactive quizzes</strong>.
          </p>
          <p className="leading-relaxed text-gray-600 dark:text-gray-400">
            Whether you are navigating school board exams or aiming for top-tier competitive 
            entrances like GATE, JEE, or NEET, we provide the tools you need to excel.
          </p>
        </div>

        {/* Categories - Now mapping all courses within each category */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">Popular Exams</h4>
          <ul className="space-y-1">
            {COURSES.map((item) => (
              <div key={item.examSlug} className="contents">
                {item.courses.map((course) => (
                  <li key={`${item.examSlug}-${course.slug}`}>
                    <Link 
                      href={`/exams/${item.examSlug}/${course.slug}`} 
                      prefetch={false} 
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {/* If category has multiple items, show course name, else show label */}
                      {item.courses.length > 1 ? course.name : item.label}
                    </Link>
                  </li>
                ))}
              </div>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">Contact</h4>
          <ul className="space-y-1">
            <li>
              <a href="mailto:support@questionbankpro.com" className="hover:underline text-blue-600">
                support@questionbankpro.com
              </a>
            </li>
            <li className="text-gray-600 dark:text-gray-400">India</li>
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">Follow Us</h4>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <SocialLink key={social.name} href={social.href}>
                  <Icon size={18} />
                </SocialLink>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        © {year} QuestionBankPro. All rights reserved.
      </div>
    </footer>
  );
}

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400 hover:text-blue-600"
    >
      {children}
    </a>
  );
}