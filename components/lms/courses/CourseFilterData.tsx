import { getBranches } from "@/apiServices/branchService";
import { getCategories } from "@/apiServices/categoryService";
import CourseFilter from "./CourseFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function CourseFilterData() {
  let branchesRes = null;
  let categoriesRes = null;

  try {
    branchesRes = await getBranches({ per_page: 100 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unknown error occurred." />;
    }
  }

  try {
    categoriesRes = await getCategories({ per_page: 100 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unknown error occurred." />;
    }
  }

  if (
    !branchesRes ||
    !branchesRes.success ||
    !categoriesRes.success ||
    !categoriesRes
  ) {
    return <ErrorComponent message="Failed to fetch branches or categories." />;
  }

  return (
    <CourseFilter
      branches={branchesRes?.data?.branches ?? []}
      categories={categoriesRes?.data?.categories ?? []}
    />
  );
}
