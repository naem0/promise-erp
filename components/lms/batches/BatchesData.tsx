
import { getBatches } from "@/apiServices/batchService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import DeleteButton from "./DeleteBatchButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default async function BatchesData({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;

  const params = {
    page,
    search:
      typeof searchParams.search === "string"
        ? searchParams.search
        : undefined,
    sort_order:
      typeof searchParams.sort_order === "string"
        ? searchParams.sort_order
        : "desc",
    division_id:
      typeof searchParams.division_id === "string"
        ? searchParams.division_id
        : undefined,
    district_id:
      typeof searchParams.district_id === "string"
        ? searchParams.district_id
        : undefined,
    branch_id:
      typeof searchParams.branch_id === "string"
        ? searchParams.branch_id
        : undefined,
    course_id:
      typeof searchParams.course_id === "string"
        ? searchParams.course_id
        : undefined,
    is_online:
      typeof searchParams.is_online === "string"
        ? searchParams.is_online
        : undefined,
    is_offline:
      typeof searchParams.is_offline === "string"
        ? searchParams.is_offline
        : undefined,
    per_page: 15
  };

  let data;
  try {
    data = await getBatches(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const batches = data?.data?.batches;
  const paginationData = data?.data?.pagination;

  if (batches.length === 0) {
    return <NotFoundComponent message={data?.message} title="Batch List" />;
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[50px]">Sl</TableHead>
              <TableHead className="text-center w-[100px]">Action</TableHead>
              <TableHead className="text-center min-w-[150px]">Batch Name</TableHead>
              <TableHead className="text-center min-w-[150px]">Course</TableHead>
              <TableHead className="text-center">Branch</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Discount</TableHead>
              <TableHead className="text-right">Final Price</TableHead>
              <TableHead className="text-center">Enrolled</TableHead>
              <TableHead className="text-center min-w-[120px]">Last Apply Date</TableHead>
              <TableHead className="text-center min-w-[120px]">Batch End Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {batches.map((batch, i) => (
              <TableRow key={batch?.id}>
                <TableCell className="text-center">{(page - 1) * 15 + (i + 1)}</TableCell>
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
                      <PermissionGuard requiredPermission="view-batches">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/batches/${batch?.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Details
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="edit-batches">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/batches/${batch?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="view-chapters">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/batches/${batch?.id}/chapter-lessons`}
                            className="flex items-center cursor-pointer"
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Chapters &amp; Lessons
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-batches">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={batch?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="font-medium text-center">{batch.name}</TableCell>
                <TableCell className="text-center">{batch.course?.title}</TableCell>
                <TableCell className="text-center">{batch?.branch?.name || "N/A"}</TableCell>
                <TableCell className="text-center">
                  {batch.is_online === 1 ? (
                    <Badge className="bg-teal-600 text-white hover:bg-teal-700">Online</Badge>
                  ) : (
                    <Badge className="bg-orange-600 text-white hover:bg-orange-700">Offline</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">{batch.price} ৳</TableCell>
                <TableCell className="text-right">
                  {batch.discount_type === "percentage"
                    ? `${batch.discount}%`
                    : `${batch.discount || "0"} ৳`}
                </TableCell>
                <TableCell className="text-right font-semibold text-primary">
                  {batch.after_discount} ৳
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{batch.total_enrolled || 0}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-center">
                  {batch.apply_end_date ? batch.apply_end_date : "N/A"}
                </TableCell>
                <TableCell className="whitespace-nowrap text-center">{batch.end_date}</TableCell>
                <TableCell className="text-center">
                  {batch.status === 1 ? (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">Published</Badge>
                  ) : batch.status === 2 ? (
                    <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">Upcoming</Badge>
                  ) : (
                    <Badge variant="destructive">Draft</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {
        paginationData && (
          <div className="mt-4">
            <Pagination pagination={paginationData} />
          </div>
        )
      }

    </>
  );
}
