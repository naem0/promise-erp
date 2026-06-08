import { Suspense } from "react";
import CreateEnrollmentForm from "@/components/lms/enrollments/CreateEnrollmentForm";
import { getStudents } from "@/apiServices/studentService";
import { getBatches } from "@/apiServices/batchService";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function AddEnrollmentPage() {
  let students = [];
  let batches = [];

  try {
    const studentsRes = await getStudents({ per_page: 100 });
    students = studentsRes?.data?.students || [];
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load students.";

    return (
      <div className="mx-auto space-y-6">
        <ErrorComponent message={message} />
      </div>
    );
  }

  try {
    const batchesRes = await getBatches({ per_page: 999 });
    batches = batchesRes?.data?.batches || [];
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load batches.";

    return (
      <div className="mx-auto space-y-6">
        <ErrorComponent message={message} />
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6">
      <Suspense fallback={<div>Loading form...</div>}>
        <CreateEnrollmentForm
          students={students}
          batches={batches}
        />
      </Suspense>
    </div>
  );
}
