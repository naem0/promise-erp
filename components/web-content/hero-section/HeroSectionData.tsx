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
  getHeroSections,
  HeroSection,
} from "@/apiServices/homePageAdminService";
import DeleteButton from "./DeleteButton";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";

const HeroSectionData = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
    const page =  typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
  const params = {
    page: page,
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
    branch_id:
      typeof resolvedSearchParams.branch_id === "string"
        ? resolvedSearchParams.branch_id
        : undefined,
    per_page: 15,
  };

  let results;
  try {
    results = await getHeroSections(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  const heroSections = results?.data?.hero_sections || [];
  const pagination = results?.data?.pagination;

  if (!heroSections.length) {
    return <NotFoundComponent message={results?.message} title="Hero Section List" />;
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sl</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Image / Video</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Subtitle</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {heroSections.map((item: HeroSection, index: number) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{(page - 1) * 15 + index + 1}</TableCell>
                  <TableCell>
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
                        <PermissionGuard requiredPermission="edit-hero-sections">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/web-content/hero-section/${item.id}/edit`}
                              className="flex items-center cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Manage
                            </Link>
                          </DropdownMenuItem>
                        </PermissionGuard>

                        <PermissionGuard requiredPermission="delete-hero-sections">
                          <DropdownMenuItem asChild>
                            <DeleteButton id={item.id} />
                          </DropdownMenuItem>
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <Image
                      src={
                        item.background_image || "/images/placeholder_img.jpg"
                      }
                      alt={item.title}
                      width={80}
                      height={45}
                      className="h-10 w-16 border rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>{item.branch?.name}</TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={item.title}
                  >
                    {item.title}
                  </TableCell>
                  <TableCell
                    className="max-w-[150px] truncate"
                    title={item.subtitle}
                  >
                    {item.subtitle}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.status === 1 ? "outline" : "destructive"}
                    >
                      {item.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
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

export default HeroSectionData;
