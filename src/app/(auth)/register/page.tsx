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
import { Label } from "@/components/ui/label"; // Assuming you have a Label component
import { toast } from "sonner";
import { registerUser } from "@/services/client/register.client";

/* ================================
   Types (Unchanged)
================================ */
interface RegistrationSubExam {
  _id: string;
  label: string;
  type: "school" | "program" | "competitive";
  board?: string | null;
  class?: number | null;
  level?: "ug" | "pg" | null;
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
    if (form.password.length < 6) return toast.error("Password too short");

    // 1. Find the descriptive names based on the selected IDs
    const selectedState = states.find(s => s.id === form.geolocationStateId);
    const selectedDistrict = districts.find(d => d.id === form.geolocationDistrictId);
    const selectedSubExam = subExams.find(se => se._id === form.subExamId);

    // 2. Construct the data object to match RegisterFormData
    const submissionData = {
      ...form,
      stateName: selectedState?.stateName || "",
      districtName: selectedDistrict?.districtName || "",
      className: selectedSubExam?.label || "", // Assuming label is the name you want
      competition: form.subExamId, // Putting the ID here as requested
    };

    setRegisterLoading(true);
    // 3. Pass the new object instead of just 'form'
    const success = await registerUser(submissionData);

    if (success) router.push("/login");
    setRegisterLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 py-12 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl border border-slate-100 rounded-2xl p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-2">Join us to start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info Group */}
          <div className="space-y-3">
            <input
              placeholder="Full Name"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
            <input
              placeholder="Email Address"
              type="email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
            <input
              placeholder="Phone Number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>

          <hr className="border-slate-100" />

          {/* Location Group */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Select
                value={form.geolocationStateId}
                onValueChange={(v) => setForm((p) => ({ ...p, geolocationStateId: v, geolocationDistrictId: "" }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => <SelectItem key={s.id} value={s.id}>{s.stateName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Select
                value={form.geolocationDistrictId}
                onValueChange={(v) => setForm((p) => ({ ...p, geolocationDistrictId: v }))}
                disabled={!form.geolocationStateId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => <SelectItem key={d.id} value={d.id}>{d.districtName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Exam Selection Group - Fixed height container to prevent jumps */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <Label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Education Details</Label>

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
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school">Schooling</SelectItem>
                <SelectItem value="program">College / Degree</SelectItem>
                <SelectItem value="competitive">Competitive Exams</SelectItem>
              </SelectContent>
            </Select>

            {/* Conditional Filters with consistent spacing */}
            <div className="space-y-3">
              {selectedCategory === "school" && (
                <>
                  <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select Board" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...new Set(subExams.filter((s) => s.type === "school").map((s) => s.board))].map(
                        (b) => b && <SelectItem key={b} value={b}>{b.toUpperCase()}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {selectedBoard && (
                    <Select value={String(selectedClass)} onValueChange={(v) => setSelectedClass(Number(v))}>
                      <SelectTrigger className="bg-white animate-in fade-in slide-in-from-top-1">
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...new Set(subExams.filter((s) => s.type === "school" && s.board === selectedBoard).map((s) => s.class))].map(
                          (c) => c && <SelectItem key={c} value={String(c)}>Class {c}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </>
              )}

              {selectedCategory === "program" && (
                <Select value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as "ug" | "pg")}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Level (UG/PG)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ug">Undergraduate (UG)</SelectItem>
                    <SelectItem value="pg">Postgraduate (PG)</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Final Exam Selection Dropdown */}
              {(selectedCategory === "competitive" || (filteredSubExams.length > 1)) && (
                <Select
                  key={`${selectedCategory}-${selectedBoard}-${selectedClass}-${selectedLevel}`} // Key forces re-render to fix "stuck" values
                  value={form.subExamId}
                  onValueChange={(v) => setForm((p) => ({ ...p, subExamId: v }))}
                  disabled={subExamLoading}
                >
                  <SelectTrigger className="bg-white border-blue-200 ring-1 ring-blue-50">
                    <SelectValue placeholder="Select Specific Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubExams.map((se) => (
                      <SelectItem key={se._id} value={se._id}>{se.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <input
            type="password"
            placeholder="Create Password (min. 6 chars)"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition-all duration-200 transform active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-blue-100"
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