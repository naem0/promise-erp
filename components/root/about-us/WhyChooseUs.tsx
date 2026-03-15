import {
  getPublicWhyChooseUs,
  WhyChooseUsApiResponse,
} from "@/apiServices/aboutPageService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
const WhyChooseUs = async () => {
  let whyChooseUsData: WhyChooseUsApiResponse | undefined;
  try {
    whyChooseUsData = await getPublicWhyChooseUs();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent
            message={
              whyChooseUsData?.message || "Failed to fetch why choose us data"
            }
          />
        </div>
      );
    }
    return (
      <div className="container mx-auto px-4 py-8 md:py-14">
        <ErrorComponent message="An unknown error occurred while fetching video galleries." />
      </div>
    );
  }
  const whyChooseUs = whyChooseUsData?.data?.why_choose_us || [];
  if (!whyChooseUs) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-14">
        <NotFoundComponent message={whyChooseUsData.message} />
      </div>
    );
  }
  return (
    <section className="py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <Card className="py-2 px-2 border border-secondary/30 shadow">
          <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[600px] rounded-2xl">
            <Image
              src="/images/why-choose-us.svg"
              alt="why choose us"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </Card>
        <div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {whyChooseUs.map((item) => {
                return (
                  <Card
                    key={item.id}
                    className="py-0 border border-secondary/30"
                  >
                    <CardContent className="p-4">
                      <div className="shrink-0 relative w-[60px] h-[60px] mb-2 shadow-2xl rounded-full">
                        <Image
                          src={item.image || "/images/why-choose1.svg"}
                          alt={item.title}
                          fill
                          className="object-scal-down shadow-2xl rounded-full border border-primary"
                        />
                      </div>

                      <div>
                        <h5 className="font-semibold text-lg xl:text-lg text-secondary">
                          {item.title || "Dummy Title"}
                        </h5>
                        <p className="text-black/60">
                          {item.subtitle || "Dummy Subtitle"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
