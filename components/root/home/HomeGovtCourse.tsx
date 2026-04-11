import Image from "next/image";

import { Button } from "@/components/ui/button";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Link from "next/link";
import {
  getPublicGovtCourseSection,
  GovtCourseResponse,
} from "@/apiServices/homePageService";
import { cacheTag } from "next/cache";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function HomeGovtCourse() {
  "use cache";
  cacheTag("public-govt-course");

  let govtCourseData: GovtCourseResponse | null = null;
  try {
    govtCourseData = await getPublicGovtCourseSection();
  } catch (error: unknown) {
    console.error("Error fetching govt course:", error);
    if (error instanceof Error) {
      console.error("Error fetching govt course:", error.message);
      return <ErrorComponent message={error.message} />;
    }
    return <ErrorComponent message="An unexpected error occurred." />;
  }

  const govtCourseInfo = govtCourseData?.data || {};

  if (!govtCourseInfo || !govtCourseData) {
    return null;
  }

  return (
    <section className="py-8 md:py-14 bg-secondary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-center ">
          <AspectRatio ratio={20 / 18} className="w-full relative">
            <Image
              src={govtCourseInfo?.image || "/images/placeholder_img.jpg"}
              alt={govtCourseInfo?.title || ""}
              fill
              className="object-cover rounded-lg"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </AspectRatio>

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl capitalize font-normal text-secondary leading-normal">
              {govtCourseInfo?.title}
            </h2>
            <p className="text-base md:text-lg text-black/75">
              {govtCourseInfo?.sub_title}
            </p>
            <div className="flex items-center pt-4">
              <Button
                asChild
                className="cursor-pointer flex items-center gap-2"
              >
                <Link
                  href={{
                    pathname: "/courses",
                    query: { course_type: "govt" },
                  }}
                  prefetch={true}
                >
                  বিস্তারিত দেখুন
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
