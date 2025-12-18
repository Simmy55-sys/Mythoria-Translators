import ChapterDetailsComponent from "@/components/page/manage-series/details/chapter-details";

export default async function ChapterDetailsPage({
  params,
}: {
  params: Promise<{ series: string; chapter: string }>;
}) {
  const { series, chapter } = await params;
  return (
    <ChapterDetailsComponent
      params={{ seriesId: series, chapterId: chapter }}
    />
  );
}
