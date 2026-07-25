import { CategoryStockSummary } from "@/apiServices/inventoryreportService";

interface CategoryStockSummaryTableProps {
  summaryList?: CategoryStockSummary[];
}

export default function CategoryStockSummaryTable({
  summaryList = [],
}: CategoryStockSummaryTableProps) {
  if (!summaryList || summaryList.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-4 print:shadow-none print:border-slate-300 print:p-3">
      <h3 className="text-base font-bold text-slate-800 tracking-tight">
        Category Stock Summary
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Total Stock</th>
              <th className="py-3 px-4 text-center">Active</th>
              <th className="py-3 px-4 text-center">Damaged</th>
              <th className="py-3 px-4 text-center">Damage %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {summaryList.map((item) => (
              <tr
                key={item.id || item.category}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-slate-800">
                  {item.category}
                </td>
                <td className="py-3 px-4 text-center font-medium">
                  {item.total_stock}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                    {item.active}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.damaged > 0
                        ? "bg-rose-50 text-rose-600"
                        : "text-slate-400"
                    }`}
                  >
                    {item.damaged}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-medium">
                  <span
                    className={
                      item.damage_percent > 0
                        ? "text-rose-600 font-semibold"
                        : "text-slate-500"
                    }
                  >
                    {item.damage_percent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
