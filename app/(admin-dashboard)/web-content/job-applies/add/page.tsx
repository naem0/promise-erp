import JobAppliesForm from "@/components/web-content/job-applies/JobAppliesForm";
import { getJobApplies } from "@/apiServices/jobAppliesService";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function AddJobApplyPage() {
  let careers;
  try {
    const res = await getJobApplies({ per_page: 500 });
    const applies = res?.data?.applies || [];
    const careerMap = new Map<number, { id: number; title: string }>();

    applies.forEach((apply) => {
      if (apply.career) {
        careerMap.set(apply.career.id, {
          id: apply.career.id,
          title: apply.career.title,
        });
      }
    });

    careers = Array.from(careerMap.values());
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent
            message={`Error fetching filter data: ${error.message}`}
          />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unknown error occurred while fetching filter data." />
        </div>
      );
    }
  }

  return (
    <div className="mx-auto">
      <JobAppliesForm title="Add Job Application" careers={careers} />
    </div>
  );
}
