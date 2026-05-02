import { getBranches } from "@/apiServices/branchService";
import { getCourses } from "@/apiServices/courseService";
import { getBatches } from "@/apiServices/batchService";
import EnrollmentReportsFilter from "./EnrollmentReportsFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function EnrollmentReportsFilterData() {
    let branchesRes;
    let coursesRes;
    let batchesRes;
    let branches;
    let courses;
    let batches;

    try {
         branchesRes = await getBranches({ per_page: 500 });
        branches = branchesRes?.data?.branches || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`Error fetching branches: ${error.message}`} />
          </div>);
        } else {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`An unknown error occurred while fetching branches.`} />
          </div>);
      }
    }

    try {
         coursesRes = await getCourses({ per_page: 500 });
        courses = coursesRes?.data?.courses || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`Error fetching courses: ${error.message}`} />
          </div>);
        } else {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`An unknown error occurred while fetching courses.`} />
          </div>);
        }
    }

    try {
         batchesRes = await getBatches({ per_page: 500 });
        batches = batchesRes?.data?.batches || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`Error fetching batches: ${error.message}`} />
          </div>);
        } else {
          return (<div className="py-8 md:py-12">
              <ErrorComponent message={`An unknown error occurred while fetching batches.`} />
          </div>);
        }
    }

    return (
        <EnrollmentReportsFilter
            branches={branches}
            courses={courses}
            batches={batches}
        />
    );
}
