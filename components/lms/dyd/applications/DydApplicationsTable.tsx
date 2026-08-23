"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Edit3, User, CheckSquare } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { DydApplication } from "@/apiServices/dydApplicationService";
import PermissionGuard from "@/components/auth/PermissionGuard";
import Pagination from "@/components/common/Pagination";
import DydApplicationStatusModal, {
  DYD_STATUS_MAP,
} from "./DydApplicationStatusModal";
import DydApplicationDetailModal from "./DydApplicationDetailModal";
import { PaginationType } from "@/types/pagination";

interface DydApplicationsTableProps {
  applications: DydApplication[];
  paginationData?: PaginationType;
  page: number;
  per_page: number;
}

export default function DydApplicationsTable({
  applications,
  paginationData,
  page,
  per_page,
}: DydApplicationsTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeDetailId, setActiveDetailId] = useState<number | null>(null);

  // Status modal state
  const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false);
  const [statusTargetIds, setStatusTargetIds] = useState<number[]>([]);
  const [statusCurrentVal, setStatusCurrentVal] = useState<number | undefined>(
    undefined
  );

  const allIdsOnPage = applications?.map((a) => a?.id);
  const isAllSelected =
    allIdsOnPage?.length > 0 &&
    allIdsOnPage?.every((id) => selectedIds?.includes(id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(Array.from(new Set([...selectedIds, ...allIdsOnPage])));
    } else {
      setSelectedIds(selectedIds?.filter((id) => !allIdsOnPage?.includes(id)));
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev?.filter((item) => item !== id));
    }
  };

  const openSingleStatusModal = (id: number, currentStatus: number) => {
    setStatusTargetIds([id]);
    setStatusCurrentVal(currentStatus);
    setStatusModalOpen(true);
  };

  const openBulkStatusModal = () => {
    if (!selectedIds.length) return;
    setStatusTargetIds(selectedIds);
    setStatusCurrentVal(undefined);
    setStatusModalOpen(true);
  };

  return (
    <>
      {/* Bulk Actions Header Bar */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center justify-between flex-wrap gap-3 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckSquare className="h-4.5 w-4.5 text-emerald-600" />
            <span>
              {selectedIds?.length} application{selectedIds?.length > 1 ? "s" : ""}{" "}
              selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <PermissionGuard requiredPermission="dyd-applications-status-update">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer text-xs font-medium"
                onClick={openBulkStatusModal}
              >
                <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                Update Status
              </Button>
            </PermissionGuard>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedIds([])}
              className="cursor-pointer text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-100/60 hover:text-emerald-900"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-md border bg-white overflow-hidden shadow-sm overflow-x-auto mb-6">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-center w-10">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) =>
                    handleSelectAll(Boolean(checked))
                  }
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="text-center font-semibold w-[60px]">
                Sl
              </TableHead>
              <TableHead className="text-center font-semibold w-[90px]">
                Action
              </TableHead>
              <TableHead className="font-semibold min-w-[200px]">
                Applicant Details
              </TableHead>
              <TableHead className="font-semibold min-w-[110px]">
                DYD Roll
              </TableHead>
              <TableHead className="font-semibold min-w-[130px]">
                Location
              </TableHead>
              <TableHead className="font-semibold min-w-[120px]">
                Education
              </TableHead>
              <TableHead className="font-semibold min-w-[110px]">
                Applied At
              </TableHead>
              <TableHead className="text-center font-semibold min-w-[130px]">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {applications?.map((app: DydApplication, index: number) => {
              const isSelected = selectedIds?.includes(app?.id);
              const statusInfo = DYD_STATUS_MAP[Number(app?.apply_status)] || {
                label: app?.apply_status_text || "Unknown",
                className:
                  "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
              };

              return (
                <TableRow
                  key={app?.id}
                  className={`hover:bg-slate-50/50 transition-colors ${
                    isSelected ? "bg-emerald-50/40" : ""
                  }`}
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectOne(app?.id, Boolean(checked))
                      }
                      aria-label={`Select ${app?.name}`}
                    />
                  </TableCell>

                  <TableCell className="text-center text-slate-500 font-medium">
                    {(page - 1) * per_page + (index + 1)}
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Badge className="cursor-pointer select-none">
                          Action
                        </Badge>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="center">
                        <DropdownMenuItem
                          onClick={() => setActiveDetailId(app.id)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4 text-blue-600" />
                          View Details
                        </DropdownMenuItem>

                        <PermissionGuard requiredPermission="dyd-applications-status-update">
                          <DropdownMenuItem
                            onClick={() =>
                              openSingleStatusModal(app.id, app.apply_status)
                            }
                            className="cursor-pointer"
                          >
                            <Edit3 className="mr-2 h-4 w-4 text-green-600" />
                            Update Status
                          </DropdownMenuItem>
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 rounded-full overflow-hidden border bg-slate-100 shrink-0 flex items-center justify-center">
                        {app?.profile_image ? (
                          <Image
                            src={(app?.profile_image && typeof app?.profile_image === "string" && app?.profile_image.trim() !== "") ? app?.profile_image : "/images/default-profile.png"}
                            alt={app?.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {app?.name}
                        </p>
                        <p className="text-slate-500">
                          <span className="font-medium text-slate-700">Phone:</span> {app?.phone}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-semibold text-slate-800">
                    {app?.dyd_roll}
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-800">
                        {app?.district_name || "—"}
                      </p>
                      {app?.division_name && (
                        <p className="text-slate-500">
                          <span className="font-medium text-slate-700">Division:</span> {app?.division_name}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="font-semibold text-slate-800">
                    {app?.education || "—"}
                  </TableCell>

                  <TableCell className="text-slate-600 whitespace-nowrap text-xs">
                    {app?.created_at
                      ? format(new Date(app?.created_at), "dd MMM yyyy")
                      : "—"}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge className={statusInfo?.className}>
                      {statusInfo?.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {paginationData && paginationData?.last_page > 1 && (
        <div className="mt-4 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}

      {/* Details Modal */}
      <DydApplicationDetailModal
        id={activeDetailId}
        isOpen={activeDetailId !== null}
        onClose={() => setActiveDetailId(null)}
        onOpenStatusUpdate={(id, statusVal) => {
          setActiveDetailId(null);
          openSingleStatusModal(id, statusVal);
        }}
      />

      {/* Status Update Modal */}
      <DydApplicationStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        targetIds={statusTargetIds}
        currentStatus={statusCurrentVal}
        onSuccess={() => setSelectedIds([])}
      />
    </>
  );
}
