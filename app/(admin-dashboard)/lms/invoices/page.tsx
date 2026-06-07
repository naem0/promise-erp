import { Suspense } from "react";
import { InvoicesContent } from "@/components/lms/invoices/InvoicesContent";
import { InvoicesLoading } from "@/components/lms/invoices/InvoicesLoading";

interface InvoicesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InvoicesPage( {
  searchParams,
}: InvoicesPageProps) {

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Invoice Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all student invoices</p>
        </div>
      </div>

      <Suspense fallback={<InvoicesLoading />}>
        <InvoicesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
