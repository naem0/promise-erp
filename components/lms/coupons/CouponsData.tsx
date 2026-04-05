import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { CouponItem, getCoupons } from "@/apiServices/couponsService";
import DeleteButton from "./DeleteButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const CouponsData = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;

  const params: Record<string, unknown> = {
    page,
    search: typeof searchParams.search === "string" ? searchParams.search : undefined,
    sort_order: typeof searchParams.sort_order === "string" ? searchParams.sort_order : "desc",
    status: typeof searchParams.status === "string" ? searchParams.status : undefined,
    course_id: typeof searchParams.course_id === "string" ? searchParams.course_id : undefined,
  };

  let results;
  try {
    results = await getCoupons(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred while loading coupons." />;
    }
  }

  const coupons = results?.data?.coupons || [];
  const pagination = results?.data?.pagination;

  if (!coupons.length) {
    return <NotFoundComponent message={results?.message} title="Coupon List" />;
  }

  return (
    <>
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[50px] font-bold">#</TableHead>
              <TableHead className="w-[100px] text-center font-bold">Action</TableHead>
              <TableHead className="min-w-[150px] font-bold">Title</TableHead>
              <TableHead className="font-bold">Code</TableHead>
              <TableHead className="font-bold text-center">Discount</TableHead>
              <TableHead className="font-bold text-center">Used/Limit</TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {coupons.map((coupon: CouponItem, index: number) => (
              <TableRow key={`coupon-${coupon.id || index}`}>
                <TableCell className="font-medium">{(page - 1) * 15 + (index + 1)}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        variant="default"
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer select-none px-3 py-1 hover:bg-primary/90"
                      >
                        Action
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-40">
                      <PermissionGuard requiredPermission="edit-coupons">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/coupons/${coupon.id}/edit`}
                            className="flex items-center cursor-pointer py-2"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-coupons">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={coupon.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="font-semibold">{coupon.title}</TableCell>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                    {coupon.coupon_code}
                  </code>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-green-600 font-bold">{coupon.discount_percentage}%</span>
                </TableCell>
                <TableCell className="text-center text-muted-foreground whitespace-nowrap">
                  {coupon.used_count} / {coupon.usage_limit}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={coupon.status === 1 ? "outline" : "destructive"} className="rounded-full">
                    {coupon.status === 1 ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="mt-4">
          <Pagination pagination={pagination} />
        </div>
      )}
    </>
  );
};

export default CouponsData;
