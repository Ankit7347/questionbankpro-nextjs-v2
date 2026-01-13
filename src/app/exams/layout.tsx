// src/app/exams/layout.tsx
import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ExamsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />

      {/* Offset fixed navbar */}
      <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-screen-2xl mx-auto flex">
          {children}
        </div>
      </div>

      <Footer />
    </>
  );
}
