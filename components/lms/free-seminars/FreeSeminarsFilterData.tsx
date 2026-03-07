import { getBranches } from "@/apiServices/branchService";
import { getCategories } from "@/apiServices/categoryService";
import FreeSeminarsFilter from "./FreeSeminarsFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function FreeSeminarsFilterData() {
  let branches;
  let categories;

  try {
    const branchesRes = await getBranches({ per_page: 999 });
    branches = branchesRes?.data?.branches || [];
  } catch (error: unknown) {
    console.error("Branches error:", error);
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    }
    else {
      return <ErrorComponent message="An unknown error occurred while fetching branches." />;
    }
  }

  try {
    const categoriesRes = await getCategories({ per_page: 999 });
    categories = categoriesRes?.data?.categories || [];
  } catch (error: unknown) {
    console.error("Categories error:", error);
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    }
    else {
      return <ErrorComponent message="An unknown error occurred while fetching categories." />;
    }
  }
  return <FreeSeminarsFilter branches={branches} categories={categories} />;

}
