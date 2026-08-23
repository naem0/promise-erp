import SectionTitle from "@/components/common/SectionTitle";
import OurBranches from "./OurBranches";
import { getHomePageAllBranches } from "@/apiServices/homePageService";
import { cacheTag } from "next/cache";
import ErrorComponent from "@/components/common/ErrorComponent";
import { CACHE_TAGS } from "@/constants/cacheTags";

const OurBranchesWrapper = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.BRANCHES);

  let branches;
  try {
    branches = await getHomePageAllBranches();
  } catch (error: unknown) {
    console.error("Error fetching branches:", error);
    if (error instanceof Error) {
      console.error("Error fetching branches:", error.message);
      return (
        <div className="text-center text-red-500">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="text-center text-red-500">
          <ErrorComponent message="An unexpected error occurred." />
        </div>
      );
    }
  }

  if (!branches || !branches?.data || branches?.data?.branches?.length === 0) {
    return null;
  }

  return (
    <section className="py-8 lg:py-14 bg-secondary/5">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={branches?.data?.section_title}
          subtitle={branches?.data?.section_subtitle}
          iswhite={false}
        />
        <OurBranches branchesData={branches} />
      </div>
    </section>
  );
};

export default OurBranchesWrapper;
