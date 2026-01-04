// src/scripts/seed/education.seed.ts

import { initSeed, closeSeed } from "./_helpers";
import { EducationLevelModel } from "../../models/mongoose/EducationLevel.schema";
import { CourseModel } from "../../models/mongoose/Course.schema";

const EDUCATION = [
  {
    type: "school",
    name: "Class 9–12",
    order: 1,
    courses: [
      "Class 9",
      "Class 10",
      "Class 11",
      "Class 12",
    ],
  },
];

async function seedEducation() {
  console.log("🎓 Seeding education structure...");
  await initSeed();

  for (const level of EDUCATION) {
    let edu = await EducationLevelModel.findOne({
      name: level.name,
      isDeleted: false,
    });

    if (!edu) {
      edu = await EducationLevelModel.create({
        type: level.type,
        name: level.name,
        order: level.order,
      });
      console.log(`✅ EducationLevel added: ${level.name}`);
    }

    for (const courseName of level.courses) {
      const exists = await CourseModel.findOne({
        name: courseName,
        educationLevelId: edu._id,
        isDeleted: false,
      });

      if (!exists) {
        await CourseModel.create({
          name: courseName,
          educationLevelId: edu._id,
        });
        console.log(`  ➕ Course added: ${courseName}`);
      }
    }
  }

  await closeSeed();
  console.log("🎉 Education seeding done");
}

seedEducation();
