import { Suspense } from "react";
import BatchForm from "@/components/lms/batches/BatchForm";

const BatchAddPage = () => {
  return (
    <Suspense fallback={<div className="h-40 w-full bg-muted animate-pulse rounded-xl" />}>
      <BatchForm title="Add Batch"/>
    </Suspense>
  );
};

export default BatchAddPage;
