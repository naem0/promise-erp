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
import { Badge } from "@/components/ui/badge";
import { GripVertical, Pencil, PlayCircle, StopCircle } from "lucide-react";
import Link from "next/link";
import {
    RolesPowerStep,
    reorderRolesPowerSteps,
} from "@/apiServices/inventoryRolesPowerService";
import { RequisitionFlow } from "@/apiServices/inventoryRequisitionFlowsService";
import DeleteRolesPowerButton from "./DeleteRolesPowerButton";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PermissionGuard from "@/components/auth/PermissionGuard";

// Flowchart Node Component
function FlowchartNode({
    step,
    index,
    isFirst,
    isLast,
    enableDrag,
}: {
    step: RolesPowerStep;
    index: number;
    isFirst: boolean;
    isLast: boolean;
    enableDrag: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: step.id, disabled: !enableDrag });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex flex-col items-center w-full"
        >
            {/* Flowchart Node Box */}
            <div className="relative w-full max-w-2xl bg-white border-2 border-slate-200 hover:border-primary/50 shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    {/* Drag Handle */}
                    {enableDrag && (
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                            title="Drag to reorder approval steps"
                        >
                            <GripVertical className="h-5 w-5" />
                        </div>
                    )}

                    {/* Step Identifier Box */}
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl border border-primary/20 bg-primary/5 text-primary font-bold text-base shadow-sm shrink-0">
                        <span className="text-[10px] uppercase text-primary/60 tracking-wider">Step</span>
                        <span className="text-lg -mt-1">{index + 1}</span>
                    </div>

                    {/* Role Info */}
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-base md:text-lg">
                            {step.role?.display_name || step.role?.name}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                            Role ID: {step.role_id} • Key: {step.role?.display_name || step.role?.name}
                        </span>
                    </div>
                </div>

                {/* dynamic workflow tags & details */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2">
                        {/* Power step number */}
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-semibold hover:bg-blue-50">
                            Power: {step.power}
                        </Badge>

                        {/* Min amount badge */}
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-semibold hover:bg-emerald-50">
                            {step.min_amount && step.min_amount > 0 ? `Min: ৳${step.min_amount.toLocaleString()}` : "No Limit"}
                        </Badge>
                    </div>

                    {/* Status Badge */}
                    <Badge
                        className={
                            Number(step.status) === 1
                                ? "bg-green-50 text-green-700 border-green-100 font-semibold hover:bg-green-50 px-3 py-1"
                                : "bg-red-50 text-red-700 border-red-100 font-semibold hover:bg-red-50 px-3 py-1"
                        }
                    >
                        {Number(step.status) === 1 ? "Active" : "Inactive"}
                    </Badge>

                    {/* Action Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Badge
                                variant="default"
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer py-1 px-3 shadow-sm hover:bg-primary/95 transition-colors"
                            >
                                Action
                            </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            <PermissionGuard requiredPermission="edit-roles-power">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/inventory/roles-power/${step.id}/edit`}
                                        className="flex items-center cursor-pointer font-medium"
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
                </div>
            </div>

            {/* Down Arrow for Flowchart indicator */}
            {!isLast && (
                <div className="flex flex-col items-center my-2 text-slate-400">
                    <div className="w-0.5 h-6 bg-slate-300" />
                    <svg
                        className="w-4 h-4 -mt-1 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3.5"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}

export default function RolesPowerClientTable({
    initialSteps,
    flows,
    page,
    per_page,
}: {
    initialSteps: RolesPowerStep[];
    flows: RequisitionFlow[];
    page: number;
    per_page: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentFlowId = searchParams.get("requisition_flow_id") || "";

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("page"); // reset to page 1
        if (value === "") {
            params.delete("requisition_flow_id");
        } else {
            params.set("requisition_flow_id", value);
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

        // Re-assign power levels sequentially based on visual order
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
                toast.success(res.message || "Workflow reordered successfully");
            } else {
                toast.error(res.message || "Failed to reorder workflow");
                setSteps(steps);
            }
        } catch (error: unknown) {
            toast.error((error as Error)?.message || "Failed to reorder workflow");
            setSteps(steps);
        }
    };

    const TABS = [
        { label: "All Workflows", value: "" },
        ...flows.map((flow) => ({
            label: flow.name,
            value: flow.id.toString(),
        })),
    ];

    // Helper: group steps by requisition flow if "All" is selected
    const getGroupedSteps = () => {
        const groups: Record<string, { flowName: string; steps: RolesPowerStep[] }> = {};

        // Initialize groups for all flows
        flows.forEach((flow) => {
            groups[flow.id.toString()] = {
                flowName: flow.name,
                steps: [],
            };
        });

        steps.forEach((step) => {
            const flowId = step.requisition_flow_id?.toString();
            if (flowId && groups[flowId]) {
                groups[flowId].steps.push(step);
            }
        });

        // Sort each group's steps by power
        Object.keys(groups).forEach((key) => {
            groups[key].steps.sort((a, b) => a.power - b.power);
        });

        return groups;
    };

    const groupedData = getGroupedSteps();
    const isSingleFlowActive = currentFlowId !== "";

    return (
        <div className="space-y-6">
            {/* URL-driven tabs */}
            <div className="flex gap-2 flex-wrap bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 w-fit">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`px-4 py-1.5 cursor-pointer rounded-lg text-sm font-semibold transition-all ${
                            currentFlowId === tab.value
                                ? "bg-white text-slate-800 shadow-sm border border-slate-200/40"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Flowchart Visual Layout */}
            <div className="space-y-8">
                {isSingleFlowActive ? (
                    // Drag and Drop Flowchart for active flow tab
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col items-center">
                            <div className="w-full max-w-2xl mb-8 flex items-center justify-between border-b pb-4">
                                <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                                    {flows.find(f => f.id.toString() === currentFlowId)?.name} Approval Flowchart
                                </h3>
                                <span className="hidden md:inline-block text-[11px] font-semibold text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                                    ↕ Drag nodes to change flow sequence
                                </span>
                            </div>

                            {/* Start Node Indicator */}
                            <div className="flex flex-col items-center mb-4 text-emerald-500">
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-4 py-1 rounded-full uppercase text-xs tracking-wider flex items-center gap-1.5">
                                    <PlayCircle className="w-4 h-4" /> Start Approval
                                </Badge>
                                <div className="w-0.5 h-6 bg-emerald-200 mt-2" />
                                <svg
                                    className="w-4 h-4 -mt-1 text-emerald-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3.5"
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            </div>

                            {/* Sortable flowchart nodes */}
                            <SortableContext
                                items={steps.map((s) => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-0 w-full flex flex-col items-center">
                                    {steps.length > 0 ? (
                                        steps.map((step, index) => (
                                            <FlowchartNode
                                                key={step.id}
                                                step={step}
                                                index={index}
                                                isFirst={index === 0}
                                                isLast={index === steps.length - 1}
                                                enableDrag={true}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-slate-500 font-medium">
                                            No approval steps found for this workflow.
                                        </div>
                                    )}
                                </div>
                            </SortableContext>

                            {/* End Node Indicator */}
                            {steps.length > 0 && (
                                <div className="flex flex-col items-center mt-4 text-red-500">
                                    <div className="w-0.5 h-6 bg-red-200 mb-2" />
                                    <Badge className="bg-red-50 text-red-700 border-red-200 font-bold px-4 py-1 rounded-full uppercase text-xs tracking-wider flex items-center gap-1.5">
                                        <StopCircle className="w-4 h-4" /> Final approval (Archived)
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </DndContext>
                ) : (
                    // Grouped visual flowcharts for "All" workflows
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.entries(groupedData).map(([flowId, group]) => (
                            <div
                                key={flowId}
                                className="bg-slate-50/40 border border-slate-200/80 rounded-2xl p-6 flex flex-col items-center"
                            >
                                <h4 className="w-full text-base font-bold text-slate-700 text-center border-b pb-4 mb-6">
                                    {group.flowName} Flow Pipeline
                                </h4>

                                {/* Start indicator */}
                                <div className="flex flex-col items-center mb-4 text-emerald-500">
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
                                        Start
                                    </span>
                                    <div className="w-0.5 h-4 bg-emerald-200 mt-1" />
                                </div>

                                <div className="space-y-0 w-full flex flex-col items-center">
                                    {group.steps.length > 0 ? (
                                        group.steps.map((step, index) => (
                                            <FlowchartNode
                                                key={step.id}
                                                step={step}
                                                index={index}
                                                isFirst={index === 0}
                                                isLast={index === group.steps.length - 1}
                                                enableDrag={false}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-slate-400 text-sm font-medium">
                                            No approval steps configured.
                                        </div>
                                    )}
                                </div>

                                {/* End indicator */}
                                {group.steps.length > 0 && (
                                    <div className="flex flex-col items-center mt-4 text-red-500">
                                        <div className="w-0.5 h-4 bg-red-200 mb-1" />
                                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
                                            End
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {steps.length === 0 && (
                            <div className="col-span-2 text-center py-12 text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
                                No workflow steps found. Add a role to get started.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
