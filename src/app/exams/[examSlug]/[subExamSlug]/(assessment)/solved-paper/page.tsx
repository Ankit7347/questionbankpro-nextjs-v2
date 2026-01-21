// src/app/exams/[examSlug]/[subExamSlug]/(assessment)/solved-paper/page.tsx
import { notFound } from "next/navigation";

// --- Types & Data ---

interface CourseConfig {
  years: number;
  semestersPerYear: number;
  colorScheme: string;
}

const COURSE_MAP: Record<string, CourseConfig> = {
  // Undergrad
  "ba":    { years: 3, semestersPerYear: 2, colorScheme: "from-blue-500 to-indigo-600" },
  "bsc":   { years: 3, semestersPerYear: 2, colorScheme: "from-emerald-500 to-teal-600" },
  "bcom":  { years: 3, semestersPerYear: 2, colorScheme: "from-amber-500 to-orange-600" },
  "btech": { years: 4, semestersPerYear: 2, colorScheme: "from-violet-500 to-purple-600" },
  "mbbs":  { years: 5, semestersPerYear: 1, colorScheme: "from-red-500 to-rose-600" },
  "bds":   { years: 4, semestersPerYear: 2, colorScheme: "from-red-400 to-rose-500" },
  "llb":   { years: 3, semestersPerYear: 2, colorScheme: "from-slate-600 to-slate-800" },
  "ba-llb": { years: 5, semestersPerYear: 2, colorScheme: "from-slate-700 to-black" },
  // Postgrad
  "ma":    { years: 2, semestersPerYear: 2, colorScheme: "from-pink-500 to-rose-600" },
  "mba":   { years: 2, semestersPerYear: 2, colorScheme: "from-pink-500 to-rose-600" },
  "msc":   { years: 2, semestersPerYear: 2, colorScheme: "from-teal-500 to-cyan-600" },
  "mcom":  { years: 2, semestersPerYear: 2, colorScheme: "from-orange-500 to-yellow-600" },
  "mtech": { years: 2, semestersPerYear: 2, colorScheme: "from-cyan-500 to-blue-600" },
  "pgdm":  { years: 2, semestersPerYear: 2, colorScheme: "from-indigo-500 to-blue-700" },
  "md":    { years: 3, semestersPerYear: 1, colorScheme: "from-red-700 to-rose-800" },
  "ms":    { years: 3, semestersPerYear: 1, colorScheme: "from-red-700 to-rose-800" },
  "class-12": { years: 1, semestersPerYear: 1, colorScheme: "from-sky-500 to-blue-700" },
  "class-10": { years: 1, semestersPerYear: 1, colorScheme: "from-indigo-400 to-blue-600" }
};

