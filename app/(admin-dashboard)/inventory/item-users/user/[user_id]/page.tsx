import UserAssignedData from "@/components/inventory/item-users/UserAssignedData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function UserAssignmentsPage({
    params,
    searchParams,
}: {
    params: Promise<{ user_id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = params;

    return (
        <Suspense fallback={<TableSkeleton columns={9} rows={10} />}>
            <UserAssignmentsPageContent params={resolvedParams} searchParams={searchParams} />
        </Suspense>
    );
}

async function UserAssignmentsPageContent({
    params,
    searchParams,
}: {
    params: Promise<{ user_id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await params;
    const userId = Number(resolvedParams.user_id);

    return (
        <div className="mx-auto space-y-6" suppressHydrationWarning>
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="cursor-pointer"
                    >
                        <Link href="/inventory/item-users">
                            Go Back
                        </Link>
                    </Button>
                    <h1 className="text-xl font-semibold text-slate-800">
                        Items Assigned to Employee
                    </h1>
                </div>
            </div>

            <Suspense fallback={<TableSkeleton columns={9} rows={10} />}>
                <UserAssignedData userId={userId} searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
