import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { InvoiceActions } from "@/components/lms/invoices/InvoiceActions";
import { InvoiceStudentCard } from "@/components/lms/invoices/InvoiceStudentCard";
import { InvoiceCourseInfo } from "@/components/lms/invoices/InvoiceCourseInfo";
import { InvoiceTimeline } from "@/components/lms/invoices/InvoiceTimeline";
import { InvoicePaymentDetails } from "@/components/lms/invoices/InvoicePaymentDetails";
import { InvoiceTransactionHistory } from "@/components/lms/invoices/InvoiceTransactionHistory";
import { getInvoiceById } from "@/apiServices/invoiceService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface InvoiceDetailWrapperProps {
  params: Promise<{ id: string }>;
}

export async function InvoiceDetailWrapper({
  params,
}: InvoiceDetailWrapperProps) {
  const { id } = await params;
  let response;
  try {
    response = await getInvoiceById(Number(id));
  } catch (error: unknown) {
    console.error(`Error loading student invoice wrapper for ID `, error);
    if (error instanceof Error) {
      return (
        <div className="py-10 xl:py-16">
          <ErrorComponent message={error.message} />;
        </div>
      );
    }
    return (
      <div className="py-10 xl:py-16">
        <ErrorComponent message="Failed to load invoice details." />;
      </div>
    );
  }

  if (!response || !response.success) {
    return null;
  }
  const invoice = response?.data;
  if (!invoice) {
    return (
      <div className="py-10 xl:py-16">
        <NotFoundComponent
          title="Invoice"
          message={response?.message || " Not Found"}
        />
      </div>
    );
  }
  const mappedInvoiceData = invoice;
  return (
    <div className="p-6 space-y-6 print:p-0">
      {/* Dynamic styling to suppress dashboard navigation/sidebar when printing */}
      <style>{`
          @media print {
            [data-slot="sidebar"],
            [data-slot="sidebar-gap"],
            [data-slot="sidebar-rail"],
            aside,
            nav,
            header,
            footer,
            .no-print,
            button,
            a {
              display: none !important;
            }
            [data-slot="sidebar-inset"],
            main,
            [data-slot="sidebar-inset"] > div,
            main > div,
            [data-slot="sidebar-provider"] {
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              min-width: 100% !important;
              flex: 1 1 100% !important;
              background: white !important;
              box-shadow: none !important;
              height: auto !important;
              max-height: none !important;
              min-height: auto !important;
              overflow: visible !important;
              display: block !important;
            }
            body, html {
              background-color: white !important;
              width: 100% !important;
              height: auto !important;
              min-height: auto !important;
              overflow: visible !important;
            }
            .print-card {
              border: 1px solid #e2e8f0 !important;
              box-shadow: none !important;
              background-color: white !important;
              page-break-inside: avoid !important;
            }
          }
        `}</style>

      {/* Header section (hidden during print) */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-2 no-print">
        <div>
          <Link
            href="/student/invoices"
            className="flex items-center gap-1 text-gray-500 hover:text-black transition text-sm font-medium mb-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
          <p className="text-gray-500 text-sm">View student invoice</p>
        </div>
        <InvoiceActions invoiceId={id} invoiceData={mappedInvoiceData} />
      </div>

      {/* Student Profile Info Card */}
      <InvoiceStudentCard
        student={invoice?.user}
        invoiceId={invoice?.invoice_no}
      />

      {/* Row 1: Course Info & Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:gap-6">
        <InvoiceCourseInfo
          course={invoice?.batch}
          branchName={invoice?.branch_name}
          enrollmentDate={invoice?.enrollment_date}
        />
        <InvoiceTimeline timeline={invoice?.payment_timeline} />
      </div>

      {/* Row 2: Payment Details & Transaction History */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:gap-6">
        <InvoicePaymentDetails payment={invoice} />
        <InvoiceTransactionHistory transactions={invoice?.payment_histories} />
      </div>
    </div>
  );
}
