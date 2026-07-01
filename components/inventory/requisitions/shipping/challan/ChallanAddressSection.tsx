// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface ChallanAddressData {
  // Delivered From (sender)
  fromName: string;
  fromCompany: string;
  fromPhone: string;
  fromWebsite: string;
  fromAddress: string;
  fromBin: string;
  // Delivered To (receiver)
  toName: string;
  toBranch: string;
  toPhone: string;
}

interface ChallanAddressSectionProps {
  data: ChallanAddressData;
}

// ─────────────────────────────────────────────
// Sub-component: Address Column
// ─────────────────────────────────────────────
function AddressColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="text-sm text-slate-600 space-y-0.5 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ChallanAddressSection({
  data,
}: ChallanAddressSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border border-slate-100 rounded-xl px-5 py-4">
      {/* Delivered From */}
      <AddressColumn title="Delivered From">
        <p className="font-semibold text-slate-700">{data.fromName}</p>
        <p>{data.fromCompany}</p>
        <p>{data.fromPhone}</p>
        <p>{data.fromWebsite}</p>
        <p>{data.fromAddress}</p>
        <p className="text-slate-500 text-xs mt-1">BIN No: {data.fromBin}</p>
      </AddressColumn>

      {/* Divider — vertical on sm+, horizontal on mobile */}
      <div className="hidden sm:block absolute left-1/2 top-4 bottom-4 w-px bg-slate-100" />

      {/* Delivered To */}
      <AddressColumn title="Delivered To">
        <p className="font-semibold text-slate-700">{data.toName}</p>
        <p>{data.toBranch}</p>
        <p>
          Phone :{" "}
          <span className="font-medium text-slate-700">{data.toPhone}</span>
        </p>
      </AddressColumn>
    </div>
  );
}
