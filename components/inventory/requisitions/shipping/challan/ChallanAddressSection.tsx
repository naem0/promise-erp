
export interface ChallanAddressData {
  fromName: string;
  fromCompany?: string;
  fromPhone?: string;
  fromWebsite?: string;
  fromAddress?: string;
  fromBin?: string | null;
  // Delivered To (receiver)
  toName: string;
  toBranch?: string;
  toPhone?: string;
}

interface ChallanAddressSectionProps {
  data: ChallanAddressData;
}

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


export default function ChallanAddressSection({
  data,
}: ChallanAddressSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-2 relative">
      {/* Delivered From */}
      <AddressColumn title="Delivered From">
        <p className="font-semibold text-slate-700">{data.fromName}</p>
        {data.fromCompany && <p>{data.fromCompany}</p>}
        {data.fromPhone && <p>{data.fromPhone}</p>}
        {data.fromWebsite && <p>{data.fromWebsite}</p>}
        {data.fromAddress && <p>{data.fromAddress}</p>}
        {data.fromBin && <p className="text-slate-500 text-xs mt-1">BIN No: {data.fromBin}</p>}
      </AddressColumn>

      {/* Vertical divider line */}
      <div className="hidden sm:block absolute left-1/2 top-2 bottom-2 w-px bg-slate-200" />

      {/* Delivered To */}
      <AddressColumn title="Delivered To">
        <p className="font-semibold text-slate-700">{data.toName}</p>
        {data.toBranch && <p>{data.toBranch}</p>}
        {data.toPhone && (
          <p>
            Phone :{" "}
            <span className="font-medium text-slate-700">{data.toPhone}</span>
          </p>
        )}
      </AddressColumn>
    </div>
  );
}

