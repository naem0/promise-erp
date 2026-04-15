import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";  
import ImageGalleryFilterData from "@/components/web-content/image-galleries/ImageGalleryFilterData";
import ImageGalleryData from "@/components/web-content/image-galleries/ImageGalleryData";  
import PermissionGuard from "@/components/auth/PermissionGuard";

const ImageGalleriesPage = ({
  searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Image Galleries</h1>
        <PermissionGuard requiredPermission="create-image-galleries">
          <Button asChild>
              <Link href="/web-content/image-galleries/add">  
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Image Gallery
              </Link>
          </Button>
        </PermissionGuard>
        </div>
        <Suspense fallback={<div>Loading Search...</div>}>
        <ImageGalleryFilterData />
      </Suspense>
      <Suspense fallback={<TableSkeleton columns={4} rows={8} />}>
        <ImageGalleryData searchParams={searchParams} />
      </Suspense>
    </div>
  );
};  
export default ImageGalleriesPage;
