// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface ChallanMetaRowData {
  reqId: string;        // e.g. "REQ-2023-2026"
  challanNo: string;    // e.g. "EL-C-0001"
  challanDate: string;  // e.g. "01-07-2026"
  deliveryDate: string; // e.g. "05-07-2026"
  deliveryStatusText?: string;
}

interface ChallanMetaRowProps {
  data: ChallanMetaRowData;
}

// ─────────────────────────────────────────────
// Sub-component: Meta Item
// ─────────────────────────────────────────────
function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm text-slate-700 font-medium">
      <span className="text-slate-500 font-normal">{label} ID: </span>
      <span className="text-slate-800 font-semibold">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ChallanMetaRow({ data }: ChallanMetaRowProps) {
  return (
    <div className="border-t border-b border-slate-200 py-3 flex flex-wrap justify-between items-center gap-4 px-2">
      <div className="text-sm text-slate-700">
        <span className="text-slate-500 font-normal">Req ID: </span>
        <span className="text-slate-800 font-semibold">{data.reqId}</span>
      </div>
      <div className="text-sm text-slate-700">
        <span className="text-slate-500 font-normal">Challan No: </span>
        <span className="text-slate-800 font-semibold">{data.challanNo}</span>
      </div>
      <div className="text-sm text-slate-700">
        <span className="text-slate-500 font-normal">Challan Date: </span>
        <span className="text-slate-800 font-semibold">{data.challanDate}</span>
      </div>
      <div className="text-sm text-slate-700">
        <span className="text-slate-500 font-normal">Delivery Date: </span>
        <span className="text-slate-800 font-semibold">{data.deliveryDate}</span>
      </div>
      {data.deliveryStatusText && (
        <div className="text-sm text-slate-700 flex items-center gap-1.5">
          <span className="text-slate-500 font-normal">Status: </span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold border ${
              data.deliveryStatusText.toLowerCase() === "full"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-amber-50 text-amber-700 border-amber-100"
            }`}
          >
            {data.deliveryStatusText}
          </span>
        </div>
      )}
    </div>
  );
}
