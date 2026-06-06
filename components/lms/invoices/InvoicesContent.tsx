import { getInvoices } from "@/apiServices/invoiceService";
import ErrorComponent from "@/components/common/ErrorComponent";
import { InvoiceSummaryCards } from "@/components/lms/invoices/InvoiceSummaryCards";
import { InvoiceTable } from "@/components/lms/invoices/InvoiceTable";
import InvoicesFilterData from "./InvoicesFilterData";

interface InvoicesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  basePath?: string;
  showSummaryCards?: boolean;
}

export async function InvoicesContent({
  searchParams,
  basePath = "/lms/invoices",
  showSummaryCards = true,
}: InvoicesPageProps) {
  const queryParams = await searchParams;
  const page = typeof queryParams.page === "string" ? Number(queryParams.page) : 1;
  const per_page = typeof queryParams.per_page === "string" ? Number(queryParams.per_page) : 15;
  const params = {
    page,
    per_page,
    search:
      typeof queryParams.search === "string"
        ? queryParams.search
        : undefined,
    branch_id:
      typeof queryParams.branch_id === "string"
        ? queryParams.branch_id
        : undefined,
    status:
      typeof queryParams.status === "string"
        ? queryParams.status
        : undefined,
    payment_method:
      typeof queryParams.payment_method === "string"
        ? queryParams.payment_method
        : undefined,
    organization_id:
      typeof queryParams.organization_id === "string"
        ? queryParams.organization_id
        : undefined,
    user_id:
      typeof queryParams.user_id === "string"
        ? queryParams.user_id
        : undefined,
    enrollment_id:
      typeof queryParams.enrollment_id === "string"
        ? queryParams.enrollment_id
        : undefined,
    date_from:
      typeof queryParams.date_from === "string"
        ? queryParams.date_from
        : undefined,
    date_to:
      typeof queryParams.date_to === "string"
        ? queryParams.date_to
        : undefined,
    sort_by:
      typeof queryParams.sort_by === "string"
        ? queryParams.sort_by
        : undefined,
  };
 let response;
  try {
    response = await getInvoices(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <div className="py-8 lg:py-12">
        <ErrorComponent message={error.message} />
      </div>;
    } else {
      return <div className="py-8 lg:py-12">
        <ErrorComponent message="An unknown error occurred." />
      </div>;
    }
  }

  if (!response || !response.success) {
    return null;
  }

  return (
    <>
      {showSummaryCards && <InvoiceSummaryCards summary={response?.data?.summary} />}
      <InvoicesFilterData />
      <InvoiceTable data={response} basePath={basePath} />
    </>
  );
}
