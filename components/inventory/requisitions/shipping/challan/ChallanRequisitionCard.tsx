// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface ChallanRequisitionItem {
  name: string;
  quantity: number;
}

export interface ChallanRequisitionData {
  id: number;
  challanNo: string;
  branch: string;
  applicant: string;
  aspectDate: string;
  items: ChallanRequisitionItem[];
}

interface ChallanRequisitionCardProps {
  req: ChallanRequisitionData;
  index: number;
}

// ─────────────────────────────────────────────
// Serial Badge
// ─────────────────────────────────────────────
function SerialBadge({ index }: { index: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#15803d] text-white text-xs font-bold shrink-0">
      #{String(index + 1).padStart(2, "0")}
    </span>
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ChallanRequisitionCard({
  req,
  index,
}: ChallanRequisitionCardProps) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/60 border-b border-slate-100">
        <SerialBadge index={index} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {req.challanNo}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            Branch: {req.branch}&nbsp;|&nbsp;Applicant: {req.applicant}
            &nbsp;|&nbsp;Aspect Date: {req.aspectDate}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 py-3 space-y-2">
        {/* Column headers */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          <span>Product Details</span>
          <span>Quantity</span>
        </div>

        {/* Product rows */}
        {req.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex-1 border border-slate-100 rounded-lg px-3 py-2 bg-white text-sm text-slate-700 font-medium">
              {item.name}
            </div>
            <div className="w-14 border border-slate-100 rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 text-center bg-white shrink-0">
              {item.quantity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
