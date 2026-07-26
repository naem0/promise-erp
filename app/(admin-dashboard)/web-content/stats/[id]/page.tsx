import { redirect } from "next/navigation";

export default async function StatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/web-content/stats/${id}/edit`);
}
