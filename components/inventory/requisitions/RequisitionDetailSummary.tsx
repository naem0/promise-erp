import { CalendarDays, Building2, User, ArrowLeft, Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Requisition } from "@/apiServices/requisitionsService";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface RequisitionDetailProps {
  requisition: Requisition;
}

const RequisitionDetailSummary = ({ requisition }: RequisitionDetailProps) => {
  console.log("from detail", requisition);
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/inventory/requisitions">
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-[#15803d] hover:bg-[#166534] text-white flex items-center justify-center border-none shadow-none"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold tracking-tight text-slate-800">
            {requisition?.challan_no}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#15803d]/30 text-[#15803d] hover:bg-[#15803d]/5 hover:text-[#166534] font-medium px-5 py-2 h-9 rounded-lg"
          >
            Transfer
          </Button>

          <PermissionGuard requiredPermission="requisition-shiping">
            <Button className="bg-[#15803d] hover:bg-[#166534] text-white font-medium px-5 py-2 h-9 rounded-lg gap-2 flex items-center shadow-sm">
              <Truck className="h-4 w-4" />
              Shipping
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Branch */}
        <div className="bg-white border rounded-xl p-5 flex items-start gap-4 shadow-sm">
          <div className="text-[#15803d] mt-1 bg-green-50/50 p-1.5 rounded-md">
            <Building2 className="h-5 w-5 stroke-[2]" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Branch
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {requisition?.branch_to?.name ?? "—"}
            </span>
          </div>
        </div>

        {/* Applicant */}
        <div className="bg-white border rounded-xl p-5 flex items-start gap-4 shadow-sm">
          <div className="text-[#15803d] mt-1 bg-green-50/50 p-1.5 rounded-md">
            <User className="h-5 w-5 stroke-[2]" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Applicant
            </span>
            <div className="text-sm font-semibold text-slate-700 space-y-0.5">
              <div>Name: {requisition.user?.name || "—"}</div>
              <div className="text-slate-500 font-medium">
                Mob: {requisition?.user?.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Expected Date */}
        <div className="bg-white border rounded-xl p-5 flex items-start gap-4 shadow-sm">
          <div className="text-[#15803d] mt-1 bg-green-50/50 p-1.5 rounded-md">
            <CalendarDays className="h-5 w-5 stroke-[2]" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Expected Date
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {requisition?.expected_date ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequisitionDetailSummary;
