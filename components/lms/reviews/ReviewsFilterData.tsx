import { getBatches } from "@/apiServices/batchService";
import { getStudents } from "@/apiServices/studentService";
import ReviewsFilter from "./ReviewsFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function ReviewsFilterData() {
  let batches = [];
  let students = [];

  try {
    const batchesRes = await getBatches({ per_page: 500 });
    batches = batchesRes?.data?.batches || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message={`Error fetching batches: ${error.message}`} />
        </div>
      );
    }

    return (
      <div className="py-8 md:py-12">
        <ErrorComponent message="An unknown error occurred while fetching batches." />
      </div>
    );
  }

  try {
    const studentsRes = await getStudents({ per_page: 500 });
    students = studentsRes?.data?.students || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message={`Error fetching students: ${error.message}`} />
        </div>
      );
    }

    return (
      <div className="py-8 md:py-12">
        <ErrorComponent message="An unknown error occurred while fetching students." />
      </div>
    );
  }

  return <ReviewsFilter batches={batches} students={students} />;
}