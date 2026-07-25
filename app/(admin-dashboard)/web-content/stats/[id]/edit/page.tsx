import { getStatById } from "@/apiServices/statsService";
import StatsForm from "@/components/web-content/stats/StatsForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

export default async function EditStatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  let result;
  try {
    result = await getStatById(id);
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
        message={result?.message || "Stat not found"}
      />
    );
  }

  const item = result?.data;

  return (
    <div className="space-y-6 mx-auto">
      <StatsForm title="Edit Statistics" item={item} />
    </div>
  );
}
