// src/app/dashboard/courses/checkout/CheckoutClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Zap,
  X,
  CheckCircle2,
  Loader2,
  FileText,
  HelpCircle,
  BookOpen,
  Layout,
  Video,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseCheckoutData } from "@/dto/course.ui.dto";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutClient({ course }: { course: CourseCheckoutData }) {
  const router = useRouter();
    const { name, slug, price, isFree } = course;
    const features = [
        { icon: <BookOpen className="h-5 w-5 text-blue-500" />, label: "Full Subject Coverage", desc: "All core modules included" },
        { icon: <FileText className="h-5 w-5 text-emerald-500" />, label: "PDF Study Notes", desc: "Downloadable chapter summaries" },
        { icon: <HelpCircle className="h-5 w-5 text-purple-500" />, label: "Question Papers", desc: "Previous years & Mock tests" },
        { icon: <Layout className="h-5 w-5 text-amber-500" />, label: "Topic-wise Quizzes", desc: "Test your knowledge per topic" },
    ];
    const type = isFree ? 'enroll' : 'buy';

  const [showCouponAlert, setShowCouponAlert] = useState(true);
    const [loading, setLoading] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponMessage, setCouponMessage] = useState<string | null>(null);
    const [verifyingCoupon, setVerifyingCoupon] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  // load razorpay script once
    const handleApplyCoupon = async () => {
        if (!coupon.trim()) return;
        setVerifyingCoupon(true);
        setAppliedCoupon(false);
        setCouponMessage(null);
        setDiscountAmount(0);

        try {
            const res = await fetch("/api/dashboard/coupon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: coupon, courseSlug: slug }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setAppliedCoupon(true);
                setDiscountAmount(data.data.discountAmount);
                setCouponMessage(data.message || "Coupon applied successfully");
            } else {
                                setCouponMessage(data.message || "Invalid coupon code");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setVerifyingCoupon(false);
        }
    };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const effectivePrice = isFree ? 0 : Math.max(0, price - (appliedCoupon ? discountAmount : 0));

  const handleAction = async () => {
    setLoading(true);
    try {
      // step‑1: ask server for order (unless free/enroll)
      if (effectivePrice > 0) {
        const resp = await fetch("/api/dashboard/courses/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: slug,
            coupon: appliedCoupon ? coupon : null,
          }),
        });
        const json = await resp.json();
        if (!resp.ok) throw new Error(json.message || "Order creation failed");
        
        if (json.success && !json.order) {
             router.push(`/dashboard/courses`);
             return;
        }

        setOrderData(json.order);
        // open razorpay checkout
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: json.order.amount,
          currency: json.order.currency,
          order_id: json.order.id,
          name,
          description: "Course purchase",
          handler: async (paymentResp: any) => {
            // confirm payment
            const confirmResp = await fetch("/api/dashboard/courses/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                slug: slug,
                coupon: appliedCoupon ? coupon : null,
                razorpayPaymentId: paymentResp.razorpay_payment_id,
                razorpayOrderId: paymentResp.razorpay_order_id,
                razorpaySignature: paymentResp.razorpay_signature,
              }),
            });
            const confirmJson = await confirmResp.json();
            if (!confirmResp.ok) throw new Error(confirmJson.message);
            router.push(`/dashboard/courses`);
          },
          prefill: {
            // optionally fill from session
          },
          theme: { color: "#3399cc" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // free/coupon case – just call server directly and enroll
        const response = await fetch("/api/dashboard/courses/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: slug,
            coupon: appliedCoupon ? coupon : null,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        router.push(`/dashboard/courses`);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (label: string) => {
        if (label.includes("Subject")) return <BookOpen className="h-5 w-5 text-blue-500" />;
        if (label.includes("PDF")) return <FileText className="h-5 w-5 text-emerald-500" />;
        if (label.includes("Question")) return <HelpCircle className="h-5 w-5 text-purple-500" />;
        if (label.includes("Quiz")) return <Layout className="h-5 w-5 text-amber-500" />;
        return <BookOpen className="h-5 w-5 text-blue-500" />;
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
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

            <button
                onClick={() => router.back()}
                className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-500 dark:text-slate-400 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>

            <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl">
                        {type === 'enroll' ? 'Confirm Enrollment' : 'Complete Purchase'}
                    </h1>

                    <GlassCard className="mt-6 rounded-2xl p-6">
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                                <Video className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize leading-tight">
                                    {name}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">English • All Levels • 2026 Updated</p>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div className="mt-1">{getIcon(feature.label)}</div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{feature.label}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                      </div>
                    </GlassCard>

                    <div className="mt-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-900/30">
                        <p className="text-xs font-medium text-blue-800 dark:text-blue-300 leading-relaxed">
                            <strong>Note:</strong> You will get instant access to the current curriculum and all future updates for this subject until the exam cycle ends.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <GlassCard className="sticky top-6 rounded-2xl p-6 shadow-xl shadow-slate-200/10 dark:shadow-none">
                        <h3 className="mb-6 font-bold text-slate-900 dark:text-white text-lg">Order Summary</h3>

                        <div className="mb-6 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Promo Code</label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="CODE2026"
                                    value={coupon}
                                    onChange={(e) => {
                                        setCoupon(e.target.value.toUpperCase());
                                        setAppliedCoupon(false);
                                        setCouponMessage(null);
                                        setDiscountAmount(0);
                                    }}
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 h-auto text-sm font-bold focus-visible:ring-blue-500 dark:text-white"
                                />
                                <Button
                                    onClick={handleApplyCoupon}
                                    disabled={verifyingCoupon || !coupon}
                                    className="rounded-xl bg-slate-900 dark:bg-slate-100 px-5 py-2 h-auto text-sm font-bold text-white dark:text-slate-900 hover:opacity-90 hover:bg-slate-800 dark:hover:bg-slate-200 transition-opacity"
                                >
                                    {verifyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                                </Button>
                            </div>

                            {couponMessage && (
                                <p className={`text-xs font-bold flex items-center gap-1 animate-in ${
                                    appliedCoupon
                                        ? "text-emerald-500"
                                        : "text-red-500 shake-in"
                                }`}>
                                    {appliedCoupon ? (
                                        <CheckCircle2 className="h-3 w-3" />
                                    ) : (
                                        <X className="h-3 w-3" />
                                    )}{" "}{couponMessage}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Subject Price</span>
                                <span>₹{price}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>GST (18%)</span>
                                <span>Included</span>
                            </div>
                            {(appliedCoupon) && (
                                <div className="flex justify-between text-sm text-emerald-500 font-bold">
                                    <span>Coupon Savings</span>
                                    <span>- ₹{discountAmount}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-2 text-2xl font-black text-slate-900 dark:text-white">
                                <span>Total</span>
                                <span>{effectivePrice === 0 ? '₹0' : `₹${effectivePrice}`}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleAction}
                            disabled={loading}
                            className="mt-8 w-full rounded-xl bg-blue-600 py-4 h-auto font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.97] disabled:bg-slate-300 dark:disabled:bg-slate-800 shadow-lg shadow-blue-500/20"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                effectivePrice === 0 ? 'Confirm Enrollment' : 'Proceed to Payment'
                            )}
                        </Button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            Secure 256-bit SSL Payment
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
