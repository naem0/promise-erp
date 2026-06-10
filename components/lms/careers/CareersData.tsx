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
import Image from "next/image";
import { Career, getCareers } from "@/apiServices/careerService";
import DeleteCareerButton from "./DeleteCareerButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const JOB_TYPE_LABELS: Record<number, string> = {
  1: "Full Time",
  2: "Part Time",
  3: "Contractual",
  4: "Internship",
};
interface CareersDataProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const CareersData = async ({ searchParams }: CareersDataProps) => {
  const resolvedSearchParams = await searchParams;
  const page =
    typeof resolvedSearchParams.page === "string"
      ? Number(resolvedSearchParams.page)
      : 1;

  const params = {
    page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
    job_type:
      typeof resolvedSearchParams.job_type === "string"
        ? resolvedSearchParams.job_type
        : undefined,
    career_category_id:
      typeof resolvedSearchParams.career_category_id === "string"
        ? resolvedSearchParams.career_category_id
        : undefined,
    branch_id:
      typeof resolvedSearchParams.branch_id === "string"
        ? resolvedSearchParams.branch_id
        : undefined,
  };

  let results;
  try {
    results = await getCareers(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if(!results || !results?.data) {
    return null;
  }

  const careers = results?.data?.careers || [];
  const paginationData = results?.data?.pagination;

  if (!careers?.length) {
    return (
      <div className="py-8 md:py-12">
        <NotFoundComponent message={results?.message || "No careers found."} />
      </div>
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
              <TableHead className="text-center">Image</TableHead>
              <TableHead className="text-center">Title & Subtitle</TableHead>
              <TableHead className="text-center">Slug</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Branch</TableHead>
              <TableHead className="text-center">Job Type</TableHead>
              <TableHead className="text-center">Location</TableHead>
              <TableHead className="text-center">Deadline</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {careers?.map((career: Career, index: number) => (
              <TableRow key={career?.id}>
                <TableCell className="text-center">
                  {(page - 1) * 15 + (index + 1)}
                </TableCell>
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
                      <PermissionGuard requiredPermission="edit-careers">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/careers/${career?.id}/edit`} prefetch={true}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-careers">
                        <DropdownMenuItem asChild>
                          <DeleteCareerButton id={career?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="font-medium flex items-center justify-center">
                  <Image
                    src={career.image || "/images/placeholder.png"}
                    alt={career?.title}
                    width={40}
                    height={40}
                    className="object-cover rounded h-10 w-10"
                  />
                </TableCell>
                <TableCell className="font-medium text-center max-w-[200px]">
                  <div className="flex flex-col">
                    <span className="truncate">{career?.title}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {career?.subtitle}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  {career?.slug || "—"}
                </TableCell>
                <TableCell className="text-center">
                  {career?.career_category?.name || "—"}
                </TableCell>
                <TableCell className="text-center">
                  {career?.branch?.name || "—"}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">
                    {career?.job_type_label ||
                      JOB_TYPE_LABELS[career?.job_type] ||
                      "—"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {career?.location || "—"}
                </TableCell>
                <TableCell className="text-center">
                  {career?.deadline || "—"}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={career.status === 1 ? "default" : "destructive"}
                  >
                    {career.status === 1 ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {paginationData && paginationData.last_page > 1 &&  (
        <div className="mt-4">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>
  );
};

export default CareersData;
