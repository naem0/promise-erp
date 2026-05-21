"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  EnrollmentsData,
  postEnrollmentSubmit,
} from "@/apiServices/studentEnrollmentService";
import { PaymentMethod, getElPaymentMethods } from "@/apiServices/studentDashboardService";

interface Props {
  enrollmentDetails: EnrollmentsData;
  savedCouponCode: string | null;
  token?: string;
}

const EnrollPaymentMethod = ({
  enrollmentDetails,
  savedCouponCode,
  token,
}: Props) => {
  const [gateways, setGateways] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [partialAmount, setPartialAmount] = useState("");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // type === 1 → Pay Later
  const isPayLater = selectedMethod?.type === 1;
  // Show partial_payment_amount for everyone except Pay Later
  const showPartialAmount = selectedMethod && !isPayLater;
  // Show payment_number & transaction_id only when NOT Pay Later
  const showNumberFields = selectedMethod && !isPayLater;

  useEffect(() => {
    // Reset extra fields whenever method changes
    setPartialAmount("");
    setPaymentNumber("");
    setTransactionId("");
    setFieldErrors({});
  }, [selectedMethod]);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const res = await getElPaymentMethods();
        if (!res || !res.success || !res.data) {
          console.warn("No payment methods data found.");
          return;
        }
        if (res.data.length === 0) {
          console.warn("Payment methods list is empty.");
        } else {
          setGateways(res.data);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching payment methods:", error.message);
        } else {
          console.error("Unknown error occurred while fetching payment methods");
        }
      }
    };

    loadPaymentMethods();
  }, []);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return false;
    }

    if (showPartialAmount && !partialAmount.trim()) {
      errors.partial_payment_amount = "Payment amount is required";
    }

    if (showNumberFields) {
      if (!paymentNumber.trim()) {
        errors.payment_number = "Payment number is required";
      }
      if (!transactionId.trim()) {
        errors.transaction_id = "Transaction ID is required";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    if (!token) {
      toast.error("Authentication required");
      return;
    }

    startTransition(async () => {
      try {
        const res = await postEnrollmentSubmit(
          {
            batch_id: enrollmentDetails.batch.id,
            coupon_code: savedCouponCode,
            payment_method: selectedMethod!.id,
            payment_type: isPayLater ? 0 : 2, // 0=no payment(pay later), 2=full payment
            partial_payment_amount: showPartialAmount ? Number(partialAmount) : null,
            payment_number: showNumberFields ? paymentNumber : null,
            transaction_id: showNumberFields ? transactionId : null,
          },
          token,
        );

        if (res.success) {
          toast.success(res?.data?.message || "Enrollment successful");
          router.push("/student/dashboard");
        } else {
          if (res.errors) {
            const apiFieldErrors: Record<string, string> = {};
            Object.entries(res.errors).forEach(([key, messages]) => {
              apiFieldErrors[key] = Array.isArray(messages) ? messages[0] : messages;
            });
            setFieldErrors(apiFieldErrors);
          } else {
            toast.error(res?.message || "Payment failed");
          }
        }
      } catch (error: unknown) {
        console.log("Enrollment submission failed", error);
        toast.error("Enrollment submission failed");
      }
    });
  };

  return (
    <Card className="py-0">
      <CardContent className="p-6">
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="text-2xl font-semibold text-secondary mb-4">
            Payment Method
          </h2>

          <p className="text-secondary mb-4">Select Payment Method</p>

          {/* Payment method list */}
          <div className="space-y-3 mb-6">
            {gateways.filter((g) => g.name.toLowerCase() !== "cash").map((gateway) => (
              <button
                type="button"
                key={gateway.id}
                onClick={() => setSelectedMethod(gateway)}
                className={`w-full h-14 rounded-lg flex items-center px-6 bg-white transition-all ${selectedMethod?.id === gateway.id
                  ? "ring-2 ring-primary ring-offset-2"
                  : "ring-2 ring-secondary"
                  }`}
              >
                {gateway.image ? (
                  <span className="relative w-[200px] h-8 flex items-center justify-center">
                    <Image
                      src={gateway.image}
                      alt={gateway.name}
                      fill
                      className="object-scale-down w-full"
                    />
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-gray-700">
                    {gateway.name}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Extra fields based on selected method */}
          {selectedMethod && (
            <div className="space-y-4 mb-6">

              {/* partial_payment_amount — Pay Later বাদে সবার জন্য */}
              {showPartialAmount && (
                <div className="grid gap-1">
                  <Label htmlFor="partial_payment_amount">
                    Payment Amount <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="partial_payment_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter payment amount"
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                  />
                  {fieldErrors.partial_payment_amount && (
                    <span className="text-xs text-red-500">
                      {fieldErrors.partial_payment_amount}
                    </span>
                  )}
                </div>
              )}

              {/* payment_number & transaction_id — Pay Later ও Cash বাদে */}
              {showNumberFields && (
                <>
                  <div className="grid gap-1">
                    <Label htmlFor="payment_number">
                      Payment Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="payment_number"
                      type="text"
                      placeholder="Enter sender mobile number"
                      value={paymentNumber}
                      onChange={(e) => setPaymentNumber(e.target.value)}
                    />
                    {fieldErrors.payment_number && (
                      <span className="text-xs text-red-500">
                        {fieldErrors.payment_number}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-1">
                    <Label htmlFor="transaction_id">
                      Transaction ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="transaction_id"
                      type="text"
                      placeholder="Enter gateway transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                    {fieldErrors.transaction_id && (
                      <span className="text-xs text-red-500">
                        {fieldErrors.transaction_id}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <Button
            onClick={handleContinue}
            disabled={!selectedMethod || isPending}
            className="w-full capitalize"
          >
            {isPending
              ? "Processing..."
              : `${selectedMethod?.name ? selectedMethod.name : "Pay Now"}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrollPaymentMethod;
