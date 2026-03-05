// import { ImageGallery } from "@/apiServices/imageGalleryService";
// import Image from "next/image";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface ImageGalleryCardItemsProps {
//   event: ImageGallery;
// }

// const ImageGalleryCardItems = ({ event }: ImageGalleryCardItemsProps) => {
//   return (
//     <Card className="py-0 gap-2">
//       <CardContent className="p-3 pb-0">
//         <div className="relative w-full h-[250px] lg:h-[350px] rounded-lg">
//           <Image
//             src={event?.images?.[0] || "/images/placeholder_img.jpg"}
//             alt={event?.title || "Image Gallery"}
//             fill
//             className="rounded-lg object-cover"
//           />
//         </div>
//       </CardContent>

//       <CardFooter className="flex flex-col items-start gap-3 p-3">
//         <p className="text-base text-secondary leading-relaxed">
//           {event?.title || "Image Gallery Title"}
//         </p>

//         <Button className="w-full">View More</Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default ImageGalleryCardItems;

"use client";

import { ImageGallery } from "@/apiServices/imageGalleryService";
import Image from "next/image";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageGalleryCardItemsProps {
  event: ImageGallery;
}

const ImageGalleryCardItems = ({ event }: ImageGalleryCardItemsProps) => {
  const images = event?.images || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="py-0 gap-2 cursor-pointer hover:shadow-lg transition">
          <CardContent className="p-3 pb-0">
            <div className="relative w-full h-[250px] lg:h-[350px] rounded-lg">
              <Image
                src={images[0] || "/images/placeholder_img.jpg"}
                alt={event?.title}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-start gap-3 p-3">
            <p className="text-base">{event?.title}</p>
            <Button className="w-full">View More</Button>
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-7xl w-full">
        {/* Accessibility Title (hidden) */}
        <VisuallyHidden>
          <DialogTitle>{event?.title}</DialogTitle>
        </VisuallyHidden>

        {images.length > 1 ? (
          <Carousel className="w-full">
            <CarouselContent className="w-full">
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-[400px]">
                    <Image
                      src={img}
                      alt={`gallery-${index}`}
                      fill
                      className="object-cover rounded-md w-full h-full"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-primary text-white" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-primary text-white" />
          </Carousel>
        ) : (
          <div className="relative w-full h-[400px]">
            <Image
              src={images[0] || "/images/placeholder_img.jpg"}
              alt="gallery"
              fill
              className="object-cover rounded-md w-full h-full"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryCardItems;
