import ImagCardSkeleton from "@/components/root/image-gallery/ImagCardSkeleton";
import ImageGalleryBanner from "@/components/root/image-gallery/ImageGalleryBanner";
import ImageGalleryCard from "@/components/root/image-gallery/ImageGalleryCard";
import { Suspense } from "react";

interface ImageGalleryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const ImageGalleryPage = ({ searchParams }: ImageGalleryPageProps) => {
  return (
    <>
      <ImageGalleryBanner />
      <Suspense fallback={<ImagCardSkeleton />}>
        <ImageGalleryCard searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default ImageGalleryPage;
