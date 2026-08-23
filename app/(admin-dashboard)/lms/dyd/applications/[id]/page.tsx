import { getDydApplicationById } from "@/apiServices/dydApplicationService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DYD_STATUS_MAP } from "@/components/lms/dyd/applications/DydApplicationStatusModal";
import { Phone, Mail, MapPin, Calendar, BookOpen, Award, CheckCircle2, User, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DydApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;

  let res;
  try {
    res = await getDydApplicationById(id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    }
    return <ErrorComponent message="An unexpected error occurred." />;
  }

  if (!res) {
    return null;
  }
  if (!res?.data) {
    return (
      <NotFoundComponent
        message={res?.message || "Applicant details not found."}
        title="Applicant Details"
      />
    );
  }

  const detail = res?.data;
  const statusInfo = DYD_STATUS_MAP[Number(detail?.apply_status)] || {
    label: detail?.apply_status_text || "Unknown",
    className: "bg-slate-100 text-slate-700 border border-slate-200",
  };

  return (
    <div className="mx-auto space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild className="cursor-pointer">
          <Link href="/lms/dyd/applications">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Applications
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          Applicant Details
        </h1>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-200 flex items-center justify-center">
            {detail?.profile_image ? (
              <Image
                src={(detail?.profile_image && typeof detail?.profile_image === "string" && detail?.profile_image.trim() !== "") ? detail?.profile_image : "/images/placeholder.png"}
                alt={detail?.name}
                fill
                className="object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-slate-400" />
            )}
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-800">
                {detail?.name}
              </h2>
              <Badge variant="outline" className="text-xs bg-white font-mono">
                Roll: {detail?.dyd_roll}
              </Badge>
              <Badge className={statusInfo?.className}>{statusInfo.label}</Badge>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1 text-sm text-slate-600">
              {detail?.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {detail?.phone}
                </span>
              )}
              {detail?.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {detail?.email}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1 text-xs text-slate-500 pt-0.5">
              {(detail?.district_name || detail?.division_name) && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {detail?.district_name}
                  {detail?.district_name && detail?.division_name ? ", " : ""}
                  {detail?.division_name}
                </span>
              )}
              {detail?.date_of_birth && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  DOB: {detail?.date_of_birth}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Academic & Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-slate-200 space-y-4 bg-white">
            <h3 className="font-semibold text-base text-slate-800 flex items-center gap-2 border-b pb-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Education Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Education:</span>
                <span className="font-semibold text-slate-800">
                  {detail?.education || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Passing Year:</span>
                <span className="font-semibold text-slate-800">
                  {detail?.passing_year || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Result:</span>
                <span className="font-semibold text-slate-800">
                  {detail?.education_result || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gender:</span>
                <span className="font-semibold text-slate-800">
                  {detail?.gender || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 space-y-4 bg-white">
            <h3 className="font-semibold text-base text-slate-800 flex items-center gap-2 border-b pb-3">
              <Award className="h-5 w-5 text-purple-600" />
              Skills & Requirements
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Computer Skills:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {detail?.has_pc_skill || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Has Computer:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {detail?.has_computer || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Can Attend Class:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {detail?.can_attend_class || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Permanent Address:</span>
                <span className="font-semibold text-slate-800">
                  {detail?.permanent_address || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
