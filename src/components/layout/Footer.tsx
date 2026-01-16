import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="
        w-full
        px-4 sm:px-6
        py-8
        bg-white dark:bg-gray-900
        text-gray-800 dark:text-gray-200
        border-t border-gray-200 dark:border-gray-700
        transition-colors
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          gap-8
          sm:grid-cols-2
          md:grid-cols-4
          text-sm
        "
      >
        {/* About */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">About</h4>
          <p className="leading-relaxed text-gray-600 dark:text-gray-400">
            QuestionBankPro is your go-to source for syllabus, past papers,
            quizzes, and notes for school and competitive exams.
          </p>
        </div>

        {/* Useful Links */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">Useful Links</h4>
          <ul className="space-y-1">
            <li><Link href="/exam-details/school/all">School Exams</Link></li>
            <li><Link href="/exam-details/high-school/all">High School</Link></li>
            <li><Link href="/exam-details/intermediate/all">Intermediate</Link></li>
            <li><Link href="/exam-details/jee/all">JEE</Link></li>
            <li><Link href="/exam-details/neet/all">NEET</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">Contact</h4>
          <ul className="space-y-1">
            <li>
              Email:{' '}
              <a href="mailto:support@questionbankpro.com">
                support@questionbankpro.com
              </a>
            </li>
            <li className="text-gray-600 dark:text-gray-400">
              Location: India
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">Follow Us</h4>
          <div className="flex items-center gap-4">
            <SocialLink href="https://facebook.com"><Facebook /></SocialLink>
            <SocialLink href="https://instagram.com"><Instagram /></SocialLink>
            <SocialLink href="https://x.com"><Twitter /></SocialLink>
            <SocialLink href="https://linkedin.com"><Linkedin /></SocialLink>
            <SocialLink href="https://youtube.com"><Youtube /></SocialLink>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        © {year} QuestionBankPro. All rights reserved.
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        p-2
        rounded-full
        border border-gray-200 dark:border-gray-700
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition
      "
    >
      <span className="w-5 h-5 block">{children}</span>
    </a>
  );
}
