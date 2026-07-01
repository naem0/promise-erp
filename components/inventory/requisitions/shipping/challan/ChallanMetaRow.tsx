// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface ChallanMetaRowData {
  reqId: string;        // e.g. "REQ-2023-2026"
  challanNo: string;    // e.g. "EL-C-0001"
  challanDate: string;  // e.g. "01-07-2026"
  deliveryDate: string; // e.g. "05-07-2026"
}

interface ChallanMetaRowProps {
  data: ChallanMetaRowData;
}

// ─────────────────────────────────────────────
// Sub-component: Meta Item
// ─────────────────────────────────────────────
function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-700">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ChallanMetaRow({ data }: ChallanMetaRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-100 rounded-xl px-5 py-4">
      <MetaItem label="Req ID" value={data.reqId} />
      <MetaItem label="Challan No" value={data.challanNo} />
      <MetaItem label="Challan Date" value={data.challanDate} />
      <MetaItem label="Delivery Date" value={data.deliveryDate} />
    </div>
  );
}
