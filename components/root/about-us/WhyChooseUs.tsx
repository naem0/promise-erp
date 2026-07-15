import {
  getPublicWhyChooseUs,
  getPublicWhyChooseUsSection,
} from "@/apiServices/aboutPageService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const WhyChooseUs = async () => {
  let whyChooseUsSectionData;
  let whyChooseUsData;

  try {
    whyChooseUsSectionData = await getPublicWhyChooseUsSection();
    whyChooseUsData = await getPublicWhyChooseUs();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent
            message={
              whyChooseUsSectionData?.message ||
              "Failed to fetch why choose us data"
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
    !whyChooseUsSectionData ||
    !whyChooseUsSectionData?.success ||
    !whyChooseUsSectionData?.data
  ) {
    return null;
  }

  const sections = whyChooseUsSectionData?.data?.sections || [];
  if (sections?.length === 0) {
    return null;
  }

  const section = sections[0];
  const whyChooseUs = whyChooseUsData?.data?.why_choose_us || [];

  return (
    <section className="py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="">
          <h2 className="mb-6 font-bold text-2xl lg:text-4xl text-secondary ">
            {section.title}
          </h2>
          <Card className="px-4 py-6 bg-white shadow-2xl rounded-xl">
            <div className="">
              <h3 className="text-xl lg:text-2xl font-bold text-black mb-4 whitespace-pre-line leading-tight">
                {section.sub_title}
              </h3>
              <div 
                className="text-black/80 text-base"
                dangerouslySetInnerHTML={{ __html: section.description || "" }}
              />
              
              {(section?.button_text_one || section?.button_text_two) && (
                <div className="pt-4 lg:pt-6 flex flex-wrap gap-4 items-center">
                  {section?.button_text_one && (
                    <Button asChild>
                      <Link href={section?.button_link_one || "#"} prefetch={true}>
                        {section?.button_text_one}
                      </Link>
                    </Button>
                  )}

                  {section?.button_text_two && (
                    <Button asChild variant="outline">
                      <Link href={section?.button_link_two || "#"} prefetch={true}>
                        {section?.button_text_two}
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
        <div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {whyChooseUs.length > 0 ? (
                whyChooseUs.map((item) => (
                  <Card key={item.id} className="py-0 bg-white shadow">
                    <CardContent className="p-4">
                      <div className="shrink-0 relative w-[60px] h-[60px] mb-2 shadow-2xl rounded-full">
                        <Image
                          src={item.image || "/images/why-choose1.svg"}
                          alt={item.title || "why choose us"}
                          fill
                          className="object-scal-down shadow-2xl rounded-full border border-primary"
                        />
                      </div>

                      <div>
                        <h5 className="font-semibold text-lg xl:text-lg text-secondary">
                          {item.title || "Dummy Title"}
                        </h5>
                        <p className="text-black/90">
                          {item.subtitle || "Dummy Subtitle"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-8 md:py-12">
                  <NotFoundComponent message={whyChooseUsData?.message || "No why choose us found."} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
