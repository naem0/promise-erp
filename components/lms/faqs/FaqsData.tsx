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
import { Faq, getFaqs } from "@/apiServices/faqsService";
import DeleteButton from "./DeleteButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { stripHtml, truncate } from "@/lib/utils";


const FaqsData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
  const per_page = typeof resolvedSearchParams.per_page === "string" ? Number(resolvedSearchParams.per_page) : 15;
  const params = {
    page,
    per_page,
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    sort_by:
      typeof resolvedSearchParams.sort_by === "string"
        ? resolvedSearchParams.sort_by
        : undefined,
    sort_order:
      typeof resolvedSearchParams.sort_order === "string"
        ? resolvedSearchParams.sort_order
        : undefined,
    type:
      typeof resolvedSearchParams.type === "string"
        ? resolvedSearchParams.type
        : undefined,
    status:
      typeof resolvedSearchParams.status === "string"
        ? resolvedSearchParams.status
        : undefined,
  };

  let results;
  try {
    results = await getFaqs(params);

  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const faqs = results?.data?.faq_sections || [];
  const paginationData = results?.data?.pagination;
  if (!faqs.length) {
    return <NotFoundComponent message={results?.message || "No faqs found."} />;
  }


  return (
    <>
      <div className="rounded-md border mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Sl</TableHead>
              <TableHead className="text-center">Action</TableHead>
              <TableHead className="text-center">Question</TableHead>
              <TableHead className="text-center">Answer</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {faqs.map((faq: Faq, index: number) => (
              <TableRow key={faq?.id}>
                <TableCell className="text-center">{(page - 1) * per_page + (index + 1)}</TableCell>
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
                      <PermissionGuard requiredPermission="edit-faq-sections">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/lms/faqs/${faq?.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                      </PermissionGuard>

                      <PermissionGuard requiredPermission="delete-faq-sections">
                        <DropdownMenuItem asChild>
                          <DeleteButton id={faq?.id} />
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-center" title={faq?.question || "—"}>
                  {truncate(faq?.question || "—", 30)}
                </TableCell>
                <TableCell className="font-medium text-center">
                  <div className="line-clamp-3">
                    {truncate(stripHtml(faq?.answer || ""), 60)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={faq.type === 1 ? "secondary" : faq.type === 2 ? "default" : "outline"}>
                    {faq.type === 1 ? "Course FAQ" : faq.type === 2 ? "Contact FAQ" : "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={faq.status === 1 ? "outline" : "destructive"}>
                    {faq.status === 1 ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {paginationData?.last_page > 1 && (
        <div className="mt-4 pb-6">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </>


  );
}
export default FaqsData;
