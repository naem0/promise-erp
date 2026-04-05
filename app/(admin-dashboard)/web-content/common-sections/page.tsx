import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import CommonSectionsFilterData from "@/components/web-content/common-sections/CommonSectionsFilterData";
import CommonSectionsData from "@/components/web-content/common-sections/CommonSectionsData";   
import PermissionGuard from "@/components/auth/PermissionGuard";

const CommonSectionsPage = ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Common Sections</h1>
        <PermissionGuard requiredPermission="create-common-sections">
          <Button asChild>
              <Link href="/web-content/common-sections/add">  
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Common Section
              </Link>
          </Button>
        </PermissionGuard>
        </div>
        <Suspense fallback={<div>Loading Search...</div>}>
        <CommonSectionsFilterData />
      </Suspense>
      <Suspense fallback={<TableSkeleton columns={4} rows={8} />}>
        <CommonSectionsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};  
export default CommonSectionsPage;


