import {
  fetchPublicNewsFeeds,
  NewsFeedItem,
} from "@/apiServices/homePageService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
// import NotFoundComponent from "@/components/common/NotFoundComponent";
import SectionTitle from "@/components/common/SectionTitle";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";

const NewsfeedsArchive = async () => {
  "use cache";
  cacheTag("public-news-feeds");
  let newsData;
  try {
    newsData = await fetchPublicNewsFeeds();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="container mx-auto px-4 py-8 md:py-14">
          <ErrorComponent message={error.message} />
        </div>
      );
    }
    return (
      <div className="container mx-auto px-4 py-8 md:py-14">
        <ErrorComponent message="An unknown error occurred while fetching video galleries." />
      </div>
    );
  }
  const newsItems: NewsFeedItem[] = newsData?.data?.news_feeds || [];
  if (!newsData || !newsData?.data || newsItems?.length === 0) {
    return null;
  }
  
  return (
    <section className="py-8 md:py-14 bg-secondary/5">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={newsData?.data?.section_title}
          subtitle={newsData?.data?.section_subtitle}
          iswhite={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          <Card className="p-3 py-6 h-full relative">
            {/* Main Featured News */}
            <h3 className="text-center text-secondary text-lg lg:text-2xl font-semibold">
              {newsItems[0].title}
            </h3>
            <Link
              href={newsItems[0].news_link || "#"}
              className="group h-full "
              target="_blank"
            >
              <AspectRatio
                ratio={1 / 1}
                className="w-full relative overflow-hidden"
              >
                <Image
                  src={newsItems[0].image || "/images/placeholder_img.jpg"}
                  alt={newsItems[0].news_link || "News Image"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 border border-secondary/20 rounded-lg"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
              </AspectRatio>
            </Link>
          </Card>

          {/* Other News Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full relative">
            {newsItems.slice(1).map((item) => (
              <Link
                key={item.id}
                href={item.news_link}
                className="group"
                target="_blank"
              >
                <Card className="p-3 py-4 h-full gap-2">
                  <h3 className="text-center text-secondary text-sm font-semibold">
                    {item.title}
                  </h3>
                  <AspectRatio
                    ratio={1 / 1}
                    className="w-full relative overflow-hidden"
                  >
                    <Image
                      src={item.image || "/images/placeholder_img.jpg"}
                      alt={item.news_link}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105 border border-secondary/20 rounded-lg"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      priority
                    />
                  </AspectRatio>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Button asChild className="cursor-pointer flex items-center gap-2">
            <Link href="/news-feeds" prefetch={true}>
              আরও পড়ুন
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsfeedsArchive;
