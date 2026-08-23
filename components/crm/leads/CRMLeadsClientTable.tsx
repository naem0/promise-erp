"use client";

import { useState, useTransition } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, UserCheck, Loader2, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CRMLead } from "@/apiServices/crmLeadsService";
import { assignLeadsToUser, Consultant } from "@/apiServices/crmLeadsActions";
import DeleteCRMLeadButton from "./DeleteCRMLeadButton";
import CRMLeadsExportButton from "./CRMLeadsExportButton";
import { truncate } from "@/lib/utils";
import PermissionGuard from "@/components/auth/PermissionGuard";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";
import ConsultantSearchSelect from "@/components/common/ConsultantSearchSelect";


/* ── Helper Functions for Badge Colors ── */
function getCourseTypeColor(typeId: number) {
    switch (typeId) {
        case 1: return "border-emerald-500 text-emerald-600 bg-emerald-50";
        case 2: return "border-blue-500 text-blue-600 bg-blue-50";
        default: return "";
    }
}

function getShiftColor(shiftId: number) {
    switch (shiftId) {
        case 1: return "border-amber-500 text-amber-600 bg-amber-50";
        case 2: return "border-orange-500 text-orange-600 bg-orange-50";
        case 3: return "border-purple-500 text-purple-600 bg-purple-50";
        default: return "";
    }
}

function getSourceColor(sourceId: number | undefined) {
    switch (sourceId) {
        case 1: return "border-slate-500 text-slate-600 bg-slate-50";
        case 2: return "border-indigo-600 text-indigo-700 bg-indigo-50";
        case 3: return "border-cyan-500 text-cyan-600 bg-cyan-50";
        case 4: return "border-fuchsia-500 text-fuchsia-600 bg-fuchsia-50";
        case 5: return "border-green-500 text-green-600 bg-green-50";
        case 6: return "border-teal-500 text-teal-600 bg-teal-50";
        case 7: return "border-sky-500 text-sky-600 bg-sky-50";
        case 8: return "border-gray-500 text-gray-600 bg-gray-50";
        default: return "";
    }
}

function getStatusColor(statusId: number) {
    switch (statusId) {
        case 1: return "border-blue-500 text-blue-600 bg-blue-50";
        case 2: return "border-yellow-500 text-yellow-600 bg-yellow-50";
        case 3: return "border-emerald-500 text-emerald-600 bg-emerald-50";
        case 4: return "border-indigo-500 text-indigo-600 bg-indigo-50";
        case 5: return "border-violet-500 text-violet-600 bg-violet-50";
        case 6: return "border-rose-500 text-rose-600 bg-rose-50";
        case 7: return "border-slate-500 text-slate-600 bg-slate-50";
        case 8: return "border-red-500 text-red-600 bg-red-50";
        case 9: return "border-indigo-500 text-indigo-600 bg-indigo-50";
        default: return "";
    }
}

interface CRMLeadsClientTableProps {
    leads: CRMLead[];
    page: number;
    perPage: number;
    consultants: Consultant[];
    branches: { id: number; name: string }[];
    totalLeads: number;
}

