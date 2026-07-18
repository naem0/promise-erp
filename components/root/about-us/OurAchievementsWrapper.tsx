import OurAchievements from "./OurAchievements";
import AboutStats from "./AboutStats";
import { Suspense } from "react";
import OurAchievementSkeleton from "./OurAchievementSkeleton";
import { cacheTag } from "next/cache";
import { getLatestCountDown } from "@/apiServices/homePageService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

const OurAchievementsWrapper = async () => {
  "use cache";
  cacheTag("stats-list");
  let stats;
  let countDownData;
  try {
    const params = {
      limit: 4,
      type: "achievement_stat",
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
    <>
      <Suspense fallback={<OurAchievementSkeleton />}>
        <OurAchievements />
      </Suspense>
      <AboutStats gridCols={4} infoData={stats} />
    </>
  );
};

export default OurAchievementsWrapper;
