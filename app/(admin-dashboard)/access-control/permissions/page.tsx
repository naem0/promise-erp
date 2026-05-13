import PermissionListData from "@/components/access-control/PermissionListData";
import PermissionSearchFilter from "@/components/access-control/PermissionSearchFilter";
import TableSkeleton from "@/components/TableSkeleton";
import { Suspense } from "react";

export interface PermissionParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const PermissionsPage = ({ searchParams }: PermissionParams) => {
  return (
    <div className="mx-auto px-4 py-8 lg:py-12">
      <div className="p-6 mb-6 border rounded-xl bg-card shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-tight">Permissions</h1>
          <Suspense
            fallback={
              <h2 className="font-bold text-2xl text-center py-8">
                Loading...
              </h2>
            }
          >
            <PermissionSearchFilter />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
        <PermissionListData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default PermissionsPage;
