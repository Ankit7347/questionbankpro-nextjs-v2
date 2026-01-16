"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Message sent successfully!");
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <form
        className="
          w-[95%]
          sm:w-[90%]
          md:w-[80%]
          lg:w-[70%]
          xl:w-[60%]
          mx-auto
          p-6
          bg-white
          dark:bg-gray-900
          rounded-lg
          shadow-md
          border
          border-gray-300
          dark:border-gray-700
        "
        onSubmit={handleSubmit}
      >

      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Contact Us</h2>

      <div>
        <label htmlFor="name" className="py-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label htmlFor="phone" className="py-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your phone number"
        />
      </div>

      <div>
        <label htmlFor="email" className="py-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="text" className="py-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Your Concern</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Write your concern"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {message && <p className="text-center text-sm text-green-600 dark:text-green-400">{message}</p>}
    </form>
  </div>
  );
}