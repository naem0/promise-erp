import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import HeroSectionFilterData from "@/components/web-content/hero-section/HeroSectionFilterData";
import HeroSectionData from "@/components/web-content/hero-section/HeroSectionData";

import PermissionGuard from "@/components/auth/PermissionGuard";

const HeroSectionsPage = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Hero Sections</h1>

        <PermissionGuard requiredPermission="create-hero-section">
          <Button asChild>
            <Link href="/web-content/hero-section/add">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Hero Section
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      <Suspense fallback={<div>Loading Search...</div>}>
        <HeroSectionFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={4} rows={8} />}>
        <HeroSectionData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default HeroSectionsPage;
