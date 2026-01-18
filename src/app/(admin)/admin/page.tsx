"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user && session.user.role !== "superadmin")) {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading") return <p>Loading...</p>;

  if (status === "unauthenticated" || !session?.user || session.user.role !== "superadmin") {
    return null; // Prevent rendering while redirecting
  }

  return <h1>Welcome to Admin Dashboard</h1>;
}
