import { Card } from "@/components/ui/card";
import { getLatestCountDown } from "@/apiServices/homePageService";
import Image from "next/image";
import ErrorComponent from "@/components/common/ErrorComponent";
import { cacheTag } from "next/cache";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { CACHE_TAGS } from "@/constants/cacheTags";

const HighlightsSection = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.STATS);
  let stats;
  let countDownData;
  try {
    const params = {
      limit: 4,
      type: "hero_stat",
    };
    countDownData = await getLatestCountDown(params);
    stats = countDownData?.data?.stats || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching stats:", error.message);
      return <ErrorComponent message={error.message} />;
    }
    throw new Error("Unknown error occurred while fetching stats");
  }

  if (!countDownData || !countDownData?.data) {
    return null;
  }

  if (!stats || stats.length === 0) {
    return (
      <div className="py-8 md:py-14">
        <NotFoundComponent message="No stats found" />
      </div>
    );
  }

  return (
    <section className="py-8 md:py-14 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-5">
          {stats?.map((stat, index) => (
            <Card
              key={stat?.id}
              className=" py-0 relative overflow-hidden bg-linear-to-r to-[#009F41] from-0% via-[#1C833E] via-40% from-[#0B5B28] to-100% transition-all duration-300 border-0 shadow-lg hover:shadow-xl hover:-translate-y-2 group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="px-2 md:px-4 py-3 md:py-4 text-center relative z-10">
                <div className="mb-2 lg:mb-4 inline-flex items-center justify-center shadow-2xl w-16 lg:w-18 h-16 lg:h-18  rounded-full bg-white">
                  <div className="relative w-12 lg:w-14 h-12 lg:h-14 rounded-full overflow-hidden">
                    <Image
                      src={(stat?.image && typeof stat?.image === "string" && stat?.image.trim() !== "") ? stat?.image : "/images/placeholder_img.jpg"}
                      alt={stat?.title}
                      fill
                      className=" rounded-full object-cover"
                    />
                  </div>
                </div>

                <div className="text-base md:text-2xl font-bold text-primary-foreground mb-2">
                  <span className="flex items-center justify-center">
                    {stat?.count} {""}
                  </span>
                </div>
                <div className="text-sm md:text-lg text-primary-foreground/90 font-medium">
                  {stat?.title}
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-br from-primary-foreground/0 to-primary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HighlightsSection;
