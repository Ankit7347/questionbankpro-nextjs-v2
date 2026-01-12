// src/app/page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QuickRevisionNotes from "@/components/home/QuickRevisionNotes";
import TopperTestimonials from "@/components/home/TopperTestimonials";
import EducationSections from "@/components/home/EducationSections";
import ContactForm from "@/components/home/ContactForm";

import ExamLandingList from "@/components/exams/landing/ExamLandingList";

export const dynamic = "force-dynamic";



export default async function HomePage() {

  return (
    <>
      <Navbar />
      <main className="space-y-5">
        <QuickRevisionNotes />

        {/* Exam catalog section */}
        <section className="max-w-screen-xl mx-auto px-4">
          <ExamLandingList lang="en" />
        </section>

        <EducationSections />
        <TopperTestimonials />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
