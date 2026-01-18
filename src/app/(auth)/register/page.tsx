// src/app/(auth)/register/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { registerUser } from "@/services/client/register.client";

const EXAM_DATA = [
    {
        educationLevel: { name: "School Education", slug: "school-education" },
        exams: [
            { name: { en: "CBSE Board" }, slug: "cbse-board" },
            { name: { en: "ICSE Board" }, slug: "icse-board" },
            { name: { en: "State Boards" }, slug: "state-board" },
        ],
    },
    {
        educationLevel: { name: "College & Higher Education", slug: "college-higher-education" },
        exams: [
            { name: { en: "Undergraduate Programs" }, slug: "undergraduate-programs" },
            { name: { en: "Postgraduate Programs" }, slug: "postgraduate-programs" },
        ],
    },
    {
        educationLevel: { name: "Competitive Exams", slug: "competitive-exams" },
        exams: [
            { name: { en: "Engineering Entrance" }, slug: "engineering-entrance" },
            { name: { en: "Medical Entrance" }, slug: "medical-entrance" },
            { name: { en: "GATE" }, slug: "gate-exam" },
        ],
    },
];

const COURSE_DATA: Record<string, string[]> = {
    ug: ["B.Tech", "MBBS", "B.Com", "B.Sc", "B.A", "BBA", "BCA", "Other"],
    pg: ["M.Tech", "MD/MS", "M.Com", "M.Sc", "M.A", "MBA", "MCA", "Other"],
};

