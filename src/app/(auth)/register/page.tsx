"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { registerUser } from "@/services/client/register.client";

interface RegistrationSubExam {
  _id: string;
  label: string;
  type: "school" | "program" | "competitive";
  board?: string | null;
  class?: number | null;
  level?: "ug" | "pg" | null;
  subExamSlug: string;
}
interface GeoState { id: string; stateName: string; }
interface GeoDistrict { id: string; districtName: string; }
type SubExamCategory = "school" | "program" | "competitive" | "";

export default function RegisterPage() {
  const router = useRouter();

  /* ---------- Form & UI State ---------- */
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    geolocationStateId: "", geolocationDistrictId: "", subExamId: "",
  });

  const [registerLoading, setRegisterLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [states, setStates] = useState<GeoState[]>([]);
  const [districts, setDistricts] = useState<GeoDistrict[]>([]);
  const [subExams, setSubExams] = useState<RegistrationSubExam[]>([]);
  const [subExamLoading, setSubExamLoading] = useState(true);

  /* ---------- UI Filters ---------- */
  const [selectedCategory, setSelectedCategory] = useState<SubExamCategory>("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedClass, setSelectedClass] = useState<number | "">("");
  const [selectedLevel, setSelectedLevel] = useState<"ug" | "pg" | "">("");

  /* ================================
     Effects (Logic Maintained)
  ================================ */
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch("/api/location");
        const result = await res.json();
        if (result.success) setStates(result.data);
      } catch { toast.error("Failed to load states"); }
      finally { setPageLoading(false); }
    };
    fetchStates();

    const fetchSubExams = async () => {
      try {
        const res = await fetch("/api/registration/subexams");
        const result = await res.json();
        if (result.success) setSubExams(result.data);
      } catch { toast.error("Failed to load exams"); }
      finally { setSubExamLoading(false); }
    };
    fetchSubExams();
  }, []);

  useEffect(() => {
    if (!form.geolocationStateId) return;
    const fetchDistricts = async () => {
      try {
        const res = await fetch("/api/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stateId: form.geolocationStateId }),
        });
        const result = await res.json();
        if (result.success) setDistricts(result.data);
      } catch { toast.error("Failed to load districts"); }
    };
    fetchDistricts();
  }, [form.geolocationStateId]);

  const filteredSubExams = subExams.filter((se) => {
    if (se.type !== selectedCategory) return false;
    if (se.type === "school") return se.board === selectedBoard && se.class === selectedClass;
    if (se.type === "program") return se.level === selectedLevel;
    return true;
  });

  useEffect(() => {
    if (selectedCategory !== "competitive" && filteredSubExams.length === 1) {
      setForm((p) => ({ ...p, subExamId: filteredSubExams[0]._id }));
    } else if (selectedCategory !== "competitive" && selectedCategory !== "") {
      setForm((p) => ({ ...p, subExamId: "" }));
    }
  }, [selectedCategory, selectedBoard, selectedClass, selectedLevel, filteredSubExams.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic Validation
    /* =========================
       VALIDATION LOGIC
    ========================== */
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!form.phone.trim()) return toast.error("Phone number is required");
    if (!form.geolocationStateId) return toast.error("Please select a state");
    if (!form.geolocationDistrictId) return toast.error("Please select a district");

    // 2. Category & Exam Validation
    if (!selectedCategory) return toast.error("Please select an education category");

    if (selectedCategory === "school" && (!selectedBoard || !selectedClass)) {
      return toast.error("Please select your Board and Class");
    }
    if (selectedCategory === "program" && !selectedLevel) {
      return toast.error("Please select your degree level (UG/PG)");
    }
    if (!form.subExamId) {
      return toast.error(`Please select a specific ${selectedCategory === 'competitive' ? 'exam' : 'course'}`);
    }

    // 3. Password Validation
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");

    const selectedState = states.find(s => s.id === form.geolocationStateId);
    const selectedDistrict = districts.find(d => d.id === form.geolocationDistrictId);
    const selectedSubExam = subExams.find(se => se._id === form.subExamId);

    if (!selectedSubExam) return toast.error("Invalid selection");

    const examType = selectedSubExam.type;

    // educationLevel
    let educationLevel: "school" | "ug" | "pg";
    if (examType === "school") {
      educationLevel = "school";
    } else if (examType === "program") {
      educationLevel = selectedSubExam.level as "ug" | "pg";
    } else {
      // competitive
      educationLevel = "ug"; // default, stable choice
    }

    // className
    let className = "";
    if (examType === "school") {
      className = `${selectedSubExam.board?.toUpperCase()} Class ${selectedSubExam.class}`;
    } else if (examType === "program") {
      className = selectedSubExam.label; // e.g. BSc Mathematics
    } else {
      className = "Competitive";
    }

    // subExamSlug (stable, required)
    const subExamSlug = selectedSubExam.subExamSlug
    /* =========================
       FINAL SUBMISSION PAYLOAD
       (100% SCHEMA COMPLIANT)
    ========================== */

    const submissionData = {
      // basic
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,

      // location
      geolocationStateId: form.geolocationStateId,
      geolocationDistrictId: form.geolocationDistrictId,
      stateName: selectedState!.stateName,
      districtName: selectedDistrict!.districtName,

      // education
      educationLevel,
      className,
      courseName: selectedSubExam.label,
      examType,

      // subexam
      subExamId: selectedSubExam._id,
      subExamSlug,

    };

    setRegisterLoading(true);
    const success = await registerUser(submissionData);
    setRegisterLoading(false);

    if (success) router.push("/login");
  };


  return (
    <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 rounded-2xl p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Join us to start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info Group */}
          <div className="space-y-3">
            <input
              placeholder="Full Name *"
              className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:border-slate-700"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
            <input
              placeholder="Email Address *"
              type="email"
              className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:border-slate-700"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
            <input
              placeholder="Phone Number *"
              className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:border-slate-700"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Location Group */}
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={form.geolocationStateId}
              onValueChange={(v) => setForm((p) => ({ ...p, geolocationStateId: v, geolocationDistrictId: "" }))}
            >
              <SelectTrigger className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                <SelectValue placeholder="State *" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                {states.map((s) => <SelectItem key={s.id} value={s.id} className="dark:text-slate-100">{s.stateName}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select
              value={form.geolocationDistrictId}
              onValueChange={(v) => setForm((p) => ({ ...p, geolocationDistrictId: v }))}
              disabled={!form.geolocationStateId}
            >
              <SelectTrigger className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                <SelectValue placeholder="District *" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                {districts.map((d) => <SelectItem key={d.id} value={d.id} className="dark:text-slate-100">{d.districtName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
            <Label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Education Details *</Label>

            <Select
              value={selectedCategory}
              onValueChange={(v) => {
                setSelectedCategory(v as SubExamCategory);
                setSelectedBoard("");
                setSelectedClass("");
                setSelectedLevel("");
                setForm((p) => ({ ...p, subExamId: "" }));
              }}
            >
              <SelectTrigger className="bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                <SelectItem value="school" className="dark:text-slate-100">Schooling</SelectItem>
                <SelectItem value="program" className="dark:text-slate-100">College / Degree</SelectItem>
                <SelectItem value="competitive" className="dark:text-slate-100">Competitive Exams</SelectItem>
              </SelectContent>
            </Select>

            {/* Conditional Filters with consistent spacing */}
            <div className="space-y-3">
              {selectedCategory === "school" && (
                <>
                  <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                    <SelectTrigger className="bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600">
                      <SelectValue placeholder="Select Board *" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      {[...new Set(subExams.filter((s) => s.type === "school").map((s) => s.board))].map(
                        (b) => b && <SelectItem key={b} value={b} className="dark:text-slate-100">{b.toUpperCase()}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {selectedBoard && (
                    <Select value={String(selectedClass)} onValueChange={(v) => setSelectedClass(Number(v))}>
                      <SelectTrigger className="bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 animate-in fade-in slide-in-from-top-1">
                        <SelectValue placeholder="Select Class *" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        {[...new Set(subExams.filter((s) => s.type === "school" && s.board === selectedBoard).map((s) => s.class))].map(
                          (c) => c && <SelectItem key={c} value={String(c)} className="dark:text-slate-100">Class {c}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </>
              )}

              {selectedCategory === "program" && (
                <Select value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as "ug" | "pg")}>
                  <SelectTrigger className="bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600">
                    <SelectValue placeholder="Select Level (UG/PG) *" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                    <SelectItem value="ug" className="dark:text-slate-100">Undergraduate (UG)</SelectItem>
                    <SelectItem value="pg" className="dark:text-slate-100">Postgraduate (PG)</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {(selectedCategory === "competitive" || (filteredSubExams.length > 1)) && (
                <Select
                  key={`${selectedCategory}-${selectedBoard}-${selectedClass}-${selectedLevel}`}
                  value={form.subExamId}
                  onValueChange={(v) => setForm((p) => ({ ...p, subExamId: v }))}
                  disabled={subExamLoading}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-800 dark:text-slate-100 border-blue-200 dark:border-blue-900 ring-1 ring-blue-50 dark:ring-blue-900/20">
                    <SelectValue placeholder="Select Specific Option *" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                    {filteredSubExams.map((se) => (
                      <SelectItem key={se._id} value={se._id} className="dark:text-slate-100">{se.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <input
            type="password"
            placeholder="Create Password * (min. 6 chars)"
            className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:border-slate-700"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition-all duration-200 transform active:scale-[0.98] disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed shadow-lg shadow-blue-100 dark:shadow-none"
            disabled={registerLoading || pageLoading}
          >
            {registerLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}