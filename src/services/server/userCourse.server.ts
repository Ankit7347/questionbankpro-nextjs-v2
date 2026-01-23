// src/services/server/userCourse.server.ts

import dbConnect from "@/lib/mongodb";
import UserCourseAccess from "@/models/mongoose/UserCourseAccess.schema";
import Course from "@/models/mongoose/Course.schema";
import { mapCourseAccessDTO } from "@/models/dto/courseAccess.mapper";
import { NotFound } from "@/lib/apiError";

/* =========================================================
   GET USER ENROLLED COURSES
   Server-side access projection
========================================================= */
export async function getUserCourses(userId: string) {
  if (!userId) {
    throw NotFound("User not authenticated");
  }

  await dbConnect();

  /* --------------------------------
     1. Fetch active access records
  --------------------------------- */
  const accesses = await UserCourseAccess.find({
    userId,
    status: "ACTIVE",
    isDeleted: false,
  }).lean();

  if (accesses.length === 0) {
    return [];
  }

  const courseIds = accesses.map((a) => a.courseId);

  /* --------------------------------
     2. Fetch courses
  --------------------------------- */
  const courses = await Course.find({
    _id: { $in: courseIds },
    isDeleted: false,
  }).lean();

  /* --------------------------------
     3. Map Course + Access
  --------------------------------- */
  return courses.map((course) => {
    const access = accesses.find(
      (a) => a.courseId.toString() === course._id.toString()
    );

    return mapCourseAccessDTO(course, access);
  });
}
