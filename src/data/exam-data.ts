export const EXAM_DATA = {
  totalTimeMinutes: 5,
  sessions: [
    {
      id: "s1",
      name: "Session 1: Reasoning",
      subjects: [{
        name: "General Intelligence",
        questions: [
          { id: 1, q_en: "A is 1, FAT is 27, FAITH is?", q_hi: "A=1, FAT=27, FAITH=?", options_en: ["44", "45", "46", "47"], options_hi: ["44", "45", "46", "47"], correct: 0 },
          { id: 2, q_en: "Find the odd one out.", q_hi: "विषम चुनें।", options_en: ["Copper", "Iron", "Iodine", "Tin"], options_hi: ["तांबा", "लोहा", "आयोडीन", "टिन"], correct: 2 },
        ],
      }],
    },
    {
      id: "s2",
      name: "Session 2: Quant",
      subjects: [{
        name: "Mathematics",
        questions: [
          { id: 3, q_en: "Sum of 15 and 10?", q_hi: "15 और 10 का योग?", options_en: ["20", "25", "30", "35"], options_hi: ["20", "25", "30", "35"], correct: 1 },
        ],
      }],
    }
  ],
};