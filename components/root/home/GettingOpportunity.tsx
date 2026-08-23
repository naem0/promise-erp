import {
  fetchPublicOpportunities,
  OpportunityItem,
} from "@/apiServices/homePageService";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { cacheTag } from "next/cache";
import Image from "next/image";
import { cacheLife } from "next/cache";
import ErrorComponent from "@/components/common/ErrorComponent";
import { CACHE_TAGS } from "@/constants/cacheTags";

const GettingOpportunity = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.OPPORTUNITIES);
  cacheLife("seconds");

  let opportunitiesData;
  try {
    opportunitiesData = await fetchPublicOpportunities();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching opportunities:", error.message);
      return <ErrorComponent message={error.message} />;
    }
    return <ErrorComponent message="An unexpected error occurred." />;
  }
  const opportunities: OpportunityItem[] =
    opportunitiesData?.data?.opportunities || [];

  if (
    !opportunitiesData ||
    !opportunitiesData?.data ||
    opportunities?.length === 0
  ) {
    return null;
  }

  return (
    <section className="py-8 md:py-14">
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12 ">
          <div className="">
            <AspectRatio ratio={20 / 13} className="w-full relative">
              <Image
                src={(opportunitiesData?.data?.section_image && typeof opportunitiesData?.data?.section_image === "string" && opportunitiesData?.data?.section_image.trim() !== "") ? opportunitiesData?.data?.section_image : "/images/placeholder_img.jpg"}
                alt={opportunitiesData?.data?.section_title || ""}
                fill
                // width={600}
                // height={450}
                className="object-cover rounded-lg"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </AspectRatio>
          </div>

          <div className="space-y-5 md:space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold capitalize text-secondary leading-normal">
              {opportunitiesData?.data?.section_title}
            </h2>
            <p className="text-base md:text-lg text-black/75">
              {opportunitiesData?.data?.section_subtitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
              {opportunities.map((opportunity) => (
                <Card
                  key={opportunity.id}
                  className="p-2 border border-secondary/20 shadow-sm bg-secondary/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-scale-in"
                >
                  <CardContent className="flex items-center gap-3 px-0 py-1">
                    <div className="shrink-0">
                      <Image
                        src={(opportunity?.image && typeof opportunity?.image === "string" && opportunity?.image.trim() !== "") ? opportunity?.image : "/images/placeholder_img.jpg"}
                        alt={opportunity?.title}
                        width={50}
                        height={50}
                        className="object-cover rounded-full"
                      />
                    </div>

                    <div>
                      <h3 className="text-base text-secondary font-semibold">
                        {opportunity?.title}
                      </h3>
                      <p className="text-base text-black/75 font-medium">
                        {opportunity?.sub_title}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingOpportunity;
