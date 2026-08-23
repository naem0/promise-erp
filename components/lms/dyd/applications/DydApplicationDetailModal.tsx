"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  CheckCircle2,
  User,
} from "lucide-react";
import {
  DydApplicationDetail,
  getDydApplicationById,
} from "@/apiServices/dydApplicationService";
import { DYD_STATUS_MAP } from "./DydApplicationStatusModal";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface DydApplicationDetailModalProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenStatusUpdate?: (id: number, currentStatus: number) => void;
}

export default function DydApplicationDetailModal({
  id,
  isOpen,
  onClose,
  onOpenStatusUpdate,
}: DydApplicationDetailModalProps) {
  const [detail, setDetail] = useState<DydApplicationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isOpen || !id) {
      setDetail(null);
      return;
    }

    const applicantId = id;

    startTransition(async () => {
      setError(null);
      try {
        const res = await getDydApplicationById(applicantId);

        if (res?.success && res?.data) {
          setDetail(res?.data);
        } else {
          setError(res?.message || "Failed to load applicant details.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch applicant details:", error.message);
          setError(error.message);
        } else {
          console.error("Failed to fetch applicant details:", error);
          setError("Failed to load applicant details.");
        }
      }
    });
  }, [isOpen, id]);

  const statusInfo = detail
    ? DYD_STATUS_MAP[Number(detail.apply_status)] || {
        label: detail?.apply_status_text || "Unknown",
        className: "bg-slate-100 text-slate-700 border border-slate-200",
      }
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center justify-between">
            <span>Applicant Details</span>
            {detail && statusInfo && (
              <Badge className={statusInfo?.className}>
                {statusInfo?.label}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isPending ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm">Loading applicant information...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 text-sm">{error}</div>
        ) : detail ? (
          <div className="space-y-6 py-2">
            {/* Top Profile Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-200 flex items-center justify-center">
                {detail?.profile_image ? (
                  <Image
                    src={(detail?.profile_image && typeof detail?.profile_image === "string" && detail?.profile_image.trim() !== "") ? detail?.profile_image : "/images/placeholder.png"}
                    alt={detail?.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-slate-400" />
                )}
              </div>

              <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-bold text-slate-800 truncate">
                    {detail?.name}
                  </h3>
                  <Badge variant="outline" className="text-xs bg-white">
                    Roll: {detail?.dyd_roll}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-600">
                  {detail?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {detail?.phone}
                    </span>
                  )}
                  {detail?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {detail?.email}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                  {(detail?.district_name || detail?.division_name) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {detail?.district_name}
                      {detail?.district_name && detail?.division_name ? ", " : ""}
                      {detail?.division_name}
                    </span>
                  )}
                  {detail?.date_of_birth && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      DOB: {detail?.date_of_birth}
                    </span>
                  )}
                </div>
              </div>

              <PermissionGuard requiredPermission="dyd-applications-status-update">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onOpenStatusUpdate?.(detail?.id, detail?.apply_status)
                  }
                  className="shrink-0 cursor-pointer text-xs"
                >
                  Change Status
                </Button>
              </PermissionGuard>
            </div>

            {/* Academic & Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Education Details */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b pb-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Education Details
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Education:</span>
                    <span className="font-medium text-slate-800">
                      {detail?.education || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Passing Year:</span>
                    <span className="font-medium text-slate-800">
                      {detail?.passing_year || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Result:</span>
                    <span className="font-medium text-slate-800">
                      {detail?.education_result || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gender:</span>
                    <span className="font-medium text-slate-800">
                      {detail?.gender || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills & Availability */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b pb-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  Skills & Availability
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Computer Skills:</span>
                    <span className="font-medium text-slate-800 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      {detail?.has_pc_skill || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Has Computer:</span>
                    <span className="font-medium text-slate-800 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      {detail?.has_computer || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Can Attend Class:</span>
                    <span className="font-medium text-slate-800 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      {detail?.can_attend_class || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Permanent Address:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[150px]">
                      {detail?.permanent_address || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
