import { ItemRegister } from "@/apiServices/inventoryreportService";
import { PaginationType } from "@/types/pagination";
import Pagination from "@/components/common/Pagination";

interface ItemRegisterTableProps {
  items?: ItemRegister[];
  pagination?: PaginationType;
}

interface CategoryGroup {
  categoryName: string;
  items: ItemRegister[];
}

function groupItemsByCategory(items: ItemRegister[]): CategoryGroup[] {
  const groups: CategoryGroup[] = [];
  let currentGroup: CategoryGroup | null = null;

  for (const item of items) {
    const catName = item.category || "Uncategorized";
    if (!currentGroup || currentGroup.categoryName !== catName) {
      currentGroup = { categoryName: catName, items: [item] };
      groups.push(currentGroup);
    } else {
      currentGroup.items.push(item);
    }
  }

  return groups;
}

export default function ItemRegisterTable({
  items = [],
  pagination,
}: ItemRegisterTableProps) {
  const categoryGroups = groupItemsByCategory(items);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden print:shadow-none print:border-slate-300">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold text-slate-600">Category</th>
              <th className="py-3 px-4 font-semibold text-slate-600">Barcode</th>
              <th className="py-3 px-4 font-semibold text-slate-600">Item Name</th>
              <th className="py-3 px-4 font-semibold text-slate-600 text-center">Group</th>
              <th className="py-3 px-4 font-semibold text-slate-600">Room / Lab</th>
              <th className="py-3 px-4 font-semibold text-slate-600 text-center">Stock</th>
              <th className="py-3 px-4 font-semibold text-slate-600 text-center">Active</th>
              <th className="py-3 px-4 font-semibold text-slate-600 text-center">Damage</th>
              <th className="py-3 px-4 font-semibold text-slate-600 text-right">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-8 text-center text-slate-400 text-sm"
                >
                  No items found for the selected branch / filter.
                </td>
              </tr>
            ) : (
              categoryGroups.map((group, groupIdx) =>
                group.items.map((item, itemIdx) => {
                  const isFirstInGroup = itemIdx === 0;

                  return (
                    <tr
                      key={`${item.barcode || itemIdx}-${groupIdx}-${itemIdx}`}
                      className="hover:bg-slate-50/70 transition-colors border-b border-slate-100"
                    >
                      {isFirstInGroup && (
                        <td
                          rowSpan={group.items.length}
                          className="py-3 px-4 font-bold text-slate-800 text-sm align-middle bg-white border-r border-slate-100/80"
                        >
                          {group.categoryName}
                        </td>
                      )}
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">
                        {item.barcode || "—"}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {item.item_name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.group ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/50">
                            {item.group}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-xs">
                        {item.room_lab || "—"}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-slate-700">
                        {item.total ?? 0}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-600">
                        {item.active ?? 0}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-rose-500">
                        {item.damaged ?? 0}
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-slate-400">
                        {item.last_updated
                          ? item.last_updated.startsWith("Updated")
                            ? item.last_updated
                            : `Updated · ${item.last_updated}`
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.last_page > 1 && (
        <div className="p-3 border-t border-slate-100 flex justify-end print:hidden">
          <Pagination pagination={pagination} />
        </div>
      )}
    </div>
  );
}
