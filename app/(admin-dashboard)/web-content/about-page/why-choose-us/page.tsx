import { Suspense } from "react";
import WhyChooseUsData from "@/components/web-content/about-page/why-choose-us/WhyChooseUsData";
import WhyChooseUsFilterData from "@/components/web-content/about-page/why-choose-us/WhyChooseUsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function WhyChooseUsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
      <div className="mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Why Choose Us
          </h1>

          <PermissionGuard requiredPermission="create-why-choose-us">
            <Button asChild className="">
              <Link href="/web-content/about-page/why-choose-us/add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Why Choose Us
              </Link>
            </Button>
          </PermissionGuard>
        </div>

        <Suspense fallback={<div>Loading filters...</div>}>
          <WhyChooseUsFilterData />
        </Suspense>

        <Suspense fallback={<TableSkeleton columns={6} rows={5} />}>
          <WhyChooseUsData searchParams={searchParams} />
        </Suspense>
      </div>
  );
}
