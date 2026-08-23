import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, MoreVertical } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getProductAssignmentsByUser,
  ProductAssignment,
  SingleAssignmentEntry,
  GroupAssignmentEntry,
} from "@/apiServices/inventoryItemUsersService";
import { getEmployeeById } from "@/apiServices/employeeService";
import DeleteAssignedButton from "./DeleteAssignedButton";
import DeleteAssignedGroupButton from "./DeleteAssignedGroupButton";
import AssignMoreModal from "./AssignMoreModal";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const getStatusBadge = (status?: number, statusName?: string) => {
  switch (Number(status)) {
    case 1: // Active
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0 font-normal hover:bg-emerald-50">
          {statusName || "Active"}
        </Badge>
      );
    case 0: // Inactive
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-200 text-[10px] px-1.5 py-0 font-normal hover:bg-slate-50">
          {statusName || "Inactive"}
        </Badge>
      );
    case 2: // Repair / Returned
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0 font-normal hover:bg-amber-50">
          {statusName || "Repair"}
        </Badge>
      );
    case 3: // Damaged
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] px-1.5 py-0 font-normal hover:bg-rose-50">
          {statusName || "Damaged"}
        </Badge>
      );
    case 4: // Transferred
      return (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] px-1.5 py-0 font-normal hover:bg-purple-50">
          {statusName || "Transferred"}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
          {statusName || "—"}
        </Badge>
      );
  }
};

interface UserAssignedCardProps {
  item: ProductAssignment;
  isGroupItem?: boolean;
}

