import ManageSeriesDetailsComponent from "@/components/page/manage-series/details";

export default async function ManageSeriesDetailPage({
  params,
}: {
  params: Promise<{ series: string }>;
}) {
  const { series } = await params;
  return <ManageSeriesDetailsComponent params={{ seriesId: series }} />;
}
