import {
  getInventoryBranches,
  getBranchInventoryDetail,
  InventoryReportBranch,
} from "@/apiServices/inventoryreportService";
import BranchSidebarList from "./BranchSidebarList";
import InventoryReportSummary from "./InventoryReportSummary";
import CategoryStockSummaryTable from "./CategoryStockSummaryTable";
import ItemRegisterTable from "./ItemRegisterTable";
import InventoryReportFilterData from "./InventoryReportFilterData";
import ErrorComponent from "@/components/common/ErrorComponent";
import { Suspense } from "react";

interface InventoryReportsDataProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InventoryReportsData({
  searchParams,
}: InventoryReportsDataProps) {
  const queryParams = await searchParams;

  const search =
    typeof queryParams?.search === "string" ? queryParams.search : undefined;

  let branches: InventoryReportBranch[] = [];
  try {
    const branchesRes = await getInventoryBranches();
    branches = branchesRes?.data?.branches || [];
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    console.error("Error fetching branches:", error);
  }

  // Determine active branch ID and build params object
  const selectedBranchId =
    typeof queryParams?.branch_id === "string"
      ? queryParams.branch_id
      : branches.length > 0
      ? String(branches[0].id)
      : "";

  const params = {
    branch_id: selectedBranchId,
    category_id:
      typeof queryParams?.category_id === "string" ? queryParams.category_id : undefined,
    room_id:
      typeof queryParams?.room_id === "string" ? queryParams.room_id : undefined,
    is_store:
      typeof queryParams?.is_store === "string" ? queryParams.is_store : undefined,
    search,
    page:
      typeof queryParams?.page === "string" ? queryParams.page : undefined,
    per_page:
      typeof queryParams?.per_page === "string" ? queryParams.per_page : undefined,
  };

  let branchDetail = null;
  let detailError = null;

  if (selectedBranchId) {
    try {
      const detailRes = await getBranchInventoryDetail(params);
      branchDetail = detailRes?.data || null;
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "digest" in error) throw error;
      detailError =
        error instanceof Error ? error.message : "Failed to load branch detail report.";
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-start gap-3 print:block print:w-full print:max-w-none print:m-0 print:p-0 print:space-y-4">
      {/* Left Branch Sidebar List */}
      <BranchSidebarList branches={branches} />

      {/* Right Main Detail Content */}
      <div className="flex-1 w-full p-3 rounded-lg border border-amber-100 bg-white space-y-2 min-w-0 print:w-full print:max-w-none print:m-0 print:p-0 print:space-y-4 print:block">
        {detailError ? (
          <div className="py-8">
            <ErrorComponent message={detailError} />
          </div>
        ) : (
          <>
            {/* Top Summary Banner */}
            <InventoryReportSummary summary={branchDetail?.branch_summary} />

            {/* Filter Bar */}
            <Suspense
              fallback={
                <div className="h-28 w-full animate-pulse bg-slate-100 rounded-xl" />
              }
            >
              <InventoryReportFilterData />
            </Suspense>

            {/* Category Stock Summary */}
            <CategoryStockSummaryTable
              summaryList={branchDetail?.category_stock_summary}
            />

            {/* Item Register Table */}
            <ItemRegisterTable
              items={branchDetail?.item_register}
              pagination={branchDetail?.pagination}
            />
          </>
        )}
      </div>
    </div>
  );
}
