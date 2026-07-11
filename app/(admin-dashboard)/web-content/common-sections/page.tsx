import { Suspense } from "react";
import CommonSectionsData from "@/components/web-content/common-sections/CommonSectionsData";
import CommonSectionsFilterData from "@/components/web-content/common-sections/CommonSectionsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";


export default function CommonSectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          Common Sections
        </h1>

        <PermissionGuard requiredPermission="create-sections">
          <Button asChild>
            <Link href="/web-content/common-sections/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Common Section
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <CommonSectionsFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={7} rows={8} />}>
        <CommonSectionsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
