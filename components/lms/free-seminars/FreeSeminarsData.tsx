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
import { getFreeSeminars, FreeSeminar } from "@/apiServices/freeSeminarsService";
import DeleteButton from "./DeleteButton";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";

const FreeSeminarsData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
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
    
  };

  let results;
  try {
    results = await getFreeSeminars(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const freeSeminars = results?.data?.free_seminars || [];
  const paginationData = results?.data?.pagination;

  if (!freeSeminars || freeSeminars.length === 0) {
    return <NotFoundComponent message={results?.message || "No free seminars found."} />;
  }

  return (
    <div className="rounded-md border">
      <Table className="border-b">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Sl</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead className="text-center">Image</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Branch</TableHead>
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="text-center">Seminar Date</TableHead>
            <TableHead className="text-center">Seminar Time</TableHead>
            <TableHead className="text-center">Type</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {freeSeminars.map((item: FreeSeminar, index: number) => {
            return (
              <TableRow key={item.id}>
                <TableCell className="text-center">{(page - 1) * 15 + (index + 1)}</TableCell>
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
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/lms/free-seminars/${item.id}/edit`}
                          className="flex items-center cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Manage
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <DeleteButton id={item.id} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="font-medium flex items-center justify-center">
                  <Image
                    src={item.image || "/images/placeholder.png"}
                    alt={item.title || `Free Seminar ${item.id}`}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium text-center max-w-[200px] truncate">
                  {item.title}
                </TableCell>
                <TableCell className="text-center">
                  {item.branch?.name || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  {item.course_category?.category_name || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  {item.seminar_date || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  {item.seminar_time || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={item.seminar_type === 0 ? "outline" : "secondary"}>
                    {item.seminar_type === 0 ? "Offline" : "Online"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {paginationData && (
        <div className="mt-4 py-3">
          <Pagination pagination={paginationData} />
        </div>
      )}
    </div>
  );
};

export default FreeSeminarsData;
