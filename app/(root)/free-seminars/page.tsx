import LoadingSkeleton from "@/components/common/DashboardLoadingSkeleton";
import FreeSeminarGrid from "@/components/root/free-seminars/FreeSeminarGrid";
import { Suspense } from "react";

export interface FreeSeminarsParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const FreeSeminarsPage = ({ searchParams }: FreeSeminarsParams) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-secondary mb-6">
          Free Seminars
        </h2>
        <Suspense
          fallback={
            <LoadingSkeleton />
          }
        >
          <FreeSeminarGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
};

export default FreeSeminarsPage;
