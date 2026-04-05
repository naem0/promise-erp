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
import { getReviews, Review } from "@/apiServices/reviewService";
import DeleteButton from "./DeleteButton";
import ApproveReviewButton from "./ApproveReviewButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const ReviewsData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;

  const page =
    typeof resolvedSearchParams?.page === "string"
      ? Number(resolvedSearchParams.page)
      : 1;

  const params = {
    page,
    search:
      typeof resolvedSearchParams?.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    status:
      typeof resolvedSearchParams?.status === "string"
        ? resolvedSearchParams.status
        : undefined,
    is_featured:
      typeof resolvedSearchParams?.is_featured === "string"
        ? resolvedSearchParams.is_featured
        : undefined,
    rating:
      typeof resolvedSearchParams?.rating === "string"
        ? resolvedSearchParams.rating
        : undefined,
    sort_order:
      typeof resolvedSearchParams?.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
    batch_id:
      typeof resolvedSearchParams?.batch_id === "string"
        ? resolvedSearchParams.batch_id
        : undefined,
    user_id:
      typeof resolvedSearchParams?.user_id === "string"
        ? resolvedSearchParams.user_id
        : undefined,
  };

  let results;
  try {
    results = await getReviews(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const reviews: Review[] = results?.data?.reviews || [];
  const pagination = results?.data?.pagination;

  if (!reviews.length) {
    return (
      <NotFoundComponent
        message={results?.message || "No reviews found."}
      />
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Sl</TableHead>
              <TableHead className="text-center">Action</TableHead>
              <TableHead className="text-center">User</TableHead>
              <TableHead className="text-center">Batch</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead className="text-center">Feedback</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Featured</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reviews.map((review: Review, index: number) => (
              <TableRow key={review.id}>
                <TableCell className="text-center">
                  {(page - 1) * 15 + (index + 1)}
                </TableCell>

                {/* ACTION */}
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
                      <PermissionGuard requiredPermission="edit-reviews">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/reviews/${review.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      {review.status !== 1 && (
                        <PermissionGuard requiredPermission="edit-reviews">
                          <DropdownMenuItem asChild>
                            <ApproveReviewButton id={review.id} />
                          </DropdownMenuItem>
                        </PermissionGuard>
                      )}

                      <PermissionGuard requiredPermission="delete-reviews">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={review.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                {/* USER */}
                <TableCell className="font-medium text-center">
                  {review.user?.name || "—"}
                </TableCell>

                {/* BATCH */}
                <TableCell className="text-center">
                  {review.batch?.name ?? "—"}
                </TableCell>

                {/* RATING */}
                <TableCell className="text-center">
                  {review.rating} ⭐
                </TableCell>

                {/* FEEDBACK */}
                <TableCell className="max-w-[250px] truncate text-center">
                  {review.feedback}
                </TableCell>

                {/* STATUS */}
                <TableCell className="text-center">
                  <Badge
                    variant={
                      review.status === 1
                        ? "default"
                        : "destructive"
                    }
                  >
                    {review.status === 1 ? "Active" : "Pending"}
                  </Badge>
                </TableCell>

                {/* FEATURED */}
                <TableCell className="text-center">
                  <Badge
                    variant={
                      review.is_featured === 1
                        ? "default"
                        : "outline"
                    }
                  >
                    {review.is_featured === 1 ? "Featured" : "Normal"}
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

export default ReviewsData;
