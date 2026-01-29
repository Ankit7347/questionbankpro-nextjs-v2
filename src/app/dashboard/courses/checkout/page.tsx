// src/app/dashboard/courses/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Ticket, ShieldCheck, Zap, X,
    CheckCircle2, Loader2, FileText, HelpCircle,
    BookOpen, Layout, Globe, Video
} from "lucide-react";

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [showCouponAlert, setShowCouponAlert] = useState(true);
    const [loading, setLoading] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(false);

    const slug = searchParams.get("slug");
    const type = searchParams.get("type");
    const courseId = searchParams.get("courseId");
    const [invalidCoupon, setInvalidCoupon] = useState(false); // New state for error

    const handleApplyCoupon = () => {
        if (coupon.toUpperCase() === "FREE2026") {
            setAppliedCoupon(true);
            setInvalidCoupon(false);
        } else {
            setAppliedCoupon(false);
            setInvalidCoupon(true);
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => setShowCouponAlert(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    // CheckoutPage component
    const handleAction = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/dashboard/courses/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: slug,
                    coupon: appliedCoupon ? coupon : null,
                    // These IDs should ideally come from your course data/search params
                    courseId: courseId,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Enrollment failed");
            }

            router.push(`/dashboard/courses`);
        } catch (err: any) {
            alert(err.message); // Simple error feedback
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: <BookOpen className="h-5 w-5 text-blue-500" />, label: "Full Subject Coverage", desc: "All core modules included" },
        { icon: <FileText className="h-5 w-5 text-emerald-500" />, label: "PDF Study Notes", desc: "Downloadable chapter summaries" },
        { icon: <HelpCircle className="h-5 w-5 text-purple-500" />, label: "Question Papers", desc: "Previous years & Mock tests" },
        { icon: <Layout className="h-5 w-5 text-amber-500" />, label: "Topic-wise Quizzes", desc: "Test your knowledge per topic" },
    ];

    return (
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">

            {/* 1. Flash Sale Alert */}
            {showCouponAlert && (
                <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 fill-emerald-500" />
                        <p className="text-sm font-bold">
                            Flash Deal: Use <span className="underline decoration-2">FREE2026</span> for 100% Off!
                        </p>
                    </div>
                    <button onClick={() => setShowCouponAlert(false)} className="hover:opacity-70">
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* 2. Header */}
            <button
                onClick={() => router.back()}
                className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-500 dark:text-slate-400 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>

            <div className="grid gap-8 lg:grid-cols-12">

                {/* 3. Left Side: Content & Features */}
                <div className="lg:col-span-7">
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl">
                        {type === 'enroll' ? 'Confirm Enrollment' : 'Complete Purchase'}
                    </h1>

                    {/* Main Course Card */}
                    <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                                <Video className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize leading-tight">
                                    {slug?.replace(/-/g, ' ')}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">English • All Levels • 2026 Updated</p>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div className="mt-1">{feature.icon}</div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{feature.label}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-900/30">
                        <p className="text-xs font-medium text-blue-800 dark:text-blue-300 leading-relaxed">
                            <strong>Note:</strong> You will get instant access to the current curriculum and all future updates for this subject until the exam cycle ends.
                        </p>
                    </div>
                </div>

                {/* 4. Right Side: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl shadow-slate-200/10 dark:shadow-none">
                        <h3 className="mb-6 font-bold text-slate-900 dark:text-white text-lg">Order Summary</h3>

                        {/* Coupon Section */}
                        <div className="mb-6 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Promo Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="CODE2026"
                                    value={coupon}
                                    onChange={(e) => {
                                        setCoupon(e.target.value.toUpperCase()); // Forces letters to Caps
                                        setInvalidCoupon(false); // Reset error while typing
                                    }}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="rounded-xl bg-slate-900 dark:bg-slate-100 px-5 py-2 text-sm font-bold text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                                >
                                    Apply
                                </button>
                            </div>

                            {appliedCoupon && (
                                <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 animate-in fade-in">
                                    <CheckCircle2 className="h-3 w-3" /> 100% Discount Applied!
                                </p>
                            )}

                            {invalidCoupon && (
                                <p className="text-xs font-bold text-red-500 flex items-center gap-1 animate-in shake-in">
                                    <X className="h-3 w-3" /> Invalid Coupon Code
                                </p>
                            )}
                        </div>

                        {/* Price Table */}
                        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Subject Price</span>
                                <span className={appliedCoupon || type === 'enroll' ? 'line-through' : ''}>₹1,999</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>GST (18%)</span>
                                <span>{appliedCoupon || type === 'enroll' ? '₹0' : 'Included'}</span>
                            </div>
                            {(appliedCoupon || type === 'enroll') && (
                                <div className="flex justify-between text-sm text-emerald-500 font-bold">
                                    <span>Coupon Savings</span>
                                    <span>- ₹1,999</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-2 text-2xl font-black text-slate-900 dark:text-white">
                                <span>Total</span>
                                <span>{appliedCoupon || type === 'enroll' ? '₹0' : '₹1,999'}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleAction}
                            disabled={loading}
                            className="mt-8 flex w-full items-center justify-center rounded-xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.97] disabled:bg-slate-300 dark:disabled:bg-slate-800 shadow-lg shadow-blue-500/20"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                appliedCoupon || type === 'enroll' ? 'Confirm Enrollment' : 'Proceed to Payment'
                            )}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            Secure 256-bit SSL Payment
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}