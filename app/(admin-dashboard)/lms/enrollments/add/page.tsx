import { Suspense } from "react";
import CreateEnrollmentForm from "@/components/lms/enrollments/CreateEnrollmentForm";
import { getStudents } from "@/apiServices/studentService";
import { getBatches } from "@/apiServices/batchService";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function AddEnrollmentPage() {
  console.log("AddEnrollmentPage: Rendering...");
  try {
    // Load all data server-side - per_page max is 100 for students
    const [studentsRes, batchesRes] = await Promise.all([
      getStudents({ per_page: 100 }),
      getBatches({ per_page: 999 }),
    ]);

    const students = studentsRes.data?.students || [];
    const batches = batchesRes.data?.batches || [];

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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred while loading data.";
    return (
      <div className="mx-auto space-y-6">
        <ErrorComponent message={errorMessage} />
      </div>
    );
  }
}
