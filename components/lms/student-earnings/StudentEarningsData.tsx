import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
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
import { Pencil } from "lucide-react";
import Link from "next/link";
import {
  StudentEarning,
  getStudentEarnings,
} from "@/apiServices/studentEarningsService";
import DeleteStudentEarningButton from "./DeleteStudentEarningButton";
import EarningImagesPreview from "./EarningImagesPreview";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { truncate } from "@/lib/utils";
import { format } from "date-fns";

const StudentEarningsData = async ({
  searchParams,
}: {
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
  const params = {
    page,
    per_page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
  };

  let results;
  try {
    results = await getStudentEarnings(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!results || !results?.data) {
    return null;
  }

  const earnings = results?.data?.earnings || [];
  const paginationData = results?.data?.pagination;

  const statusMap: Record<number, { label: string; className: string }> = {
    0: { label: "Pending",  className: "bg-amber-50 text-amber-700 border border-amber-200 font-medium" },
    1: { label: "Verified", className: "bg-green-50 text-green-700 border border-green-200 font-medium" },
    2: { label: "Rejected", className: "bg-red-50 text-red-700 border border-red-200 font-medium" },
  };

  if (!earnings.length) {
    return (
      <NotFoundComponent message={results?.message || "No student earnings found."} />
    );
  }

  return (
    <>
      <div className="rounded-md border bg-white overflow-hidden shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-center font-semibold w-[60px]">Sl</TableHead>
              <TableHead className="text-center font-semibold w-[100px]">Action</TableHead>
              <TableHead className="font-semibold min-w-[220px]">Student / Earning Details</TableHead>
              <TableHead className="text-center font-semibold min-w-[100px]">Amount (BDT)</TableHead>
              <TableHead className="text-center font-semibold min-w-[100px]">Amount (USD)</TableHead>
              <TableHead className="text-center font-semibold min-w-[80px]">Images</TableHead>
              <TableHead className="font-semibold min-w-[110px]">Earned At</TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {earnings?.map((earning: StudentEarning, index: number) => {
              const earningStatus = statusMap[Number(earning?.status)] ?? statusMap[0];

              return (
              <TableRow
                key={`${earning?.id}`}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <TableCell className="text-center text-slate-500 font-medium">
                  {(page - 1) * per_page + (index + 1)}
                </TableCell>

                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge className="cursor-pointer">Action</Badge>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="center">
                      <PermissionGuard requiredPermission="edit-student-earnings">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/student-earnings/${earning?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard requiredPermission="delete-student-earnings">
                        <DropdownMenuItem asChild>
                          <DeleteStudentEarningButton id={earning?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800">{earning?.user?.name}</p>
                    <p className="text-xs text-slate-500">
                      <span className="font-medium text-slate-700">Marketplace:</span>{" "}
                      {earning?.marketplace_name?.trim() || "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      <span className="font-medium text-slate-700">Job Title:</span>{" "}
                      {earning?.job_title?.trim() || "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      <span className="font-medium text-slate-700">Payment:</span>{" "}
                      {earning?.payment_method || "—"}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="text-center font-semibold text-slate-700">
                  {earning?.amount_bdt > 0 ? `৳${earning.amount_bdt.toLocaleString()}` : "—"}
                </TableCell>

                <TableCell className="text-center font-semibold text-slate-700">
                  {earning?.amount_usd > 0 ? `$${earning.amount_usd.toLocaleString()}` : "—"}
                </TableCell>

                <TableCell className="text-center">
                  <EarningImagesPreview images={earning?.earning_images || []} />
                </TableCell>

                <TableCell className="text-slate-600 whitespace-nowrap">
                  {earning?.earned_at
                    ? format(new Date(earning.earned_at), "dd MMM yyyy")
                    : "—"}
                </TableCell>

                <TableCell className="text-center">
                  <Badge className={earningStatus.className}>
                    {earningStatus.label}
                  </Badge>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {paginationData && paginationData.last_page > 1 && (
        <div className="mt-4 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default StudentEarningsData;
