import Image from "next/image";

interface CommonHeroBannerProps {
  title: string;
  subtitle?: string;
  bgImage: string;
}

const CommonHeroBanner = ({
  title,
  subtitle = "",
  bgImage,
}: CommonHeroBannerProps) => {
  return (
    <section className="relative h-[300px] lg:h-[400px] w-full overflow-hidden flex items-center justify-center text-center px-4">
      {/* Optimized Background Image */}
      <Image
        src={bgImage}
        alt={title}
        fill
        priority
        quality={80}
        placeholder="blur"
        blurDataURL="..."
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-secondary/50" />

      {/* Content */}
      <div className="relative z-10 max-w-full md:max-w-3xl">
        <h1 className="text-3xl lg:text-6xl font-bold capitalize text-white mb-3">
          {title}
        </h1>
        <p className="text-lg md:text-base text-white">{subtitle}</p>
      </div>
    </section>
  );
};

export default CommonHeroBanner;
