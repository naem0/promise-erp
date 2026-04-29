import {
  getPublicWhyChooseUs,
  WhyChooseUsApiResponse,
} from "@/apiServices/aboutPageService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
const WhyChooseUs = async () => {
  let whyChooseUsData: WhyChooseUsApiResponse | null = null;
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
  if (!whyChooseUsData || !whyChooseUsData?.success || !whyChooseUsData?.data) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <Card className="p-4 bg-white shadow">
          <div className="">
            <strong className="text-xl lg:text-2xl text-secondary block mb-3">
              Why Choose Us
            </strong>
            <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">
              We Have Experience <br />
              And We Have A Team <br />
              Of Experts
            </h2>
            <p>
              E-Learning and Earning Ltd. has been the foremost information
              technology service provider since 2013. The training programs of
              e-Learning and Earning Ltd. a wide range of skills that are
              integral and necessary parts of everyday business. In our quest to
              address every organizational development need, we offer a gamut of
              training programs, which ranges from Executive Coaching and
              Leadership Training to basic Communication Skills.
            </p>
            <div className="pt-4 lg:pt-6">
              <Button asChild>
                <Link href="/our-officers" prefetch={true}>
                  View Our Officers
                </Link>
              </Button>
            </div>
          </div>
        </Card>
        <div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {whyChooseUs.length > 0 ? (
                whyChooseUs.map((item) => {
                  return (
                    <Card key={item.id} className="py-0 bg-white shadow">
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
                          <p className="text-black/90">
                            {item.subtitle || "Dummy Subtitle"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="py-8 md:py-12">
                  <NotFoundComponent message={whyChooseUsData.message || " No why choose us found."} />
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
