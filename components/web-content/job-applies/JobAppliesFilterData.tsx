import { getJobApplies } from "@/apiServices/jobAppliesService";
import JobAppliesFilter from "./JobAppliesFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function JobAppliesFilterData() {
    // Extract unique careers from first page of job applies for filter options
    let careers: { id: number; title: string }[] = [];

    try {
        const res = await getJobApplies({ per_page: 500 });
        const applies = res?.data?.applies || [];

        // Build unique career list from applies data
        const careerMap = new Map<number, string>();
        applies.forEach((apply) => {
            if (apply.career && !careerMap.has(apply.career.id)) {
                careerMap.set(apply.career.id, apply.career.title);
            }
        });
        careers = Array.from(careerMap.entries()).map(([id, title]) => ({
            id,
            title,
        }));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching filter data: ${error.message}`} />
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

    return <JobAppliesFilter careers={careers} />;
}