function getOrdinal(n: number) {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

const CLASSES = [
    ...Array.from({ length: 7 }, (_, i) => {
        const num = i + 6;
        return { label: `${num}${getOrdinal(num)} Class`, value: `${num}` };
    }),
    { label: "12th Pass", value: "12-pass" },
    { label: "Undergraduate (UG)", value: "ug" },
    { label: "Postgraduate (PG)", value: "pg" },
];

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        stateName: "",
        districtName: "",
        className: "",
        courseName: "", 
        otherCourse: "",
        competition: "",
        password: "",
    });

    const [loading, setLoading] = useState(true);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [states, setStates] = useState<any[]>([]);
    const [selectedStateId, setSelectedStateId] = useState<string>("");
    const [districts, setDistricts] = useState<any[]>([]);

    const filteredExamData = useMemo(() => {
        if (!form.className) return [];
        const isSchool = !isNaN(Number(form.className));
        return EXAM_DATA.filter((group) => {
            if (isSchool) return ["school-education", "competitive-exams"].includes(group.educationLevel.slug);
            return group.educationLevel.slug !== "school-education";
        });
    }, [form.className]);

    const validateForm = () => {
        const nameRegex = /^[a-zA-Z\s]{2,25}$/;
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegex.test(form.name)) {
            toast.error("Invalid Name", { description: "Name should be 2-25 characters and contain only letters." });
            return false;
        }
        if (!emailRegex.test(form.email)) {
            toast.error("Invalid Email", { description: "Please enter a valid email address." });
            return false;
        }
        if (!phoneRegex.test(form.phone)) {
            toast.error("Invalid Phone", { description: "Phone number must be exactly 10 digits." });
            return false;
        }
        if (!form.stateName || !form.districtName) {
            toast.error("Location Missing", { description: "Please select both State and District." });
            return false;
        }
        if (!form.className) {
            toast.error("Class Missing", { description: "Please select your current class." });
            return false;
        }
        if ((form.className === 'ug' || form.className === 'pg') && !form.courseName) {
            toast.error("Course Missing", { description: "Please select your course." });
            return false;
        }
        if (form.courseName === "Other" && !form.otherCourse.trim()) {
            toast.error("Course Name Missing", { description: "Please type your course name." });
            return false;
        }
        if (!form.competition) {
            toast.error("Exam Selection Missing", { description: "Please select your target exam/board." });
            return false;
        }
        if (form.password.length < 6) {
            toast.error("Weak Password", { description: "Password must be at least 6 characters long." });
            return false;
        }
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Location Logic
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await fetch(`/api/location`);
                const result = await res.json();
                if (result.success && result.data) setStates(result.data);
            } catch (err) { toast.error("Location Service Error"); }
            finally { setLoading(false); }
        };
        fetchStates();
    }, []);

    useEffect(() => {
        if (!selectedStateId) return;
        const fetchDistricts = async () => {
            try {
                const res = await fetch(`/api/location`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ stateId: selectedStateId }),
                });
                const result = await res.json();
                if (result.success && result.data) setDistricts(result.data);
            } catch (err) { toast.error("District Service Error"); }
        };
        fetchDistricts();
    }, [selectedStateId]);

    // Inside RegisterPage component...
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setRegisterLoading(true);

        // Prepare final data (handling the "Other" course logic)
        const finalData = {
            ...form,
            courseName: form.courseName === "Other" ? form.otherCourse : form.courseName
        };

        // Use the service
        const isSuccess = await registerUser(finalData);

        if (isSuccess) {
            router.push("/login");
        }

        setRegisterLoading(false);
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-[70vh] py-12 bg-gray-100 dark:bg-gray-900 px-4">
                <div className="p-6 md:p-8 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Create Account</h2>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4" autoComplete="off">
                        {/* Honeypot for Browser Autofill */}
                        <div className="sr-only" aria-hidden="true">
                            <input type="text" name="fake_email" tabIndex={-1} />
                            <input type="password" name="fake_password" tabIndex={-1} />
                        </div>

                        <input type="text" name="name" placeholder="Full Name" maxLength={26} onChange={handleChange} className="w-full p-2.5 border rounded-md dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600" required />
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2.5 border rounded-md dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600" required />
                        <input type="text" name="phone" placeholder="Phone Number (10 digits)" maxLength={10} onChange={handleChange} className="w-full p-2.5 border rounded-md dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600" required />

                        {/* Location */}
                        <div className="flex space-x-2">
                            <Select onValueChange={(id) => {
                                const stateObj = states.find(s => s.id === id);
                                setSelectedStateId(id);
                                setForm({ ...form, stateName: stateObj?.stateName || "" });
                            }} value={selectedStateId}>
                                <SelectTrigger className="w-1/2 dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600"><SelectValue placeholder="State" /></SelectTrigger>
                                <SelectContent>{states.map((s) => <SelectItem key={s.id} value={s.id}>{s.stateName}</SelectItem>)}</SelectContent>
                            </Select>

                            <Select onValueChange={(val) => setForm({ ...form, districtName: val })} value={form.districtName}>
                                <SelectTrigger className="w-1/2 dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600"><SelectValue placeholder="District" /></SelectTrigger>
                                <SelectContent>{districts.map((d) => <SelectItem key={d.id} value={d.districtName}>{d.districtName}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        {/* Class and Course */}
                        <div className="flex flex-col space-y-4">
                            <div className="flex space-x-2">
                                <Select onValueChange={(val) => setForm({ ...form, className: val, competition: "", courseName: "", otherCourse: "" })} value={form.className}>
                                    <SelectTrigger className={`${(form.className === 'ug' || form.className === 'pg') ? 'w-1/2' : 'w-full'} dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600`}>
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent>{CLASSES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                                </Select>

                                {(form.className === 'ug' || form.className === 'pg') && (
                                    <Select onValueChange={(val) => setForm({ ...form, courseName: val })} value={form.courseName}>
                                        <SelectTrigger className="w-1/2 dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                                            <SelectValue placeholder="Course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COURSE_DATA[form.className].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            {form.courseName === "Other" && (
                                <input type="text" name="otherCourse" placeholder="Enter Course Name" onChange={handleChange} className="w-full p-2.5 border rounded-md dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600 animate-in fade-in slide-in-from-top-1" required />
                            )}
                        </div>

                        {/* Competition */}
                        <Select onValueChange={(val) => setForm({ ...form, competition: val })} value={form.competition} disabled={!form.className}>
                            <SelectTrigger className="w-full dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                                <SelectValue placeholder={form.className ? "Target Exam / Board" : "Select Class first"} />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredExamData.map((group) => (
                                    <SelectGroup key={group.educationLevel.slug}>
                                        <SelectLabel className="text-blue-600 dark:text-blue-400">{group.educationLevel.name}</SelectLabel>
                                        {group.exams.map((exam) => <SelectItem key={exam.slug} value={exam.slug}>{exam.name.en}</SelectItem>)}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>

                        <input type="password" name="password" placeholder="Password (Min 6 char)" onChange={handleChange} autoComplete="new-password" className="w-full p-2.5 border rounded-md dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600" required />

                        <button type="submit" className="w-full p-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-semibold disabled:opacity-50 transition-colors" disabled={registerLoading || loading}>
                            {registerLoading ? "Registering..." : "Register"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-800 dark:text-gray-300">
                        Already have an account? <button onClick={() => router.push("/login")} className="text-blue-600 font-semibold hover:underline">Login</button>
                    </p>
                </div>
            </div>
        </>
    );
}