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
import { Pencil, Globe, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ContactPage, getContactPages } from "@/apiServices/contactPageAdminService";
import DeleteContactPageButton from "./DeleteContactPageButton";
import Pagination from "@/components/common/Pagination";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { truncate } from "@/lib/utils";

const ContactPagesData = async ({
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
        search: typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined    };

    let results;
    try {
        results = await getContactPages(params);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        } else {
            return <ErrorComponent message="An unexpected error occurred." />;
        }
    }

    const contactPages = results?.data?.contact_pages || [];
    const paginationData = results?.data?.pagination;

    if (!contactPages.length) {
        return (
            <NotFoundComponent message={results?.message || "No contact pages found."} />
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center w-12">Sl</TableHead>
                            <TableHead className="text-center w-24">Action</TableHead>
                            <TableHead className="text-center">Banner</TableHead>
                            <TableHead className="">Page Details</TableHead>
                            <TableHead className="">Contact Info</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {contactPages.map((pageItem: ContactPage, index: number) => (
                            <TableRow key={pageItem.id}>
                                <TableCell className="text-center">
                                    {(page - 1) * per_page + (index + 1)}
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
                                            <PermissionGuard requiredPermission="edit-contact-pages">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/web-content/contact-page/${pageItem.id}/edit`}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Manage
                                                    </Link>
                                                </DropdownMenuItem>
                                            </PermissionGuard>
                                            <PermissionGuard requiredPermission="delete-contact-pages">
                                                <DropdownMenuItem asChild>
                                                    <DeleteContactPageButton id={pageItem.id} />
                                                </DropdownMenuItem>
                                            </PermissionGuard>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="font-medium flex items-center justify-center">
                                    <Image
                                        src={(pageItem.page_banner && typeof pageItem.page_banner === "string" && pageItem.page_banner.trim() !== "") ? pageItem.page_banner : "/images/placeholder.png"}
                                        alt={pageItem.page_title}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />

                                </TableCell>
                                <TableCell className="">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{pageItem.page_title}</span>
                                        <span className="text-xs text-muted-foreground line-clamp-1">{pageItem.page_subtitle}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="">
                                    <div className="flex flex-col gap-1 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            <span>{pageItem.email?.[0] || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            <span>{pageItem.phone?.[0] || "N/A"}</span>
                                        </div>


                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            <span className="line-clamp-3" title={pageItem.address}>
                                                {truncate(pageItem.address, 60)}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={pageItem.status === 1 ? "default" : "secondary"}>
                                        {pageItem.status === 1 ? "Active" : "Inactive"}
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
};

export default ContactPagesData;
