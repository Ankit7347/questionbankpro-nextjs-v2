// src/app/(auth)/reset-password/page.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Eye, EyeOff, Home } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Loading from "@/components/data-loading/Loading";

import {
  validateResetToken,
  confirmPasswordReset,
} from "@/services/client/auth.client";

function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";
  const otp = searchParams.get("otp") ?? "";

  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* ----------------------------- */
  /* Validate reset token          */
  /* ----------------------------- */

  useEffect(() => {
    async function validate() {
      if (!email || !otp) {
        setLoading(false);
        return;
      }

      try {
        const result = await validateResetToken({
          email,
          otp,
        });

        setIsValid(result.valid);
      } catch {
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    }

    validate();
  }, [email, otp]);

  /* ----------------------------- */
  /* Submit new password           */
  /* ----------------------------- */

  async function handleSubmit() {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description:
          "Please make sure both passwords are identical.",
      });
      return;
    }

    try {
      await confirmPasswordReset({
        email,
        otp,
        password,
      });

      toast.success("Password changed successfully", {
        description:
          "Please login with your new password.",
      });

      router.push("/login");
    } catch (err) {
      toast.error("Reset failed", {
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong.",
      });
    }
  }

  /* ----------------------------- */
  /* UI states                     */
  /* ----------------------------- */

  if (loading) {
    return <Loading />;
  }

  if (!email || !otp) {
    return (
      <p className="text-center mt-10 text-red-600">
        Invalid reset link
      </p>
    );
  }

  if (!isValid) {
    return (
        <>
            <Navbar />
                <p className="text-center min-h-[60vh] mt-20 text-red-600">
                    Link expired or invalid
                    <br />
                    <Link
                    href="/"
                    className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:underline"
                    >
                    <Home size={20} />
                    Home
                    </Link>
                </p>
            <Footer/>
        </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-[70vh] bg-gray-100 dark:bg-gray-900">
        <div className="p-6 md:p-8 w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            Reset Password
          </h2>

          <div className="space-y-4">
            {/* New password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full border p-3 pr-10 rounded-lg dark:bg-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* Confirm password */}
            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full border p-3 pr-10 rounded-lg dark:bg-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* ---------------------------------- */
/* Suspense wrapper                   */
/* ---------------------------------- */

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
