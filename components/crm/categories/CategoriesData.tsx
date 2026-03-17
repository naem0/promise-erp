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
import { CRMCategory, getCRMCategories } from "@/apiServices/crmCategoryService";
import DeleteCategoryButton from "./DeleteCategoryButton";
import Pagination from "@/components/common/Pagination";

const CategoriesData = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
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
        results = await getCRMCategories(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    const categories = results?.data?.categories || [];
    const paginationData = results?.data?.pagination;

    if (!categories.length) {
        return (
            <NotFoundComponent message={results?.message || "No categories found."} />
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
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">Description</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Total Leads</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {categories.map((category: CRMCategory, index: number) => (
                        <TableRow key={category?.id}>
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
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={`/crm/categories/${category?.id}/edit`}
                                                className="flex items-center cursor-pointer"
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <DeleteCategoryButton id={category?.id} />
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            <TableCell className="font-medium flex items-center justify-center">
                                <Image
                                    src={category.image_url || "/images/placeholder.png"}
                                    alt={category?.name}
                                    width={40}
                                    height={40}
                                    className="object-cover rounded-md h-10 w-10"
                                />
                            </TableCell>
                            <TableCell className="font-medium text-center">
                                {category?.name}
                            </TableCell>
                            <TableCell className="text-center max-w-xs truncate">
                                {category?.description || "—"}
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge variant={category.status === 1 ? "outline" : "destructive"}>
                                    {category.status_text}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                {category.total_leads}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
        </div>
        {paginationData && (
                <div className="mt-4">
                    <Pagination pagination={paginationData} />
                </div>
            )}
        </>
    );
};

export default CategoriesData;
