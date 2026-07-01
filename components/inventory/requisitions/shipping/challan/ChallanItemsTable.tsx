// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface ChallanItem {
  name: string;
  quantity: number;
  unit?: string; // e.g. "Pcs", "Kg"
}

interface ChallanItemsTableProps {
  items: ChallanItem[];
  totalQuantity: string;  // e.g. "200Pcs"
  deliveryCost: string;   // e.g. "2000TK"
  qrValue?: string;       // URL or text for QR code
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ChallanItemsTable({
  items,
  totalQuantity,
  deliveryCost,
  qrValue,
}: ChallanItemsTableProps) {
  return (
    <div className="space-y-0 overflow-hidden rounded-xl border border-slate-100">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Head */}
          <thead>
            <tr className="bg-slate-100">
              <th className="w-12 sm:w-16 px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sl
              </th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="w-20 sm:w-28 px-3 sm:px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-50">
            {items.map((item, i) => (
              <tr
                key={i}
                className={
                  i % 2 === 0
                    ? "bg-white hover:bg-slate-50/60 transition-colors"
                    : "bg-slate-50/40 hover:bg-slate-50/80 transition-colors"
                }
              >
                <td className="px-3 sm:px-4 py-2.5 text-slate-500 font-medium tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="px-3 sm:px-4 py-2.5 text-slate-700 font-medium">
                  {item.name}
                </td>
                <td className="px-3 sm:px-4 py-2.5 text-slate-700 font-semibold text-center tabular-nums">
                  {String(item.quantity).padStart(2, "0")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer row — QR + Totals */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 px-4 py-4 border-t border-slate-100 bg-slate-50/40">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-1.5">
          {qrValue ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${encodeURIComponent(qrValue)}`}
              alt="QR Code"
              width={72}
              height={72}
              className="rounded border border-slate-100"
            />
          ) : (
            <div className="w-[72px] h-[72px] bg-slate-100 rounded flex items-center justify-center text-slate-300 text-[10px]">
              QR
            </div>
          )}
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">
            Scan For Details
          </p>
        </div>

        {/* Summary Totals */}
        <div className="flex flex-col gap-1.5 w-full sm:w-auto min-w-[180px]">
          <div className="flex items-center justify-between gap-4 border border-slate-200 rounded-lg px-3 py-2 bg-white">
            <span className="text-xs font-semibold text-slate-600">
              Total Quantity
            </span>
            <span className="text-sm font-bold text-slate-800 tabular-nums">
              {totalQuantity}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 border border-slate-200 rounded-lg px-3 py-2 bg-white">
            <span className="text-xs font-semibold text-slate-600">
              Delivery Cost
            </span>
            <span className="text-sm font-bold text-[#15803d] tabular-nums">
              {deliveryCost}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
