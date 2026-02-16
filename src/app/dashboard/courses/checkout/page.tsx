// src/app/dashboard/courses/checkout/page.tsx
import { getCourseBySlug } from "@/services/client/course.client";
import CheckoutClient from "./CheckoutClient";
import { notFound } from "next/navigation";

// 1. Update the type to reflect that searchParams is a Promise
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>; 
}) {
  // 2. Await the searchParams before destructuring
  const { slug } = await searchParams;

  if (!slug) {
    notFound();
  }

  const course = await getCourseBySlug(slug);
  if(!course.success || !course.data){
    notFound();
  }
  const courseData = course.data;

  return <CheckoutClient course={courseData} />;
}