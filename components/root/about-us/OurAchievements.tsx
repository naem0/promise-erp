import { getPublicAchievements } from "@/apiServices/aboutPageService";
import OurAchievementCart from "./OurAchievementCart";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

const OurAchievements = async () => {
  let achievementsData;
  try {
    achievementsData = await getPublicAchievements();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="py-8 md:py-12">
          <ErrorComponent
            message={
              achievementsData?.message || "Failed to fetch achievements data"
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
  const achievements = achievementsData?.data?.achievements || [];
  if (!achievements) {
    return (
      <div className="py-8 md:py-12">
        <NotFoundComponent message={achievementsData?.message || "No achievements found"} />
      </div>
    );
  }
  return <OurAchievementCart  achievements={achievements}/>;
};

export default OurAchievements;
