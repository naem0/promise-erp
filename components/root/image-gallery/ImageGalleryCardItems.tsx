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

  // Card-এর মতো 2x2 grid-এ প্রথম ৪টি image দেখাবে
  const gridImages = images.slice(0, 4);
  while (gridImages.length < 4) {
    gridImages.push(images[0] || "/images/placeholder_img.jpg");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="py-0 gap-0 cursor-pointer hover:shadow-lg transition overflow-hidden">
          {/* 2x2 Image Grid — card-এর মতো */}
          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-2 p-2 ">
              {gridImages.map((img, i) => (
                <div key={i} className="relative w-full h-[130px] lg:h-[160px]">
                  <Image
                    src={img}
                    alt={`${event?.title} ${i + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-start gap-3 p-3">
            <p className="text-base text-secondary leading-relaxed">{event?.title}</p>
            <Button className="w-full">View More</Button>
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent className="w-[90%] md:!max-w-[85%] p-0 overflow-hidden gap-0">
        <VisuallyHidden>
          <DialogTitle>{event?.title}</DialogTitle>
        </VisuallyHidden>

        {/* Full carousel — সব images */}
        {images.length > 0 && (
          <div className="relative px-10 py-4">
            <Carousel className="w-full h-full">
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index} className="basis-full]">
                    <div className="relative w-full  aspect-[16/9]">
                      <Image
                        src={img}
                        alt={`gallery-${index}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 bg-primary text-white hover:bg-primary/90" />
              <CarouselNext className="right-0 bg-primary text-white hover:bg-primary/90" />
            </Carousel>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryCardItems;
