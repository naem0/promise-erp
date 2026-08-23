import { Button } from "@/components/ui/button";
import { BriefcaseBusiness } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AboutStats from "./AboutStats";
import { cacheTag } from "next/cache";
import { getLatestCountDown } from "@/apiServices/homePageService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { CACHE_TAGS } from "@/constants/cacheTags";

const imageUrls = {
  img1: "/images/oppurtunity__0001.jpeg",
  img2: "/images/about-opportunities2.png",
  img3: "/images/about-opportunities3.png",
  img4: "/images/oppurtunity__0002.jpeg",
};
export interface InfoItem {
  id: number;
  value: string;
  title: string;
}

const AboutOpportunities = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.STATS);
  let stats;
  let countDownData;
  try {
    const params = {
      limit: 3,
      type: "opportunity_stat",
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
    <section className="py-8 md:py-12">
      <div className="max-w-full md:max-w-2xl pb-6 md:pb-8">
        <h2 className="text-2xl lg:text-4xl text-secondary font-bold tracking-tight mb-4">
          Getting You Connected to Opportunities
        </h2>
        <p>
          Our support doesn{"'"}t end with a certificate. We provide a complete
          path from the classroom to the professional world through dedicated
          job placement guidance and deep industry connections. By bridging the
          gap between learning and employment, we help you turn your technical
          skills into a stable, long-term career.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-2xl h-full">
        {/* Top Left - Group Discussion Image */}
        <div className="py-3 px-2 bg-white shadow rounded-2xl lg:col-span-2 ">
          <div className="relative h-[260px] lg:h-[360px] w-full rounded-2xl ">
            <Image
              src={(imageUrls.img1 && typeof imageUrls.img1 === "string" && imageUrls.img1.trim() !== "") ? imageUrls.img1 : "/images/placeholder_img.jpg"}
              fill
              alt="Group of professionals in a collaborative discussion"
              className="rounded-2xl object-cover h-full object-center"
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-primary text-white rounded-2xl p-8 flex flex-col justify-between gap-4 h-full">
            <span className="bg-white w-12 h-12 flex items-center justify-center rounded-lg">
              <BriefcaseBusiness className="text-primary w-6 h-6" />
            </span>
            <h3 className="text-xl xl:text-3xl font-bold mb-4">
              Job Placement Support
            </h3>
            <p className="text-lg">Skill to job placement</p>
            <ul className="space-y-2 text-base list-inside list-disc">
              <li>Resume Building</li>
              <li>Interview Preparation</li>
              <li>Career Counseling</li>
              <li>Networking</li>
            </ul>
            <div className="">
              <Button
                asChild
                className="bg-white text-primary hover:text-white"
              >
                <Link href="//job-circulars" prefetch={true}>
                  View Jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="py-3 px-2 bg-white shadow rounded-2xl lg:col-span-1">
          <div className="relative h-[260px] lg:h-[360px] w-full rounded-2xl ">
            <Image
              src={(imageUrls.img3 && typeof imageUrls.img3 === "string" && imageUrls.img3.trim() !== "") ? imageUrls.img3 : "/images/placeholder_img.jpg"}
              fill
              alt="Group of professionals in a collaborative discussion"
              className="rounded-2xl object-cover"
            />
          </div>
        </div>

        <div className="py-3 px-2 bg-white shadow rounded-2xl lg:col-span-2">
          <div className="relative h-[260px] lg:h-[360px] w-full rounded-2xl ">
            <Image
              src={(imageUrls.img4 && typeof imageUrls.img4 === "string" && imageUrls.img4.trim() !== "") ? imageUrls.img4 : "/images/placeholder_img.jpg"}
              fill
              alt="Group of professionals in a collaborative discussion"
              className="rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
      <AboutStats gridCols={3} infoData={stats} />
    </section>
  );
};

export default AboutOpportunities;
