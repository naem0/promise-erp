"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  EnrollmentsData,
  postEnrollmentSubmit,
} from "@/apiServices/studentEnrollmentService";
import { getElPaymentMethods } from "@/apiServices/studentDashboardService";

type PaymentGateway = {
  id: number;
  name: string;
  image?: string;
  type: number;
};

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
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentGateway | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const res = await getElPaymentMethods();
        if (!res || !res.success || !res.data) {
          console.warn("No payment methods data found.");
          return;
        }
        if (res?.data?.length === 0) {
          console.warn("Payment methods list is empty.");
        }else {
          setGateways(res?.data);
        }
      } catch (error:unknown) {
        if (error instanceof Error) {
          console.error("Error fetching payment methods:", error.message);
        }else {
          console.error("Unknown error occurred while fetching payment methods");
        }
      }
    };

    loadPaymentMethods();
  }, []);

  const handleSelectMethod = (method: PaymentGateway) => {
    if (method.name.toLowerCase() !== "pay later") {
      toast.info("Currently Pay Later is available. Please select Pay Later.");
      return;
    }
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

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
            payment_method: selectedMethod?.id,
            payment_type: 0, // 0 = full payment
            partial_payment_amount: 0,
          },
          token,
        );

        if (res.success) {
          toast.success(res?.data?.message || "Enrollment successful");
          router.push("/student/dashboard");
          // future redirect here
        } else {
          toast.error(res?.message || "Payment failed");
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

          <div className="space-y-3 mb-6">
            {gateways.map((gateway) => (
              
              <button
                type="button"
                key={gateway.id}
                onClick={() => handleSelectMethod(gateway)}
                className={`w-full h-14 rounded-lg flex items-center px-6 bg-white transition-all  ${
                  selectedMethod?.id === gateway.id
                    ? "ring-2 ring-primary ring-offset-2"
                    : "ring-2 ring-secondary"
                }`}
              >
                <span className="relative w-[200px] h-8 flex items-center justify-center">
                <Image
                  src={gateway?.image || "/images/default-payment.png"}
                  alt={gateway?.name}
                  fill
                  className="object-scale-down w-full"
                />
                </span>
              </button>
            ))}
          </div>

          <Button
            onClick={handleContinue}
            disabled={!selectedMethod || isPending}
            className="w-full capitalize"
          >
            {isPending
              ? "Processing..."
              : ` ${selectedMethod?.name ? selectedMethod?.name: "Pay Now"}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrollPaymentMethod;
