import ErrorComponent from "@/components/common/ErrorComponent";
import ImageGalleryCardItems from "./ImageGalleryCardItems";
import { getPublicImageGallery, ImageGalleryResponse } from "@/apiServices/imageGalleryService";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import Pagination from "@/components/common/Pagination";
import { PaginationType } from "@/types/pagination";

interface ImageGalleryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const ImageGalleryCard = async ({ searchParams }: ImageGalleryPageProps) => {
  const queryParams = await searchParams;
  const params = {
    per_page: queryParams.per_page ? Number(queryParams.per_page) : 30,
    page: queryParams.page ? Number(queryParams.page) : 1,
  };
  let eventsData:ImageGalleryResponse | null;
  try {
    eventsData = await getPublicImageGallery(params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent message="An unknown error occurred while fetching image gallery." />
        </div>
      );
    }
  }
  const events = eventsData?.data?.image_galleries || [];
const totalPage: PaginationType | null = eventsData?.data?.pagination || null;

  return (
    <section className="py-8 md:py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {events.length > 0 ? (
            events.map((event) => (
              <ImageGalleryCardItems key={event?.id} event={event} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <NotFoundComponent
                message={eventsData?.message || "No image galleries found"}
              />
            </div>
          )}
        </div>
        
        {totalPage && totalPage?.has_more_pages && (
          <div className="flex justify-center mt-8">
            <Pagination pagination={totalPage} />
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageGalleryCard;
