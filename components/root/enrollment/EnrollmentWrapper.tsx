"use client";

import { useState, useTransition, useEffect } from "react";
import EnrollPaymentSummary from "./EnrollPaymentSummary";
import EnrollPaymentMethod from "./EnrollPaymentMethod";
import { toast } from "sonner";
import EnrollmentWrapperSkeleton from "./EnrollmentWrapperSkeleton";
import { useSession } from "next-auth/react";
import {
  EnrollmentResponse,
  getEnrollmentDetails,
  postEnrollmentCoupon,
} from "@/apiServices/studentEnrollmentService";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface Props {
  slug: string;
}

const EnrollmentWrapper = ({ slug }: Props) => {
  const [enrollmentDetails, setEnrollmentDetails] =
    useState<EnrollmentResponse | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [savedCouponCode, setSavedCouponCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  // Fetch enrollment details
  const fetchEnrollment = async () => {
    const token = session?.accessToken;
    if (!token) return;

    startTransition(async () => {
      try {
        const res = await getEnrollmentDetails(slug, token);
        if (!res || !res.success || !res.data) {
          return;
        }

        if (res?.success) {
          setEnrollmentDetails(res);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching enrollment details:", error.message);
        }
      }
    });
  };

  useEffect(() => {
    if (session?.accessToken && slug) {
      fetchEnrollment();
    }
  }, [slug]);

  // Handle coupon apply
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const token = session?.accessToken;
    if (!token || !enrollmentDetails) {
      toast.error("Authentication required");
      return;
    }

    startTransition(async () => {
      try {
        const res = await postEnrollmentCoupon(
          enrollmentDetails!.data.batch.id,
          couponCode,
          token,
        );
        if (res.success && res.data.valid) {
          toast.success(res.message);
          setSavedCouponCode(res.data.coupon.coupon_code);
          setCouponCode("");
          fetchEnrollment();
        } else {
          toast.error(res?.message || "Invalid coupon code");
        }
      } catch (error) {
        console.error("Coupon validation failed:", error);
        toast.error("Coupon validation failed");
      }
    });
  };

  return isPending ? (
    <EnrollmentWrapperSkeleton />
  ) : enrollmentDetails?.data ? (
    <div className="grid lg:grid-cols-[1.8fr_1fr] gap-4 mb-8 relative">
      <EnrollPaymentSummary
        enrollmentDetails={enrollmentDetails.data}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        handleApplyCoupon={handleApplyCoupon}
        isApplying={isPending}
      />

      <EnrollPaymentMethod
        enrollmentDetails={enrollmentDetails.data}
        savedCouponCode={savedCouponCode}
        token={session?.accessToken}
      />
    </div>
  ) : (
    <NotFoundComponent
      message={enrollmentDetails?.message || "Enrollment details not found"}
    />
  );
};

export default EnrollmentWrapper;
