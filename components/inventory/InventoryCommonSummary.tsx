import { InventoryDashboardStat } from "@/apiServices/inventoryItemsService";
import {
  Package,
  ClipboardList,
  Clock3,
  Truck,
  Boxes,
  LayoutGrid,
  BarChart2,
  ShoppingCart,
} from "lucide-react";

// Icon & gradient pools — cards pick by index automatically
const iconPool = [ClipboardList, Clock3, Truck, Package, Boxes, LayoutGrid, BarChart2, ShoppingCart];
const gradientPool = [
  "from-[#1E60F2] to-[#1242BD]",
  "from-[#8B5CF6] to-[#6D28D9]",
  "from-[#EA580C] to-[#9A3412]",
  "from-[#4F46E5] to-[#312E81]",
  "from-[#0EA5E9] to-[#0D9488]",
  "from-[#059669] to-[#065F46]",
  "from-[#DC2626] to-[#991B1B]",
  "from-[#D97706] to-[#92400E]",
];

interface Props {
  data: InventoryDashboardStat[];
}

const InventoryCommonSummary = ({ data }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {data.map((item, index) => {
        const Icon = iconPool[index % iconPool.length];
        const gradient = gradientPool[index % gradientPool.length];
        const metricEntries = Object.entries(item?.metrics);

        return (
          <div
            key={index}
            className={`text-white rounded-[22px] p-5 flex flex-col shadow-sm relative overflow-hidden bg-gradient-to-br ${gradient} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/15 rounded-xl backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-[16px] text-white tracking-wide">
                {item?.card_name}
              </h3>
            </div>

            {/* Stats — fully dynamic from API metrics keys */}
            <div className="flex gap-2.5 mt-2 relative z-10">
              {metricEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col border border-white/15 rounded-[14px] py-2.5 px-3.5 bg-white/10 flex-1 backdrop-blur-sm"
                >
                  <span className="text-[10px] font-semibold text-white/75 uppercase tracking-wider mb-1">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="text-2xl font-extrabold tracking-tight text-white leading-none">
                    {value || 0}
                  </span>
                </div>
              ))}
            </div>

            {/* Background Icon */}
            <Icon
              strokeWidth={1.2}
              className="absolute -right-4 -bottom-4 w-24 h-24 opacity-15 text-white z-0 pointer-events-none group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 ease-out"
            />
          </div>
        );
      })}
    </div>
  );
};

export default InventoryCommonSummary;
