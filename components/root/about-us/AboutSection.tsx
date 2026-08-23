import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPublicAboutBanner } from "@/apiServices/aboutPageService";
import ErrorComponent from "@/components/common/ErrorComponent";
import Link from "next/link";

const AboutSection = async () => {
  let aboutBannerData;

  try {
    aboutBannerData = await getPublicAboutBanner();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent
            message={
              aboutBannerData?.message ||
              "Failed to fetch about banner data"
            }
          />
        </div>
      );
    } else {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent message="An unexpected error occurred." />
        </div>
      );
    }
  }

  if (
    !aboutBannerData ||
    !aboutBannerData?.success ||
    !aboutBannerData?.data
  ) {
    return null;
  }

  const sections = aboutBannerData?.data?.sections || [];
  if (sections?.length === 0) {
    return null;
  }

  const banner = sections[0];

  return (
    <section className="md:py-10 py-16  bg-[url('/images/about-sec-bg.png')] bg-cover bg-center">
      <div className="container mx-auto px-4">
        <div className="text-white mb-10">
          <p className="text-lg font-bold mb-2">About Us</p>

          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            {banner.title}
          </h2>
        </div>

        {/* card */}
        <Card className="rounded-2xl shadow-xl py-0 ">
          <CardContent className="p-6 grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* left image */}
            <div className="border-primary/40 border p-2 rounded-xl">
              <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden border ">
                <Image
                  src={(banner.image && typeof banner.image === "string" && banner.image.trim() !== "") ? banner.image : "/images/placeholder_img.jpg"}
                  alt={banner.title || "about"}
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* right content */}
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-4 leading-tight">
                {banner.sub_title}
              </h3>

              <div
                className="text-black/60 text-lg mb-6"
                dangerouslySetInnerHTML={{ __html: banner.description || "" }}
              />

              <div className="flex flex-wrap gap-4 items-center">
                {banner?.button_text_one ? (
                  <Button asChild>
                    <Link href={banner?.button_link_one || "#"} prefetch={true}>
                      {banner?.button_text_one}
                    </Link>
                  </Button>
                ) : (
                  <Button>Contact Us</Button>
                )}

                {banner?.button_text_two && (
                  <Button asChild variant="outline">
                    <Link href={banner?.button_link_two || "#"} prefetch={true}>
                      {banner?.button_text_two}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;
