import { getPublicWebBranches, WebBranch } from "@/apiServices/branchService";
import ErrorComponent from "@/components/common/ErrorComponent";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import AboutBranchList from "./AboutBranchList";
import AboutBranchSkeleton from "./AboutBranchSkeleton";
import NotFoundComponent from "@/components/common/NotFoundComponent";

const AboutBranch = async () => {
  let branchList;
  try {
    // Fetch branches
    branchList = await getPublicWebBranches();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unexpected error occurred." />
        </div>
      );
    }
  }

  const branches = branchList?.data || [];
  if (!branchList || !branchList?.success) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="pb-6">
        <h2 className="text-2xl lg:text-4xl text-secondary font-bold tracking-tight mb-4">
          Our Branches
        </h2>
        <p>
          We{"’"}re proud to collaborate with leading government and private
          organizations.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <AboutBranchSkeleton key={i} />
            ))}
          </div>
        }
      >
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches?.length > 0 ? (
            branches[2]?.branches
              ?.slice(0, 4)
              .map((branch: WebBranch) => (
                <AboutBranchList key={branch.id} branchInfo={branch} />
              ))
          ) : (
            <div className="py-8 md:py-12">
              <NotFoundComponent
                message={branchList?.message || "No branches found"}
              />
            </div>
          )}
        </div>
      </Suspense>
      <div className="pt-8 flex justify-center">
        <Button asChild>
          <Link href="/branch" prefetch={true}>
            View All Branches
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default AboutBranch;
