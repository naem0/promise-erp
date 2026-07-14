import {
  getInventoryUnitsStats,
  InventoryMiniStatsResponse,
} from "@/apiServices/inventoryItemsService";
import ErrorComponent from "../common/ErrorComponent";
import InventoryCommonSummary from "./InventoryCommonSummary";

const UnitsSummaryWrapper = async () => {
  let stats: InventoryMiniStatsResponse | null = null;

  try {
    stats = await getInventoryUnitsStats();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    console.error("Error fetching inventory units stats:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch units stats";
    return (
      <div className="py-10 xl:py-16">
        <ErrorComponent message={message} />
      </div>
    );
  }

  if (!stats) return null;

  return <InventoryCommonSummary data={stats?.data} />;
};

export default UnitsSummaryWrapper;
