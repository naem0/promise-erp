import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface CommonHeroBannerProps {
  title?: string;
  subtitle?: string;
  bgImage?: string;
}

const CommonHeroBanner = ({
  title,
  subtitle = "",
  bgImage,
}: CommonHeroBannerProps) => {
  return (
    <section className="relative overflow-hidden">
      {/* Optimized Background Image */}
      <AspectRatio ratio={16 / 2.5}>
        <Image
          src={bgImage || "/images/Our Branch Final.svg"}
          alt={title || ""}
          fill
          priority
          quality={80}
          placeholder="blur"
          blurDataURL="..."
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </AspectRatio>

      {/* Overlay */}
      <div className="absolute inset-0 bg-secondary/15" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-full md:max-w-3xl">
          <h1 className="text-3xl lg:text-6xl font-bold capitalize text-white mb-3">
            {title}
          </h1>
          <p className="text-lg md:text-base text-white">{subtitle}</p>
        </div>
      </div>
    </section>
  );
};

export default CommonHeroBanner;
