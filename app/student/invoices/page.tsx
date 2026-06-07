import { Suspense } from "react";
import { InvoicesContent } from "@/components/lms/invoices/InvoicesContent";
import { InvoicesLoading } from "@/components/lms/invoices/InvoicesLoading";

export const metadata = {
  title: "Invoices | Promise ERP",
};

interface InvoicesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StudentInvoicesPage({
  searchParams,
}: InvoicesPageProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">My Invoices</h1>
          <p className="text-black/65 text-sm mt-1">View and track all your invoices</p>
        </div>
      </div>

      <Suspense fallback={<InvoicesLoading showSummary={false} />}>
        <InvoicesContent
          searchParams={searchParams}
          basePath="/student/invoices"
          showSummaryCards={false}
        />
      </Suspense>
    </div>
  );
}
