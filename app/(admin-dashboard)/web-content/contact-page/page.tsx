import ContactPagesData from "@/components/web-content/contact-page/ContactPagesData";
import ContactPagesFilterData from "@/components/web-content/contact-page/ContactPagesFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function ContactPagesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                    Contact Pages
                </h1>

                <PermissionGuard requiredPermission="create-contact-pages">
                    <Button asChild className="bg-green-600">
                        <Link href="/web-content/contact-page/add">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Contact Page
                        </Link>
                    </Button>
                </PermissionGuard>
            </div>

            <Suspense fallback={<div className="h-20 bg-muted animate-pulse rounded-xl" />}>
                <ContactPagesFilterData />
            </Suspense>

            <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
                <ContactPagesData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
