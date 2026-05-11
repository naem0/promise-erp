"use client";

import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { checkBatchEnrollment } from "@/apiServices/courseDetailPublicService";

interface EnrollButtonProps {
  slug: string;
  batchId: number;
}

const EnrollButton = ({ slug, batchId }: EnrollButtonProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!session?.accessToken || !batchId) return;

    startTransition(async () => {
      try {
        const res = await checkBatchEnrollment(batchId);
        setIsEnrolled(res.data?.is_enrolled ?? false);
      } catch {
        setIsEnrolled(false);
      }
    });
  }, [session?.accessToken, batchId]);

  const handleClick = () => {
    const branchId = searchParams.get("branch_id");
    const enrollmentUrl = branchId 
      ? `/enrollment/${slug}?branch_id=${branchId}`
      : `/enrollment/${slug}`;

    if (!session?.accessToken) {
      router.push(`/login?redirect=${enrollmentUrl}`);
      return;
    }

    if (isEnrolled) {
      router.push("/student/dashboard");
      return;
    }

    router.push(enrollmentUrl);
  };

  if (status === "loading") return null;

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className="max-w-full w-full sm:w-[350px] cursor-pointer"
    >
      {isEnrolled ? "Continue Course" : "Enroll Now"}
    </Button>
  );
};

export default EnrollButton;
