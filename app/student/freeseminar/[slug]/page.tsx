"use client";

// import FreeClassBySlugWrapper from "@/components/student-dashboard/FreeClassBySlugWrapper";
import dynamic from 'next/dynamic';
const FreeClassBySlugWrapper = dynamic(() => import("@/components/student-dashboard/FreeClassBySlugWrapper"), {
  ssr: false,
});
const FreeClassDetailsPage = () => {
  return (
    <section className="py-6 px-4">
        <FreeClassBySlugWrapper />
    </section>
  );
};

export default FreeClassDetailsPage;
