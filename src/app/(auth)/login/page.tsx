// src/app/(auth)/login/page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { forgotPassword } from "@/services/client/auth.client";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [forgotMode, setForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Missing Fields", {
        description: "Please enter both email and password.",
      });
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      toast.error("Login Failed", {
        description: "Invalid email or password.",
      });
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  }

  async function handleForgotPasswordClick() {
    if (!form.email) {
      toast.error("Missing Email", {
        description: "Please enter your email address.",
      });
      return;
    }

    try {
      setLoading(true);

      await forgotPassword({ email: form.email });

      toast.success("Reset Email Sent", {
        description: "Please check your inbox to reset your password.",
      });

      setForgotMode(false);
    } catch (err) {
      toast.error("Error", {
        description:
          err instanceof Error
            ? err.message
            : "Failed to send reset email.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-[70vh] px-4 py-16 flex items-center justify-center dark:bg-gray-900">
      <form
        onSubmit={forgotMode ? undefined : handleLogin}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow"
      >
        <h1 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          {forgotMode ? "Forgot Password" : "Login"}
        </h1>

        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          autoComplete="username"
          className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-900 dark:text-white"
          required
        />

        {!forgotMode && (
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            autoComplete="current-password"
            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-900 dark:text-white"
            required
          />
        )}

        {!forgotMode ? (
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleForgotPasswordClick}
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        )}

        <div className="flex justify-between mt-6 text-sm">
          <button
            type="button"
            onClick={() => setForgotMode(!forgotMode)}
            className="text-blue-600 hover:underline"
          >
            {forgotMode ? "Back to Login" : "Forgot Password?"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-blue-600 hover:underline"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
