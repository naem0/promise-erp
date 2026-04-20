import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

const CommonHeroBannerSkeleton = () => {
    return (
        <section className="relative overflow-hidden">
            {/* Background Skeleton */}
            <AspectRatio ratio={16 / 2.5}>
                <Skeleton className="w-full h-full" />
            </AspectRatio>

            {/* Overlay */}
            <div className="absolute inset-0 bg-secondary/10" />

            {/* Content Skeleton */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
                <div className="w-full max-w-full md:max-w-3xl flex flex-col items-center gap-3">

                    {/* Title Skeleton */}
                    <Skeleton className="h-8 w-3/4 md:h-12 md:w-2/3 rounded-md" />

                    {/* Subtitle Skeleton */}
                    <Skeleton className="h-4 w-1/2 md:w-1/3 rounded-md" />
                </div>
            </div>
        </section>
    );
};

export default CommonHeroBannerSkeleton