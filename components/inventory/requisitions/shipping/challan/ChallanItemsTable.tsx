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

export default function ChallanItemsTable({
  items,
  totalQuantity,
  deliveryCost,
  qrValue,
}: ChallanItemsTableProps) {
  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-slate-200">
          {/* Head */}
          <thead>
            <tr className="bg-slate-100/80">
              <th className="border border-slate-200 w-12 sm:w-16 px-3 sm:px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Sl
              </th>
              <th className="border border-slate-200 px-3 sm:px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Product Name
              </th>
              <th className="border border-slate-200 w-24 sm:w-36 px-3 sm:px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="bg-white">
                <td className="border border-slate-200 px-3 sm:px-4 py-2.5 text-slate-500 font-medium text-center tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="border border-slate-200 px-4 py-2.5 text-slate-700 font-medium text-left">
                  {item.name}
                </td>
                <td className="border border-slate-200 px-3 sm:px-4 py-2.5 text-slate-700 font-medium text-center tabular-nums">
                  {String(item.quantity).padStart(2, "0")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer row — QR + Totals */}
      <div className="flex flex-row items-start justify-between gap-4 pt-2">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
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

        {/* Summary Totals Table */}
        <div className="w-full sm:w-auto min-w-[220px] sm:min-w-[280px]">
          <table className="w-full text-sm border-collapse border border-slate-200">
            <tbody>
              <tr>
                <td className="border border-slate-200 px-4 py-2 text-slate-500 font-medium text-left bg-slate-50/50">
                  Total Quantity
                </td>
                <td className="border border-slate-200 px-4 py-2 text-slate-700 font-medium text-center min-w-[80px] sm:min-w-[100px] tabular-nums">
                  {totalQuantity}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-4 py-2 text-slate-500 font-medium text-left bg-slate-50/50">
                  Delivery Cost
                </td>
                <td className="border border-slate-200 px-4 py-2 text-slate-700 font-medium text-center min-w-[80px] sm:min-w-[100px] tabular-nums">
                  {deliveryCost}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