function UserAssignedCard({ item, isGroupItem = false }: UserAssignedCardProps) {
  return (
    <div className="bg-stone-50/80 border border-stone-200/60 rounded-xl p-4 hover:border-slate-300 transition-all flex flex-col justify-between gap-3 shadow-2xs">
      <div className="flex items-start gap-3 min-w-0">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white flex items-center justify-center shadow-2xs">
          <Image
            src={(item.image && typeof item.image === "string" && item.image.trim() !== "") ? item.image : "/images/placeholder.png"}
            alt={item.product_name || "Product"}
            width={48}
            height={48}
            unoptimized
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm text-slate-900 truncate" title={item.product_name}>
              {item.product_name}
            </h4>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 cursor-pointer rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border border-emerald-200/70 transition-colors shrink-0 shadow-2xs"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <PermissionGuard requiredPermission="edit-product-users">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/inventory/item-users/${item.id}/edit`}
                      className="flex items-center cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                </PermissionGuard>
                {!isGroupItem && (
                  <PermissionGuard requiredPermission="delete-product-users">
                    <DeleteAssignedButton id={item.id} />
                  </PermissionGuard>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {getStatusBadge(item.status, item.status_name)}
            <span className="text-xs font-medium text-slate-700">Qty: {item.quantity}</span>
            {item.barcode && <span className="text-xs text-slate-400 font-mono">• {item.barcode}</span>}
          </div>

          <div className="text-xs text-slate-500 mt-1 space-y-0.5">
            {item.branch_name && (
              <p className="truncate" title={item.branch_name}>
                <span className="font-medium text-slate-600">Branch:</span> {item.branch_name}
              </p>
            )}
            <p className="truncate" title={item.room_name || "—"}>
              <span className="font-medium text-slate-600">Room:</span> {item.room_name || "—"}
            </p>
            <p className="text-[11px] text-slate-400">
              <span>Assigned: {item.assigned_date}</span>
              {item.returned_date && (
                <span className="text-amber-700 ml-1.5">• Ret: {item.returned_date}</span>
              )}
            </p>
            {item.note && (
              <p className="text-[11px] text-slate-500 italic truncate" title={item.note}>
                &quot;{item.note}&quot;
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const UserAssignedData = async ({
  userId,
  searchParams,
}: {
  userId: number;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const page =
    typeof resolvedSearchParams.page === "string"
      ? Number(resolvedSearchParams.page)
      : 1;
  const per_page =
    typeof resolvedSearchParams.per_page === "string"
      ? Number(resolvedSearchParams.per_page)
      : 15;

  let results;
  let employeeData = null;
  try {
    const [assignmentRes, empRes] = await Promise.all([
      getProductAssignmentsByUser(userId, { page, per_page }),
      getEmployeeById(userId).catch(() => null),
    ]);
    results = assignmentRes;
    employeeData = empRes?.data || null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    }
    return <ErrorComponent message="An unexpected error occurred." />;
  }

  if (!results?.data) {
    return null;
  }

  const assignments = results.data.assignments || [];
  const paginationData = results.data.pagination;

  if (!assignments.length) {
    return (
      <NotFoundComponent message={results.message || "No assignments found for this employee."} />
    );
  }

  const singleAssignments: SingleAssignmentEntry[] = assignments.filter(
    (a): a is SingleAssignmentEntry => a.type === "single" && !!a.item
  );
  const groupAssignments: GroupAssignmentEntry[] = assignments.filter(
    (a): a is GroupAssignmentEntry => a.type === "group" && Array.isArray(a.items) && a.items.length > 0
  );

  const allAssignmentsList: ProductAssignment[] = [
    ...singleAssignments.map(s => s.item),
    ...groupAssignments.flatMap(g => g.items || [])
  ];
  const firstItem = singleAssignments[0]?.item || groupAssignments[0]?.items?.[0];
  const itemWithBranch = allAssignmentsList.find(
    (i) => i?.branch_id || (i as unknown as { branch?: { id?: number } })?.branch?.id || (i?.branch_name && i.branch_name !== "—")
  );
  const itemWithRoom = allAssignmentsList.find(
    (i) => i?.room_id || (i as unknown as { room?: { id?: number } })?.room?.id || (i?.room_name && i.room_name !== "—")
  );

  const employeeName = employeeData?.name || firstItem?.employee_name || "Employee";
  const employeeEmail = employeeData?.email || firstItem?.employee_email || "";
  const employeeId = employeeData?.employee_id || (firstItem?.user_id ? String(firstItem.user_id) : null);
  const profileImage = employeeData?.profile_image || "";

  const branchName =
    itemWithBranch?.branch_name ||
    (itemWithBranch as unknown as { branch?: { name?: string } })?.branch?.name ||
    employeeData?.branches?.[0]?.name ||
    "—";

  const detectedBranchId =
    itemWithBranch?.branch_id ||
    (itemWithBranch as unknown as { branch?: { id?: number } })?.branch?.id ||
    employeeData?.main_branch_id ||
    employeeData?.branches?.[0]?.id ||
    null;

  const detectedRoomId =
    itemWithRoom?.room_id ||
    (itemWithRoom as unknown as { room?: { id?: number } })?.room?.id ||
    firstItem?.room_id ||
    null;

  const detectedRoomName =
    itemWithRoom?.room_name ||
    (itemWithRoom as unknown as { room?: { name?: string } })?.room?.name ||
    firstItem?.room_name ||
    null;

  return (
    <div className="space-y-6">
      {/* Employee & Assignment Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar className="w-12 h-12 border border-slate-200 shrink-0 bg-slate-50 shadow-2xs">
              <AvatarImage
                src={(profileImage && typeof profileImage === "string" && profileImage.trim() !== "") ? profileImage : "/images/profile_avatar.png"}
                alt={employeeName}
                className="object-cover"
              />
              <AvatarFallback className="bg-slate-100 flex items-center justify-center p-0">
                <Image
                  src="/images/profile_avatar.png"
                  alt={employeeName}
                  width={48}
                  height={48}
                  unoptimized
                  className="w-full h-full object-cover rounded-full"
                />
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  {employeeName}
                </h2>
                {employeeId && (
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium border border-slate-200">
                    ID: {employeeId}
                  </span>
                )}
              </div>
              {employeeEmail && (
                <p className="text-xs text-slate-500 mt-0.5">{employeeEmail}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-800 border-emerald-200/70 text-xs font-medium px-3.5 py-1.5 rounded-full shadow-none"
            >
              {results.data.total_items} {results.data.total_items === 1 ? "assignment" : "Total Items"}
            </Badge>

            <PermissionGuard requiredPermission="create-product-users">
              <AssignMoreModal
                userId={userId}
                employeeName={employeeName}
                employeeEmail={employeeEmail}
                employeeId={employeeId}
                profileImage={profileImage}
                branchName={branchName}
                branchId={detectedBranchId}
                defaultRoomId={detectedRoomId}
                defaultRoomName={detectedRoomName}
              />
            </PermissionGuard>
          </div>
        </div>

        {/* 4 Information Meta Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-stone-50/80 border border-stone-200/60 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-medium block">Branch</span>
            <span className="text-sm font-semibold text-slate-900 mt-1 block truncate">
              {branchName}
            </span>
          </div>

          <div className="bg-stone-50/80 border border-stone-200/60 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-medium block">Room</span>
            <span className="text-sm font-semibold text-slate-900 mt-1 block truncate">
              {firstItem?.room_name || "—"}
            </span>
          </div>

          <div className="bg-stone-50/80 border border-stone-200/60 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-medium block">Assigned by</span>
            <span className="text-sm font-semibold text-slate-900 mt-1 block truncate">
              {firstItem?.assigned_by_name || "Super Admin"}
            </span>
          </div>

          <div className="bg-stone-50/80 border border-stone-200/60 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-medium block">Assigned date</span>
            <span className="text-sm font-semibold text-slate-900 mt-1 block truncate">
              {firstItem?.assigned_date || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Individual Items Section Card */}
      {singleAssignments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Individual Items
            </h3>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-800 border-blue-200/70 text-xs font-medium px-3.5 py-1 rounded-full shadow-none"
            >
              {singleAssignments.length} {singleAssignments.length === 1 ? "Item" : "Items"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {singleAssignments.map((entry, idx) => (
              <UserAssignedCard
                key={`single-${entry.item.id}-${idx}`}
                item={entry.item}
                isGroupItem={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Group Items Sections */}
      {groupAssignments.map((group, gIdx) => (
        <div
          key={`group-${group.group_item_id}-${gIdx}`}
          className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Group: {group.group_item_name || `Group #${group.group_item_id}`}
              </h3>
              <Badge
                variant="secondary"
                className="bg-purple-50 text-purple-800 border-purple-200/70 text-xs font-medium px-2.5 sm:px-3 py-0.5 rounded-full shadow-none"
              >
                {group.items.length} {group.items.length === 1 ? "Item" : "Items"}
              </Badge>
            </div>

            <PermissionGuard requiredPermission="delete-product-users">
              <DeleteAssignedGroupButton
                userId={userId}
                groupId={group.group_item_id}
              />
            </PermissionGuard>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {group.items.map((item, iIdx) => (
              <UserAssignedCard
                key={`g-item-${item.id}-${iIdx}`}
                item={item}
                isGroupItem={true}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {paginationData && paginationData.last_page > 1 && (
        <div className="mt-4 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </div>
  );
};

export default UserAssignedData;

