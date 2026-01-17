// src/data/mockData.ts

export const EXAMS_DATA = {
  "gate-exam": {
    name: "GATE Exam",
    courses: {
      "gate-2026-cs-it": {
        name: "GATE 2026 CS & IT",
        subjects: {
          "engineering-mathematics": {
            name: "Engineering Mathematics",
            syllabus: [
              { 
                unit: "Unit 1", 
                title: "Discrete Mathematics", 
                details: "Propositional and first order logic. Sets, relations, functions, partial orders and lattices." 
              },
              { 
                unit: "Unit 2", 
                title: "Linear Algebra", 
                details: "Matrices, determinants, system of linear equations, eigenvalues and eigenvectors." 
              },
              { 
                unit: "Unit 3", 
                title: "Calculus", 
                details: "Limits, continuity and differentiability. Maxima and minima. Mean value theorem." 
              },
            ],
            chapters: [
              { 
                id: 1, 
                title: "Linear Algebra", 
                slug: "linear-algebra", 
                status: "completed", 
                duration: "2h 15m",
                topicsCount: 5,
                topics: [
                  {
                    id: "t1",
                    slug: "matrices",
                    title: "Matrices & Determinants",
                    type: "video",
                    duration: "25:00",
                    difficulty: "Intermediate",
                    readingTime: "15 min",
                    lastUpdated: "Jan 2026",
                    isCompleted: true,
                    content: `
                      <h3>Overview of Matrices</h3>
                      <p>In the context of GATE CS, understanding the properties of determinants and matrix multiplication is fundamental for solving linear systems efficiently.</p>
                      <ul>
                        <li>Square Matrices and their properties</li>
                        <li>Finding Determinants using Sarrus Rule</li>
                        <li>Adjoint and Inverse of a Matrix</li>
                      </ul>
                    `,
                    resources: [
                      { name: "Matrix_Properties.pdf", size: "1.5 MB" },
                      { name: "Practice_Set_1.pdf", size: "2.1 MB" }
                    ]
                  },
                  {
                    id: "t2",
                    slug: "linear-systems",
                    title: "System of Linear Equations",
                    type: "video",
                    duration: "40:00",
                    difficulty: "Advanced",
                    readingTime: "20 min",
                    lastUpdated: "Jan 2026",
                    isCompleted: true,
                    content: "<p>Deep dive into Consistent and Inconsistent systems.</p>",
                    resources: []
                  },
                  {
                    id: "t3",
                    slug: "eigenvalues",
                    title: "Eigenvalues & Eigenvectors",
                    type: "video",
                    duration: "35:00",
                    difficulty: "Hard",
                    readingTime: "25 min",
                    lastUpdated: "Feb 2026",
                    isCompleted: false,
                    content: "<p>Understanding characteristic equations.</p>",
                    resources: []
                  },
                  {
                    id: "t4",
                    slug: "matrix-pdf",
                    title: "Matrix Properties PDF",
                    type: "document",
                    duration: "10 min read",
                    difficulty: "Easy",
                    readingTime: "10 min",
                    lastUpdated: "Jan 2026",
                    isCompleted: false,
                    content: "<p>A comprehensive summary of all matrix formulas.</p>",
                    resources: [{ name: "Full_Formulas.pdf", size: "3.2 MB" }]
                  },
                  {
                    id: "t5",
                    slug: "la-quiz",
                    title: "Linear Algebra Quiz",
                    type: "quiz",
                    duration: "15 questions",
                    difficulty: "Intermediate",
                    readingTime: "N/A",
                    lastUpdated: "March 2026",
                    isCompleted: false,
                    content: "<p>Assess your Linear Algebra knowledge.</p>",
                    resources: []
                  }
                ]
              },
              { 
                id: 2, 
                title: "Calculus", 
                slug: "calculus", 
                status: "current", 
                duration: "1h 45m",
                topicsCount: 2,
                topics: [
                  { 
                    id: "c1", 
                    slug: "limits",
                    title: "Limits & Continuity", 
                    type: "video", 
                    duration: "20:00", 
                    difficulty: "Easy",
                    readingTime: "10 min",
                    lastUpdated: "Jan 2026",
                    isCompleted: true,
                    content: "<h3>Introduction to Limits</h3><p>L'Hopital's Rule and standard limits.</p>",
                    resources: []
                  },
                  { 
                    id: "c2", 
                    slug: "mvt",
                    title: "Mean Value Theorems", 
                    type: "video", 
                    duration: "30:00", 
                    difficulty: "Intermediate",
                    readingTime: "15 min",
                    lastUpdated: "Jan 2026",
                    isCompleted: false,
                    content: "<h3>Rolle's and Lagrange's MVT</h3><p>Practical applications in Calculus.</p>",
                    resources: []
                  },
                ]
              }
            ]
          }
        }
      }
    }
  }
};

export type ExamData = typeof EXAMS_DATA;