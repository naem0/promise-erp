import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getMyProductAssignments,
  ProductAssignment,
  SingleAssignmentEntry,
  GroupAssignmentEntry,
} from "@/apiServices/inventoryItemUsersService";
import Pagination from "@/components/common/Pagination";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";

interface MiniItemCardProps {
  item: ProductAssignment;
}

function MiniItemCard({ item }: MiniItemCardProps) {
  return (
    <div className="border border-slate-200/80 rounded-xl p-3 bg-white flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
        <Image
          src={(item.image && typeof item.image === "string" && item.image.trim() !== "") ? item.image : "/images/placeholder.png"}
          alt={item.product_name}
          width={48}
          height={48}
          unoptimized
          className="w-full h-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-xs text-slate-900 truncate" title={item.product_name}>
          {item.product_name}
        </h4>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Quantity: <span className="font-medium text-slate-700">{item.quantity}</span>
        </p>
        <p className="text-[11px] text-slate-500 truncate" title={item.room_name || "—"}>
          Room: <span className="font-medium text-slate-700">{item.room_name || "—"}</span>
        </p>
      </div>
    </div>
  );
}

const MyAssignedItemsData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = await searchParams;
  const params = {
    page:
      typeof resolvedSearchParams.page === "string"
        ? Number(resolvedSearchParams.page)
        : 1,
    per_page:
      typeof resolvedSearchParams.per_page === "string"
        ? Number(resolvedSearchParams.per_page)
        : 15,
  };

  let results;
  try {
    results = await getMyProductAssignments(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    }
    return <ErrorComponent message="An unexpected error occurred." />;
  }

  if (!results?.data) {
    return null;
  }

  const rawAssignments = results?.data?.assignments || [];
  const paginationData = results?.data?.pagination;

  if (!rawAssignments?.length) {
    return (
      <NotFoundComponent message={results?.message || "You currently have no assigned items."} />
    );
  }

  const singleAssignments: SingleAssignmentEntry[] = rawAssignments.filter(
    (a): a is SingleAssignmentEntry => a.type === "single" && !!a.item
  );
  const groupAssignments: GroupAssignmentEntry[] = rawAssignments.filter(
    (a): a is GroupAssignmentEntry => a.type === "group" && Array.isArray(a.items) && a.items.length > 0
  );

  const firstItem = singleAssignments[0]?.item || groupAssignments[0]?.items?.[0];

  return (
    <div className="space-y-5">
      {/* 1. Header Profile & Meta Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-slate-200 shrink-0 bg-slate-50 shadow-2xs">
              <AvatarImage
                src={(session?.user?.image && typeof session?.user?.image === "string" && session?.user?.image.trim() !== "") ? session?.user?.image : "/images/profile_avatar.png"}
                alt={session?.user?.name || firstItem?.employee_name || "Employee"}
                className="object-cover"
              />
              <AvatarFallback className="bg-slate-100 flex items-center justify-center p-0">
                <Image
                  src="/images/profile_avatar.png"
                  alt="Avatar"
                  width={40}
                  height={40}
                  unoptimized
                  className="w-full h-full object-cover rounded-full"
                />
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  {session?.user?.name || firstItem?.employee_name || "Employee"}
                </h2>
                {firstItem?.user_id && (
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono border border-slate-200">
                    ID: {firstItem.user_id}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {session?.user?.email || firstItem?.employee_email || ""}
              </p>
            </div>
          </div>

          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-800 border-emerald-200/70 text-xs font-medium px-3.5 py-1 rounded-full shadow-none"
          >
            {results.data.total_items} {results.data.total_items === 1 ? "Total Item" : "Total Items"}
          </Badge>
        </div>

        {/* 4 Metadata Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium block">Branch</span>
            <span className="text-sm font-semibold text-slate-900 mt-1 block truncate">
              {firstItem?.branch_name || "—"}
            </span>
          </div>

          <div className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium block">Room</span>
            <span className="text-sm font-semibold text-slate-900 mt-1 block truncate">
              {firstItem?.room_name || "—"}
            </span>
          </div>

          <div className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium block">Assigned by</span>
            <span className="text-sm font-semibold text-slate-900 mt-1 block truncate">
              {firstItem?.assigned_by_name || "Super Admin"}
            </span>
          </div>

          <div className="bg-slate-50/60 border border-slate-200/60 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium block">Assigned date</span>
            <span className="text-sm font-semibold text-slate-900 mt-1 block truncate">
              {firstItem?.assigned_date || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Individual Items Section */}
      {singleAssignments?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Individual Items</h3>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-normal px-2.5 py-0.5 rounded-full shadow-none"
            >
              {singleAssignments?.length} {singleAssignments?.length === 1 ? "Item" : "Items"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {singleAssignments?.map((entry, idx) => (
              <MiniItemCard key={`single-${entry.item!.id}-${idx}`} item={entry.item!} />
            ))}
          </div>
        </div>
      )}

      {/* 3. Group Items Sections */}
      {groupAssignments?.map((group, gIdx) => (
        <div
          key={`group-${group.group_item_id}-${gIdx}`}
          className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Group: {group.group_item_name || `Group #${group.group_item_id}`}
            </h3>
            <Badge
              variant="secondary"
              className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-normal px-2.5 py-0.5 rounded-full shadow-none"
            >
              {group.items?.length || 0} {(group.items?.length || 0) === 1 ? "Item" : "Items"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {group.items?.map((item, iIdx) => (
              <MiniItemCard key={`g-item-${item.id}-${iIdx}`} item={item} />
            ))}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {paginationData && paginationData.last_page > 1 && (
        <div className="pt-2 pb-4">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </div>
  );
};

export default MyAssignedItemsData;
