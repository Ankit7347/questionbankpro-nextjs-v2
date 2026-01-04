// src/app/page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
// import TopperTestimonials from "@/components/home/TopperTestimonials";
// import EducationSections from "@/components/home/EducationSections";
// import ContactForm from "@/components/home/ContactForm";
// import QuickRevisionNotes from "@/components/home/QuickRevisionNotes";

import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import {ExamModel} from "@/models/mongoose/Exam.schema";

export const dynamic = "force-dynamic";

async function getExams() {
  await dbConnect();

  const exams = await ExamModel.find({ isDeleted: false })
    .select("name category icon tags")
    .lean();

  return exams.map((exam: any) => ({
    id: exam._id.toString(),
    name: exam.name,
    category: exam.category,
    icon: exam.icon,
    tags: exam.tags ?? [],
  }));
}

export default async function HomePage() {
  const exams = await getExams();

  return (
    <>
      <Navbar />
      {/* <QuickRevisionNotes /> */}

      <div className="p-4">
        <div
          id="exam-container"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="
                bg-white dark:bg-gray-800 p-4
                shadow-md dark:shadow-lg rounded-lg
                flex flex-col items-center text-center
                transition-all hover:shadow-lg hover:scale-105 duration-300
              "
            >
              <div className="text-5xl">{exam.icon}</div>

              <h2 className="text-lg font-bold mt-3 dark:text-white">
                {exam.name}
              </h2>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {exam.tags.length > 0 ? (
                  exam.tags.map((tag: any) => (
                    <Link
                      key={`${exam.id}-${tag.tagValue}`}
                      href={`/exam-details/${exam.category}/${encodeURIComponent(
                        tag.tagValue
                      )}`}
                      className="
                        px-3 py-1 text-sm rounded-full
                        bg-gray-200 dark:bg-gray-700
                        dark:text-gray-100
                        hover:bg-gray-300 dark:hover:bg-gray-600
                        transition
                      "
                    >
                      {tag.tagText}
                    </Link>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    No tags available
                  </span>
                )}
              </div>

              <Link
                href={`/exam-details/${exam.category}/all`}
                className="
                  mt-5 px-4 py-2 rounded-lg text-white
                  bg-blue-500 dark:bg-blue-600
                  hover:bg-blue-600 dark:hover:bg-blue-700
                  transition
                "
              >
                Explore
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* <EducationSections />
      <TopperTestimonials />
      <ContactForm /> */}
      <Footer />
    </>
  );
}