const EXAM_DATA = [
  {
    "examSlug": "undergraduate-programs",
    "year": 2026,
    "items": [
      { "name": "B.Tech Computer Science", "slug": "btech-cs", "stream": "Engineering" },
      { "name": "B.Tech Mechanical", "slug": "btech-me", "stream": "Engineering" },
      { "name": "B.Tech Civil", "slug": "btech-ce", "stream": "Engineering" },
      { "name": "B.Tech Electronics & Comm.", "slug": "btech-ece", "stream": "Engineering" },
      { "name": "B.Tech Electrical", "slug": "btech-ee", "stream": "Engineering" },
      { "name": "B.Tech Information Technology", "slug": "btech-it", "stream": "Engineering" },
      { "name": "MBBS", "slug": "mbbs", "stream": "Medical" },
      { "name": "BDS (Dentistry)", "slug": "bds", "stream": "Medical" },
      { "name": "B.Sc (Hons) Physics", "slug": "bsc-physics", "stream": "Science" },
      { "name": "B.Sc (Hons) Mathematics", "slug": "bsc-maths", "stream": "Science" },
      { "name": "B.Com (Hons)", "slug": "bcom-hons", "stream": "Commerce" },
      { "name": "BA (Hons) Economics", "slug": "ba-economics", "stream": "Arts" },
      { "name": "BA (Hons) English", "slug": "ba-english", "stream": "Arts" },
      { "name": "BA LLB (Integrated)", "slug": "ba-llb", "stream": "Law" }
    ]
  },
  {
    "examSlug": "postgraduate-programs",
    "year": 2026,
    "items": [
      { "name": "M.Tech Computer Science", "slug": "mtech-cs", "stream": "Engineering" },
      { "name": "M.Tech Structural Engg.", "slug": "mtech-structural", "stream": "Engineering" },
      { "name": "M.Tech VLSI Design", "slug": "mtech-vlsi", "stream": "Engineering" },
      { "name": "MBA Finance", "slug": "mba-finance", "stream": "Management" },
      { "name": "MBA Marketing", "slug": "mba-marketing", "stream": "Management" },
      { "name": "MBA Human Resource", "slug": "mba-hr", "stream": "Management" },
      { "name": "PGDM Business Analytics", "slug": "pgdm-analytics", "stream": "Management" },
      { "name": "M.Sc Data Science", "slug": "msc-data-science", "stream": "Science" },
      { "name": "M.Sc Physics", "slug": "msc-physics", "stream": "Science" },
      { "name": "M.Com", "slug": "mcom", "stream": "Commerce" },
      { "name": "MA Political Science", "slug": "ma-pol-science", "stream": "Arts" },
      { "name": "MD General Medicine", "slug": "md-medicine", "stream": "Medical" },
      { "name": "MS General Surgery", "slug": "ms-surgery", "stream": "Medical" },
      { "name": "LLM Corporate Law", "slug": "llm-corporate", "stream": "Law" }
    ]
  }, 
  {
    "examSlug": "icse-board",
    "year": 2026,
    "items": [
      { "name": "ICSE Class 10", "slug": "icse-class-10", "stream": "CISCE" }
    ]
  },
  {
    "examSlug": "isc-board",
    "year": 2026,
    "items": [
      { "name": "ISC Class 12", "slug": "isc-class-12", "stream": "CISCE" },
    ]
  },
  {
    "examSlug": "cbse-board",
    "year": 2026,
    "items": [
      { "name": "CBSE Class 12", "slug": "cbse-class-12", "stream": "Central Board" },
      { "name": "CBSE Class 10", "slug": "cbse-class-10", "stream": "Central Board" },
    ]
  },
  {
    "examSlug": "up-board",
    "year": 2026,
    "items": [
      { "name": "UP Board Class 12", "slug": "up-board-class-12", "stream": "State Board" },
      { "name": "UP Board Class 10", "slug": "up-board-class-10", "stream": "State Board" },
    ]
  }
];

// --- Helper Functions ---

function getBaseConfig(slug: string): CourseConfig {
  // Check if the slug contains any of our map keys (like 'class-12' or 'btech')
  const keys = Object.keys(COURSE_MAP);
  // Sort by length descending so 'ba-llb' is checked before 'ba'
  const foundKey = keys
    .sort((a, b) => b.length - a.length)
    .find(key => slug.includes(key));

  return COURSE_MAP[foundKey || "ba"];
}

// --- Next.js Static Generation ---

export async function generateStaticParams() {
  return EXAM_DATA.flatMap((group) =>
    group.items.map((item) => ({
      examSlug: group.examSlug,
      subExamSlug: item.slug,
    }))
  );
}

export default async function SolvedPaperPage({ params }: { params: Promise<{ examSlug: string; subExamSlug: string }>}) {
  // 1. Await the params first
  const { examSlug, subExamSlug } = await params;

  // 2. Now perform the search in EXAM_DATA
  const group = EXAM_DATA.find(g => g.examSlug === examSlug);
  const course = group?.items.find(i => i.slug === subExamSlug);

  if (!course) notFound();

  const config = getBaseConfig(course.slug);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Section with dynamic colorScheme */}
      <div className={`w-full py-16 bg-gradient-to-r ${config.colorScheme} text-white`}>
        <div className="max-w-6xl mx-auto px-6">
          <p className="opacity-80 font-medium uppercase tracking-wider text-sm mb-2">
            {course.stream} • {group?.year}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">{course.name}</h1>
          <p className="mt-4 text-lg opacity-90">Solved Previous Year Question Papers & Study Material</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Year/Semester List */}
            {Array.from({ length: config.years }).map((_, yIndex) => (
              <div key={yIndex} className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Year {yIndex + 1}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: config.semestersPerYear }).map((_, sIndex) => (
                    <div key={sIndex} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition flex justify-between items-center group">
                      <span className="font-medium text-gray-700">
                        {config.semestersPerYear > 1 ? `Semester ${sIndex + 1}` : `Annual Examination`}
                      </span>
                      <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold text-gray-800 mb-2">Quick Stats</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                <span>Duration:</span> 
                <b>{config.years} {config.years > 1 ? 'Years' : 'Year'}</b>
                </div>
                <div className="flex justify-between"><span>Format:</span> <b>Solved PDF</b></div>
                <div className="flex justify-between"><span>Updated:</span> <b>{group?.year}</b></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}