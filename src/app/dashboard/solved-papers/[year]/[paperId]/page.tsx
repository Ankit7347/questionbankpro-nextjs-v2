// src/app/dashboard/previous-papers/[year]/[paperId]/page.tsx
import { notFound } from 'next/navigation';
import PaperView from '@/components/student-dashboard/papers/PaperView';

// --- MOCK DATA (JSON AT TOP) ---

// ✅ ACTIVE PAPER (With Questions)
const MOCK_PAPER = {
  "_id": "7",
  "title": {
    "en": "Advanced Engineering Mathematics",
    "hi": "उन्नत इंजीनियरिंग गणित"
  },
  "paperCode": "MATH-2026",
  "year": 2026,
  "session": "Semester 1",
  "contentType": "BOTH",
  "paperUrl": "/pdf/dummy.pdf",
  "difficulty": "Hard",
  "isVerified": true,
  "isPremium": false,
  "views": 1240,
  "downloads": 450,
  "questions": [
    {
      "_id": "2",
      "content": {
        "en": "Evaluate the integral ∫₀^π sin(x) dx.",
        "hi": "समाकल ∫₀^π sin(x) dx का मान ज्ञात कीजिए।"
      },
      "marks": 5,
      "explanation": {
        "en": "Apply fundamental theorem of calculus.",
        "hi": "कलन के मौलिक प्रमेय का प्रयोग करें।"
      }
    },
    {
      "_id": "5",
      "content": {
        "en": "Find eigenvalues of matrix [[2,1],[1,2]].",
        "hi": "मैट्रिक्स [[2,1],[1,2]] के स्वमान ज्ञात करें।"
      },
      "marks": 8,
      "explanation": {
        "en": "Solve characteristic equation det(A − λI) = 0.",
        "hi": "विशेषता समीकरण det(A − λI) = 0 हल करें।"
      }
    },
    {
      "_id": "9",
      "content": {
        "en": "Solve dy/dx + y = e^x.",
        "hi": "dy/dx + y = e^x को हल करें।"
      },
      "marks": 10,
      "explanation": {
        "en": "Use integrating factor method.",
        "hi": "इंटीग्रेटिंग फैक्टर विधि का प्रयोग करें।"
      }
    }
  ]
};

/*
// ❌ ALTERNATIVE PAPER (With paperUrl but NO Questions)
const MOCK_PAPER = {
  "_id": "3",
  "title": {
    "en": "Advanced Engineering Mathematics",
    "hi": "उन्नत इंजीनियरिंग गणित"
  },
  "paperCode": "MATH-2026",
  "year": 2026,
  "session": "Semester 1",
  "contentType": "BOTH",
  "paperUrl": "/pdf/dummy.pdf",
  "difficulty": "Hard",
  "isVerified": true,
  "isPremium": false,
  "views": 980,
  "downloads": 320
};
*/

// Solution aligned with paper _id: "7"
const MOCK_SOLUTION = {
  _id: "4",
  previousPaperId: "7",
  fullExplanation: {
    en: "The solution involves integrating the function and applying limits. For the differential equation, use integrating factor e^x.",
    hi: "समाधान में फ़ंक्शन का समाकलन और सीमाओं का उपयोग शामिल है। अवकल समीकरण के लिए e^x समाकलन कारक का प्रयोग करें।"
  },
  videoSolutionUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  solutionQuality: "EXPERT_VERIFIED",
  totalLikes: 89,
  isPremium: true
};

interface PageProps {
  params: Promise<{
    year: string;
    paperId: string;
  }>;
}

export default async function PaperDetailPage({ params }: PageProps) {
  const { year, paperId } = await params;

  // Updated validation for _id "7"
  const isValid = year === "2026" && paperId === "7";

  if (!isValid) {
    notFound();
  }

  const isSolvedRoute = true;

  return (
    <PaperView 
      paper={MOCK_PAPER} 
      solution={MOCK_SOLUTION}
      mode={isSolvedRoute ? 'solved' : 'previous'}
      year={year}
    />
  );
}
