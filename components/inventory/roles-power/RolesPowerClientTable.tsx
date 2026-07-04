"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Pencil } from "lucide-react";
import Link from "next/link";
import {
    RolesPowerStep,
    reorderRolesPowerSteps,
} from "@/apiServices/inventoryRolesPowerService";
import DeleteRolesPowerButton from "./DeleteRolesPowerButton";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PermissionGuard from "@/components/auth/PermissionGuard";

const WORKFLOW_TYPE_LABELS: Record<number, string> = {
    1: "Head Office",
    2: "Branch",
};

// Sortable Row Component
function SortableTableRow({ step, index, page, per_page }: { step: RolesPowerStep; index: number; page: number; per_page: number }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: step.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: isDragging ? ("relative" as const) : ("static" as const),
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className="hover:bg-slate-50/50 transition-colors bg-white"
        >
            <TableCell className="w-[50px] text-center">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab flex justify-center items-center h-full w-full"
                >
                    <GripVertical className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                </div>
            </TableCell>
            <TableCell className="text-center text-slate-500 font-medium">
                {(page - 1) * per_page + (index + 1)}
            </TableCell>

            <TableCell className="text-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Badge
                            variant="default"
                            role="button"
                            tabIndex={0}
                            className="cursor-pointer"
                        >
                            Action
                        </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <PermissionGuard requiredPermission="edit-roles-power">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/inventory/roles-power/${step.id}/edit`}
                                    className="flex items-center cursor-pointer"
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Manage
                                </Link>
                            </DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard requiredPermission="delete-roles-power">
                            <DropdownMenuItem asChild>
                                <DeleteRolesPowerButton id={step.id} />
                            </DropdownMenuItem>
                        </PermissionGuard>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>

            <TableCell className="font-medium text-slate-900">
                <div className="flex flex-col">
                    <span>{step.role?.display_name || step.role?.name}</span>
                    {step.role?.display_name && (
                        <span className="text-xs text-slate-400">
                            {step.role?.name}
                        </span>
                    )}
                </div>
            </TableCell>

            <TableCell>
                <Badge
                    variant="secondary"
                    className={
                        step.workflow_type === 1
                            ? "bg-blue-50 text-blue-700 border-blue-100 font-normal"
                            : "bg-purple-50 text-purple-700 border-purple-100 font-normal"
                    }
                >
                    {WORKFLOW_TYPE_LABELS[step.workflow_type] ??
                        `Type ${step.workflow_type}`}
                </Badge>
            </TableCell>

            <TableCell className="text-center font-semibold text-slate-700">
                {step.power}
            </TableCell>

            <TableCell className="text-center font-semibold text-slate-700">
                {step.min_amount ?? 0}
            </TableCell>

            <TableCell className="text-center">
                <Badge
                    className={
                        Number(step.status) === 1
                            ? "bg-green-50 text-green-700 border-green-100 font-medium"
                            : "bg-red-50 text-red-700 border-red-100 font-medium"
                    }
                >
                    {Number(step.status) === 1 ? "Active" : "Inactive"}
                </Badge>
            </TableCell>
        </TableRow>
    );
}

export default function RolesPowerClientTable({
    initialSteps,
    page,
    per_page,
}: {
    initialSteps: RolesPowerStep[];
    page: number;
    per_page: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentWorkflowType = searchParams.get("workflow_type") || "";

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("page"); // reset to page 1
        if (value === "") {
            params.delete("workflow_type");
        } else {
            params.set("workflow_type", value);
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const [steps, setSteps] = useState(initialSteps);

    useEffect(() => {
        setSteps(initialSteps);
    }, [initialSteps]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = steps.findIndex((item) => item.id === active.id);
        const newIndex = steps.findIndex((item) => item.id === over.id);

        const reorderedSteps = arrayMove(steps, oldIndex, newIndex);

        // Re-assign power values based on visual order
        const sortedPowers = [...steps].map((s) => s.power).sort((a, b) => a - b);
        const finalSteps = reorderedSteps.map((step, index) => ({
            ...step,
            power: sortedPowers[index],
        }));

        setSteps(finalSteps);

        const payload = {
            steps: finalSteps.map((s) => ({ id: s.id, power: s.power })),
        };

        try {
            const res = await reorderRolesPowerSteps(payload);
            if (res.success) {
                toast.success(res.message || "Reordered successfully");
            } else {
                toast.error(res.message || "Failed to reorder");
                setSteps(steps);
            }
        } catch (error: unknown) {
            toast.error((error as Error)?.message || "Failed to reorder");
            setSteps(steps);
        }
    };

    const TABS = [
        { label: "All", value: "" },
        { label: "Head Office", value: "1" },
        { label: "Branch", value: "2" },
    ];

    return (
        <div className="space-y-4">
            {/* URL-driven tabs */}
            <div className="flex gap-2">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`px-4 py-1.5 cursor-pointer rounded-md text-sm font-medium transition-colors ${
                            currentWorkflowType === tab.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="rounded-md border bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="text-center font-semibold w-[60px]">Sl</TableHead>
                        <TableHead className="text-center font-semibold w-[100px]">Action</TableHead>
                        <TableHead className="font-semibold min-w-[150px]">Role</TableHead>
                        <TableHead className="font-semibold min-w-[160px]">Workflow Type</TableHead>
                        <TableHead className="text-center font-semibold">Power</TableHead>
                        <TableHead className="text-center font-semibold">Min Amount</TableHead>
                        <TableHead className="text-center font-semibold">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <TableBody>
                        <SortableContext
                            items={steps.map((s) => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {steps.map((step, index) => (
                                <SortableTableRow
                                    key={step.id}
                                    step={step}
                                    index={index}
                                    page={page}
                                    per_page={per_page}
                                />
                            ))}
                            {steps.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center py-6 text-slate-500"
                                    >
                                        No workflow steps found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </SortableContext>
                    </TableBody>
                </DndContext>
            </Table>
        </div>
        </div>
    );
}
