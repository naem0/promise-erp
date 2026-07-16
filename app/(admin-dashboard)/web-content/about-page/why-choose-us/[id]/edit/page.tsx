import { getWhyChooseUsById } from "@/apiServices/whyChooseUsService";
import WhyChooseUsForm from "@/components/web-content/about-page/why-choose-us/WhyChooseUsForm";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

export default async function EditWhyChooseUsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  
  let result;
  try {
    result = await getWhyChooseUsById(id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return <ErrorComponent message={error.message} />;
    } else {
      return <ErrorComponent message="An unexpected error occurred." />;
    }
  }

  if (!result || !result?.data) {
    return (
      <NotFoundComponent
        message={result?.message || "Why Choose Us entry not found"}
      />
    );
  }

  const item = result?.data;

  return (
      <div className="space-y-6 mx-auto">
        <WhyChooseUsForm title="Edit Why Choose Us Entry" item={item} />
      </div>
  );
}
