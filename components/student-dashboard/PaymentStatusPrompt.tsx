"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, Sparkles } from "lucide-react";

export default function PaymentStatusPrompt() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"success" | "failed" | "cancelled" | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const payment = searchParams.get("payment");
    const msg = searchParams.get("message");

    if (payment === "success" || payment === "failed" || payment === "cancelled") {
      setStatus(payment as "success" | "failed" | "cancelled");
      setMessage(msg || "");
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    // Clear the query params from the URL to avoid showing the modal again on refresh
    const params = new URLSearchParams(searchParams.toString());
    params.delete("payment");
    params.delete("message");
    const newQuery = params.toString();
    router.replace(newQuery ? `${pathname}?${newQuery}` : pathname);
  };

  if (!status) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border border-white/10 bg-card/90 backdrop-blur-xl shadow-2xl transition-all duration-500">
        
        {/* Accessibility screen-reader only title and description (removes console warnings and hides visual duplication) */}
        <DialogHeader className="sr-only">
          <DialogTitle>
            {status === "success" && "Enrollment Successful!"}
            {status === "failed" && "Payment Failed"}
            {status === "cancelled" && "Payment Cancelled"}
          </DialogTitle>
          <DialogDescription>
            {status === "success" && (
              message || "Your payment was processed successfully. You are now enrolled in the course."
            )}
            {status === "failed" && (
              message || "Something went wrong while executing the payment. Please try again or contact support."
            )}
            {status === "cancelled" && (
              "Your bkash payment process has been cancelled."
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Glow effect matching the payment status */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {status === "success" && (
            <div className="absolute -top-[30%] -left-[10%] w-[120%] h-[80%] rounded-full bg-emerald-500/10 blur-[60px]" />
          )}
          {status === "failed" && (
            <div className="absolute -top-[30%] -left-[10%] w-[120%] h-[80%] rounded-full bg-rose-500/10 blur-[60px]" />
          )}
          {status === "cancelled" && (
            <div className="absolute -top-[30%] -left-[10%] w-[120%] h-[80%] rounded-full bg-amber-500/10 blur-[60px]" />
          )}
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          {/* Animated Icon Container */}
          <div className="mb-6 relative">
            {status === "success" && (
              <>
                <div className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-md animate-pulse" />
                <div className="relative rounded-full bg-[#00bda6] p-4 text-white shadow-[0_8px_20px_-4px_rgba(0,189,166,0.4)] animate-bounce animate-duration-1000">
                  <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
                </div>
                <div className="absolute -top-1 -right-2 text-amber-400 animate-pulse">
                  <Sparkles className="h-5 w-5" />
                </div>
              </>
            )}
            {status === "failed" && (
              <>
                <div className="absolute -inset-2 rounded-full bg-rose-500/20 blur-md animate-pulse" />
                <div className="relative rounded-full bg-gradient-to-tr from-rose-500 to-red-600 p-4 text-white shadow-[0_8px_20px_-4px_rgba(244,63,94,0.4)] animate-pulse">
                  <XCircle className="h-10 w-10 stroke-[2.5]" />
                </div>
              </>
            )}
            {status === "cancelled" && (
              <>
                <div className="absolute -inset-2 rounded-full bg-amber-500/20 blur-md animate-pulse" />
                <div className="relative rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-4 text-white shadow-[0_8px_20px_-4px_rgba(245,158,11,0.4)] animate-pulse">
                  <AlertCircle className="h-10 w-10 stroke-[2.5]" />
                </div>
              </>
            )}
          </div>

          {/* Heading */}
          <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
            {status === "success" && "Enrollment Successful!"}
            {status === "failed" && "Payment Failed"}
            {status === "cancelled" && "Payment Cancelled"}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] sm:max-w-sm mb-8">
            {status === "success" && (
              message || "Your payment was processed successfully. You are now enrolled and ready to start your course."
            )}
            {status === "failed" && (
              message || "Something went wrong while processing your payment. Please try again or contact support."
            )}
            {status === "cancelled" && (
              "Your bKash payment has been cancelled."
            )}
          </p>

          {/* Actions */}
          <div className="w-full">
            {status === "success" ? (
              <Button
                onClick={() => {
                  handleClose();
                  router.push("/student/dashboard");
                }}
                className="w-full h-12 bg-[#00bda6] hover:bg-[#00bda6]/90 text-white font-semibold rounded-xl shadow-[0_4px_18px_rgba(0,189,166,0.3)] cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                onClick={handleClose}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
