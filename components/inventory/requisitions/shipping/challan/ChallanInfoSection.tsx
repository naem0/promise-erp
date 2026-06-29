// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface ChallanInfoData {
  // Delivery Information
  deliveredByName: string;
  contact: string;
  // Delivery Details
  partner: string;
  description: string;
}

interface ChallanInfoSectionProps {
  data: ChallanInfoData;
}

// ─────────────────────────────────────────────
// Sub-component: Info Column
// ─────────────────────────────────────────────
interface InfoColumnProps {
  title: string;
  rows: { label?: string; value: string }[];
}

function InfoColumn({ title, rows }: InfoColumnProps) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-bold text-slate-700 mb-2">{title}</h3>
      {rows.map((row, i) => (
        <p key={i} className="text-sm text-slate-600">
          {row.label && (
            <span className="font-semibold text-slate-700">{row.label} : </span>
          )}
          {row.value || "—"}
        </p>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function ChallanInfoSection({ data }: ChallanInfoSectionProps) {
  return (
    <div className="border border-slate-100 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <InfoColumn
        title="Delivery Information"
        rows={[
          { label: "Name", value: data.deliveredByName },
          { label: "Contact", value: data.contact },
        ]}
      />
      <InfoColumn
        title="Delivery Details"
        rows={[
          { label: "Partner", value: data.partner },
          { value: "Description" },
          { value: data.description },
        ]}
      />
    </div>
  );
}
