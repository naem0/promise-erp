import JobAppliesForm from "@/components/web-content/job-applies/JobAppliesForm";
import {
  getJobApplyById,
  getJobApplies,
} from "@/apiServices/jobAppliesService";
import ErrorComponent from "@/components/common/ErrorComponent";
import { notFound } from "next/navigation";

export default async function EditJobApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  let jobApply;
  try {
    const res = await getJobApplyById(Number(id));
    if (!res.success || !res.data) {
      return notFound();
    }
    jobApply = res.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="Failed to load job application." />;
    }
  }

  return (
    <div className="mx-auto">
      <JobAppliesForm
        title="Edit Job Application"
        jobApply={jobApply}
        careers={careers}
      />
    </div>
  );
}
