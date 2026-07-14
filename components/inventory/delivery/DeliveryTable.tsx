"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Delivery } from "@/apiServices/inventoryBrandsService";
import Pagination from "@/components/common/Pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { PaginationType } from "@/types/pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface DeliveryTableProps {
  deliveries: Delivery[];
  paginationData?: PaginationType;
  selectedIds: Set<number | string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<number | string>>>;
}

export default function DeliveryTable({
  deliveries,
  paginationData,
  selectedIds,
  setSelectedIds,
}: DeliveryTableProps) {
  const allSelected =
    deliveries.length > 0 &&
    deliveries.every((item) => selectedIds.has(item.requisition));

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(deliveries.map((item) => item.requisition)));
    } else {
      setSelectedIds(new Set());
    }
  };
  const toggleOne = (id: number | string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getStatusBadgeStyle = (status: string | number) => {
    const statusStr = String(status).toLowerCase();
    switch (statusStr) {
      case "delivering":
      case "2":
        return "bg-cyan-50 dark:bg-cyan-950/20 text-cyan-500 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/30";
      case "pending":
      case "1":
        return "bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30";
      case "shipped":
      case "3":
      case "delivered - partial":
      case "delivered - full":
        return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30";
      case "return":
      case "4":
        return "bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-900/30";
      default:
        return "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800";
    }
  };

  return (
    <div className="bg-card border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden p-4 sm:p-6">
      {/* Table Content */}
      <div className="rounded-lg border border-slate-100 dark:border-slate-800 overflow-x-auto mb-4">
        <Table>
          <TableHeader className="bg-slate-50/75 dark:bg-slate-900/50">
            <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
              <PermissionGuard requiredPermission="create-deliveries">
                <TableHead className="w-12 py-2 px-6 text-center">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all deliveries"
                  />
                </TableHead>
              </PermissionGuard>
              <TableHead className="font-semibold text-slate-600 dark:text-slate-300 py-2 px-6 text-left">
                Requisition
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-slate-300 py-2 px-6 text-center">
                Action
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-slate-300 py-2 px-6 text-center">
                Delivery Branch
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-slate-300 py-2 px-6 text-center">
                Expected Date
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-slate-300 py-2 px-6 text-center">
                Delivery Date
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-slate-300 py-2 px-6 text-center">
                Challan
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-slate-300 py-2 px-6 text-center">
                Delivery Type
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-slate-300 py-2 px-6 text-center">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries?.map((item: Delivery, idx) => {
              const isChecked = selectedIds.has(item?.requisition);
              return (
                <TableRow
                  key={item.id || idx}
                  className="border-slate-100 dark:border-slate-900 hover:bg-slate-50/25 dark:hover:bg-slate-900/25 transition-colors"
                >
                  <PermissionGuard requiredPermission="create-deliveries">
                    <TableCell className="w-12 py-2 px-6 text-center">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleOne(item?.requisition)}
                        aria-label={`Select delivery requisition ${item.requisition}`}
                      />
                    </TableCell>
                  </PermissionGuard>
                  <TableCell className="py-2 px-6 font-medium text-left">
                    <Link
                      href={`/inventory/delivery/${item.requisition}/details`}
                      className="text-emerald-600 hover:underline dark:text-emerald-500"
                    >
                      {item?.requisition}
                    </Link>
                  </TableCell>
                  <TableCell className="py-2 px-6 text-center">
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
                        <PermissionGuard requiredPermission="create-deliveries">
                          <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link
                              href={`/inventory/delivery/${item.requisition}/shipping`}
                            >
                              Delivery
                            </Link>
                          </DropdownMenuItem>
                        </PermissionGuard>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Link
                            href={`/inventory/delivery/${item.challan}/challan`}
                          >
                            View Challan
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Link
                            href={`/inventory/delivery/${item.requisition}/details`}
                          >
                            View Details
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="py-2 px-6 text-center text-slate-600 dark:text-slate-400">
                    {item?.delivery_branch}
                  </TableCell>
                  <TableCell className="py-2 px-6 text-center text-slate-600 dark:text-slate-400">
                    {item?.aspect_delivery || "---"}
                  </TableCell>
                  <TableCell className="py-2 px-6 text-center text-slate-600 dark:text-slate-400">
                    {item?.delivery_date || "---"}
                  </TableCell>
                  <TableCell className="py-2 px-6 text-center font-medium">
                    {item?.challan && item?.challan !== "---" ? (
                      <Link
                        href={`/inventory/delivery/${item.challan}/challan`}
                        className="text-blue-600 hover:underline dark:text-blue-500"
                      >
                        {item?.challan}
                      </Link>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600">
                        ---
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-6 text-center text-slate-600 dark:text-slate-400">
                    {item?.delivery_type}
                  </TableCell>
                  <TableCell className="py-2 px-6 text-center">
                    <Badge
                      variant="outline"
                      className={`rounded-full px-3 py-1 font-medium text-xs ${getStatusBadgeStyle(
                        item?.status_text || item?.status,
                      )}`}
                    >
                      {item?.status_text || "---"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {paginationData && paginationData.last_page > 1 && (
        <div className="mt-4">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </div>
  );
}
