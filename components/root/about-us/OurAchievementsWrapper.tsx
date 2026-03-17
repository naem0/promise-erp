import OurAchievements from "./OurAchievements";
import AboutStats from "./AboutStats";
import { Suspense } from "react";
import OurAchievementSkeleton from "./OurAchievementSkeleton";
export interface InfoItem {
  id: number;
  title: string;
  value: string;
}

export const infoData: InfoItem[] = [
  {
    id: 1,
    title: "Students",
    value: "100,000+",
  },
  {
    id: 2,
    title: "Courses",
    value: "500+",
  },
  {
    id: 3,
    title: "Expert Trainer",
    value: "200+",
  },
  {
    id: 4,
    title: "Success Rate",
    value: "98%",
  },
];
const OurAchievementsWrapper = () => {
  return (
    <>
      <Suspense fallback={<OurAchievementSkeleton />}>
        <OurAchievements />
      </Suspense>
      <AboutStats gridCols={4} infoData={infoData} />
    </>
  );
};

export default OurAchievementsWrapper;
