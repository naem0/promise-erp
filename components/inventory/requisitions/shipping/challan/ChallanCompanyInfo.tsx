import Image from "next/image";

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
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
      {/* Left — Company Logo + Address */}
      <div className="flex flex-col gap-2">
        {/* Logo image — contains company name + tagline internally */}
        <Image
          src="/images/logo.svg"
          alt="E-Learning & Earning Ltd."
          width={220}
          height={60}
          className="object-contain object-left"
          priority
        />
        {/* Address — shown below the logo */}
        <p className="text-xs text-slate-500 leading-relaxed mt-1">
          Khaja Super Market, 2nd to 7th Floor,
          <br />
          Kallyanpur Bus Stop,
          <br />
          Mirpur Road, Dhaka-1207.
        </p>
      </div>

      {/* Right — Challan Label + Number */}
      <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
        <span className="inline-block border border-[#15803d] text-[#15803d] text-xs font-semibold px-3 py-1 rounded-md">
          Delivery Challan
        </span>
        <p className="text-2xl font-bold tracking-tight text-slate-800">
          {challanNumber}
        </p>
      </div>
    </div>
  );
}
