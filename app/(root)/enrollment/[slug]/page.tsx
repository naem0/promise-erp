"use client";

import SupportContact from "@/components/root/enrollment/SupportContact";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import PaymentStatusPrompt from "@/components/student-dashboard/PaymentStatusPrompt";

const EnrollmentClientLoader = dynamic(() => import('@/components/root/enrollment/EnrollmentClientLoader'), { ssr: false })
const EnrollmentPage = () => {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  return (
    <>
      <section className="bg-secondary/5 py-8 md:py-14">
        <div className="container mx-auto px-4">
          <EnrollmentClientLoader slug={slug} />
          <SupportContact />
        </div>
      </section>
      <Suspense fallback={null}>
        <PaymentStatusPrompt />
      </Suspense>
    </>
  );
};

export default EnrollmentPage;
