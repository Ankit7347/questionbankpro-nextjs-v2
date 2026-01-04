/**
 * CLIENT-SAFE SERVICE
 * Can be imported by any Client Component
 */

export type ExamDTO = {
  id: string;
  name: string;
  category: string;
};

export async function fetchPublicExams(): Promise<ExamDTO[]> {
  const res = await fetch("/api/exam/public", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch exams");
  }

  return res.json();
}
