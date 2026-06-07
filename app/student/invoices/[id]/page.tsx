import { Suspense } from "react";
import { InvoiceDetailWrapper } from "../invoice-detail-wrapper";
import InvoiceDetailFallback from "@/components/lms/invoices/InvoiceDetailFallback";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentInvoiceDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<InvoiceDetailFallback />}>
      <InvoiceDetailWrapper params={params} />
    </Suspense>
  );
}
