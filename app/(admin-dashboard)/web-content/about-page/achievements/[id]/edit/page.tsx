import { getAchievementById } from "@/apiServices/achievementsService";
import AchievementsForm from "@/components/web-content/about-page/achievements/AchievementsForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  
  let result;
  try {
    result = await getAchievementById(id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!result || !result.data) {
    return (
      <NotFoundComponent
        message={result?.message || "Achievement not found"}
      />
    );
  }

  const item = result?.data;

  return (
      <div className="space-y-6 mx-auto">
        <AchievementsForm title="Edit Achievement" item={item} />
      </div>
  );
}
