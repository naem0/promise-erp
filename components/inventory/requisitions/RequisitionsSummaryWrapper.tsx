import { getInventoryRequisitionStats, InventoryMiniStatsResponse } from "@/apiServices/inventoryItemsService";
import ErrorComponent from "@/components/common/ErrorComponent";
import InventoryCommonSummary from "../InventoryCommonSummary";


const RequisitionsSummaryWrapper = async () => {
  let stats: InventoryMiniStatsResponse | null = null;

  try {
    stats = await getInventoryRequisitionStats();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    console.error("Error fetching inventory group items stats:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch group items stats";
    return (
      <div className="py-10 xl:py-16">
        <ErrorComponent message={message} />
      </div>
    );
  }

  if (!stats) return null;

  return <InventoryCommonSummary data={stats?.data} />;
}

export default RequisitionsSummaryWrapper
