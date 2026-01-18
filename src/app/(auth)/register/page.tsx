// src/app/(auth)/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface GeolocationStateType {
    id: string;
    stateName: string;
}

interface GeolocationDistrictType {
    id: string;
    districtName: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        state: "",
        district: "",
        className: "",
        competition: "",
        password: "",
    });
    
    const [loading, setLoading] = useState(true);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [states, setStates] = useState<GeolocationStateType[]>([]);
    const [selectedStateId, setSelectedStateId] = useState<string>("");
    const [districts, setDistricts] = useState<GeolocationDistrictType[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Fetch States on Mount
    useEffect(() => {
        const fetchStates = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/location`);
                if (!res.ok) throw new Error("Failed to fetch states");

                const result = await res.json();
                if (result.success && result.data) {
                    const statesData = Array.isArray(result.data) ? result.data : [result.data];
                    setStates(statesData);
                    
                    // Set default state if available
                    if (statesData.length > 0) {
                        setSelectedStateId(statesData[0].id);
                        setForm((prev) => ({ ...prev, state: statesData[0].stateName }));
                    }
                }
            } catch (err) {
                toast.error("Error", { description: "Failed to load states." });
            } finally {
                setLoading(false);
            }
        };
        fetchStates();
    }, []);

    // Fetch Districts whenever selectedStateId changes
    useEffect(() => {
        if (!selectedStateId) return;

        const fetchDistricts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/location`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ stateId: selectedStateId }), // Backend expects stateId
                });
                
                if (!res.ok) throw new Error("Failed to fetch districts");

                const result = await res.json();
                if (result.success && result.data) {
                    const distData = Array.isArray(result.data) ? result.data : [result.data];
                    setDistricts(distData);
                    
                    // Set default district from the new list
                    if (distData.length > 0) {
                        setForm((prev) => ({ ...prev, district: distData[0].districtName }));
                    } else {
                        setForm((prev) => ({ ...prev, district: "" }));
                    }
                }
            } catch (err) {
                toast.error("Error", { description: "Failed to load districts." });
            } finally {
                setLoading(false);
            }
        };
        fetchDistricts();
    }, [selectedStateId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Registration successful!");
                router.push("/login");
            } else {
                toast.error("Registration Failed", {
                    description: result?.message || "Something went wrong.",
                });
            }
        } catch (err) {
            toast.error("Network Error", {
                description: "Could not connect to the server.",
            });
        } finally {
            setRegisterLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-[70vh] bg-gray-100 dark:bg-gray-900">
                <div className="p-6 md:p-8 w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
                        Create an Account
                    </h2>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            required
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            required
                        />

                        <div className="flex space-x-2">
                            <Select
                                onValueChange={(id) => {
                                    const stateObj = states.find(s => s.id === id);
                                    setSelectedStateId(id);
                                    setForm({ ...form, state: stateObj?.stateName || "" });
                                }}
                                value={selectedStateId}
                            >
                                <SelectTrigger className="w-1/2 dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                                    <SelectValue placeholder="State" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:text-white">
                                    {states.map((state) => (
                                        <SelectItem key={state.id} value={state.id}>
                                            {state.stateName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                onValueChange={(name) => {
                                    setForm({ ...form, district: name });
                                }}
                                value={form.district}
                            >
                                <SelectTrigger className="w-1/2 dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                                    <SelectValue placeholder="District" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:text-white">
                                    {districts.map((district) => (
                                        <SelectItem key={district.id} value={district.districtName}>
                                            {district.districtName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex space-x-2">
                            <input
                                type="text"
                                name="className"
                                placeholder="Class (Optional)"
                                onChange={handleChange}
                                className="w-1/2 p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            />
                            <input
                                type="text"
                                name="competition"
                                placeholder="Competition (Optional)"
                                onChange={handleChange}
                                className="w-1/2 p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            required
                        />

                        <button
                            type="submit"
                            className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex justify-center items-center disabled:opacity-50"
                            disabled={registerLoading || loading}
                        >
                            {registerLoading ? "Registering..." : "Register"}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
                        Already have an account?{" "}
                        <button 
                            onClick={() => router.push("/login")}
                            className="text-blue-600 hover:underline dark:text-blue-400 bg-transparent border-none cursor-pointer"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}