export default function CRMLeadsClientTable({
    leads,
    page,
    perPage,
    consultants,
    branches,
    totalLeads,
}: CRMLeadsClientTableProps) {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState<string>("");
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    /* ── Selection helpers ── */
    const allSelected =
        leads.length > 0 && leads.every((l) => selectedIds.has(l.id));
    const someSelected = selectedIds.size > 0;

    const toggleAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(leads?.map((l) => l.id)));
        }
    };

    const toggleOne = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    /* ── Assign submit ── */
    const handleAssign = () => {
        if (!selectedUserId) {
            toast.error("Please select a counsellor to assign leads to.");
            return;
        }
        if (selectedIds.size === 0) {
            toast.error("Please select at least one lead.");
            return;
        }

        startTransition(async () => {
            try {
                const res = await assignLeadsToUser(
                    Number(selectedUserId),
                    Array.from(selectedIds),
                );
                if (res.success) {
                    toast.success(
                        res.message ||
                        `${res.data.length} lead(s) assigned successfully.`,
                    );
                    setSelectedIds(new Set());
                    setSelectedUserId("");
                    setSelectedBranchId("");
                    setAssignModalOpen(false);
                } else {
                    toast.error(res.message || "Failed to assign leads.");
                }
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : "An unknown error occurred.";
                toast.error(message);
            }
        });
    };

    return (
        <>
            {/* ── Floating action bar when rows are selected ── */}
            {someSelected && (
                <div className="flex items-center justify-between rounded-lg border bg-primary/5 px-4 py-2.5 mb-3 shadow-sm">
                    <span className="text-sm font-medium text-foreground">
                        {selectedIds.size} lead{selectedIds.size > 1 ? "s" : ""} selected
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedIds(new Set())}
                            className="gap-1"
                        >
                            <X className="h-3.5 w-3.5" />
                            Clear
                        </Button>
                        <PermissionGuard requiredPermission="create-crm-lead-contacts">
                            <Button
                                size="sm"
                                className="gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={() => setAssignModalOpen(true)}
                            >
                                <UserCheck className="h-3.5 w-3.5" />
                                Assign to Counsellor
                            </Button>
                        </PermissionGuard>
                    </div>
                </div>
            )}

            {/* ── Table Header with Total Count ── */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Lead List
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({totalLeads} total)
                    </span>
                </h2>
                <div className="flex items-center gap-2">
                    <CRMLeadsExportButton leads={leads} page={page} perPage={perPage} />
                </div>
            </div>

            {/* ── Table ── */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">
                                <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={toggleAll}
                                    aria-label="Select all leads"
                                />
                            </TableHead>
                            <TableHead className="text-center">Sl</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                            <TableHead className="">Lead Profile</TableHead>
                            <TableHead className="text-center">Referrer</TableHead>
                            <TableHead className="text-center">Course</TableHead>
                            <TableHead className="text-center">Type & Shift</TableHead>
                            <TableHead className="text-center">Source</TableHead>
                            <TableHead className="text-center">Category</TableHead>
                            <TableHead className="text-center">Branch</TableHead>
                            <TableHead className="text-center">Counsellor</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Notes</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {leads?.map((lead: CRMLead, index: number) => (
                            <TableRow
                                key={lead?.id}
                                data-selected={selectedIds.has(lead.id)}
                                className={selectedIds.has(lead.id) ? "bg-indigo-50 dark:bg-indigo-950/20" : undefined}
                            >
                                {/* Checkbox */}
                                <TableCell className="text-center">
                                    <Checkbox
                                        checked={selectedIds.has(lead.id)}
                                        onCheckedChange={() => toggleOne(lead.id)}
                                        aria-label={`Select lead ${lead.name}`}
                                    />
                                </TableCell>

                                {/* Serial */}
                                <TableCell className="text-center">
                                    {(page - 1) * perPage + (index + 1)}
                                </TableCell>

                                {/* Action dropdown */}
                                <TableCell className="text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Badge
                                                variant="default"
                                                role="button"
                                                tabIndex={0}
                                                className="cursor-pointer select-none"
                                            >
                                                Action
                                            </Badge>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="center">
                                            <PermissionGuard requiredPermission="edit-leads">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/crm/leads/${lead?.id}/edit`}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                            </PermissionGuard>
                                            <PermissionGuard requiredPermission="delete-leads">
                                                <DropdownMenuItem asChild>
                                                    <DeleteCRMLeadButton id={lead?.id} />
                                                </DropdownMenuItem>
                                            </PermissionGuard>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>

                                {/* Name,Email & Phone */}
                                <TableCell className="font-medium">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-semibold">
                                            {lead?.name || "N/A"}
                                        </span>

                                        {lead?.phone && (
                                            <span className="text-xs text-muted-foreground">
                                                Phone: {lead.phone}
                                            </span>
                                        )}

                                        {lead?.whatsapp && (
                                            <span className="text-xs text-green-600">
                                                Whatsapp: {lead.whatsapp}
                                            </span>
                                        )}

                                        {lead?.email && (
                                            <span className="text-xs text-secondary" title={lead.email}>
                                                Email: {truncate(lead.email, 20)}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>


                                {/* Referrer */}
                                <TableCell className="text-center">
                                    <div className="flex flex-col text-xs">
                                        <span className="font-medium text-foreground">
                                            {lead?.referrer?.name || lead?.referrer_name || "—"}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {lead?.referrer?.phone || lead?.referrer_phone || ""}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Course */}
                                <TableCell className="text-center" title={lead?.course?.name || lead?.course_name || "—"}>

                                    {truncate(lead?.course?.name || lead?.course_name || "—", 30)}
                                </TableCell>

                                {/* Course type & shift */}
                                <TableCell className="text-center text-xs">
                                    <div className="flex flex-col items-center gap-1">
                                        {/* Course Type */}
                                        <Badge
                                            variant="outline"
                                            className={getCourseTypeColor(lead.course_type)}
                                        >
                                            {lead?.course_type_text || "—"}
                                        </Badge>

                                        {/* Shift */}
                                        <Badge
                                            variant="outline"
                                            className={getShiftColor(lead.shift)}
                                        >
                                            {lead?.shift_text || "—"}
                                        </Badge>
                                    </div>
                                </TableCell>


                                {/* Source */}
                                <TableCell className="text-center text-xs">
                                    <Badge
                                        variant="outline"
                                        className={getSourceColor(lead.source?.id)}
                                    >
                                        {lead?.source_text || "—"}
                                    </Badge>
                                </TableCell>

                                <TableCell className="text-center">
                                    {lead?.category?.name || "—"}
                                </TableCell>

                                <TableCell className="text-center text-xs">
                                    {lead?.branch?.name || "—"}
                                </TableCell>

                                <TableCell className="text-center">
                                    <div className="flex flex-col text-xs">
                                        <span className="font-medium text-foreground">
                                            {lead?.assigned_consultant?.name || "—"}
                                        </span>
                                        <span
                                            className="text-muted-foreground"
                                            title={lead?.assigned_consultant?.email || ""}
                                        >
                                            {truncate(lead?.assigned_consultant?.email || "", 20)}
                                        </span>
                                    </div>
                                </TableCell>
                                {/* Status */}
                                <TableCell className="text-center text-xs">
                                    <Badge
                                        variant="outline"
                                        className={getStatusColor(lead.status_id)}
                                    >
                                        {lead?.status_text || "—"}
                                    </Badge>
                                </TableCell>

                                <TableCell
                                    className="text-center text-xs max-w-[200px]"
                                    title={lead?.notes || ""}
                                >
                                    {truncate(lead?.notes || "N/A", 20)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* ── Assign Modal ── */}
            <Dialog
                open={assignModalOpen}
                onOpenChange={(open) => {
                    setAssignModalOpen(open);
                    if (!open) {
                        setSelectedUserId("");
                        setSelectedBranchId("");
                    }
                }}
            >
                <DialogContent className="w-full max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-indigo-600" />
                            Assign Leads to Counsellor
                        </DialogTitle>
                        <DialogDescription>
                            Assign{" "}
                            <strong>{selectedIds.size}</strong> selected lead
                            {selectedIds.size > 1 ? "s" : ""} to a counsellor.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Select Branch
                            </label>
                            <BranchSearchSelect
                                value={selectedBranchId}
                                onValueChange={(val) => {
                                    setSelectedBranchId(val || "");
                                    setSelectedUserId("");
                                }}
                                branches={branches}
                                placeholder="Select a Branch"
                                searchPlaceholder="Search branch..."
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Select Counsellor
                            </label>
                            <ConsultantSearchSelect
                                value={selectedUserId}
                                onValueChange={(val) => setSelectedUserId(val || "")}
                                consultants={consultants}
                                branchId={selectedBranchId}
                                disabled={!selectedBranchId}
                                placeholder={!selectedBranchId ? "Select a branch first..." : "Choose a Counsellor..."}
                                searchPlaceholder="Search counsellor by name or designation..."
                                className="w-full"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setAssignModalOpen(false);
                                setSelectedUserId("");
                                setSelectedBranchId("");
                            }}
                            disabled={isPending}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                            onClick={handleAssign}
                            disabled={isPending || !selectedUserId}

                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Assigning...
                                </>
                            ) : (
                                <>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Assign
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
