

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface ChallanCompanyInfoProps {
  challanNumber: string;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ChallanCompanyInfo({
  challanNumber,
}: ChallanCompanyInfoProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
      {/* Left — Company Logo */}
      <div className="flex flex-col gap-2">
        {/* Native <img> used intentionally — next/image blurs SVGs during print */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.svg"
          alt="E-Learning & Earning Ltd."
          style={{ width: 220, height: "auto" }}
          className="object-contain object-left"
        />
      </div>

      {/* Right — Challan Label + Number */}
      <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
        <span className="inline-block border border-[#15803d] text-[#15803d] text-xs font-semibold px-3 py-1 rounded-md tracking-wide">
          Delivery Challan
        </span>
        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
          {challanNumber}
        </p>
      </div>
    </div>
  );
}
