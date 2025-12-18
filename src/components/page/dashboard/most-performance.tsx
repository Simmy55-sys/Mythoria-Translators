"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getMostPopularChaptersAction } from "@/server-actions/translator";

interface PopularChapter {
  id: string;
  title: string;
  chapterNumber: number;
  seriesTitle: string;
  purchaseCount: number;
  revenue: number;
}

const PerformanceChart = ({
  chapter,
  index,
}: {
  chapter: PopularChapter;
  index: number;
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center justify-between gap-3">
        <span
          data-slot="avatar"
          className="relative flex shrink-0 overflow-hidden size-9.5 rounded-md"
        >
          <span
            data-slot="avatar-fallback"
            className="flex items-center text-sm justify-center size-9.5 shrink-0 rounded-md [&amp;&gt;svg]:size-4.75 bg-[#27272A] text-white"
          >
            {index + 1}
          </span>
        </span>

        <div className="flex flex-col gap-0.5">
          <span className="font-medium line-clamp-1">{chapter.title}</span>
          <span className="text-muted-foreground text-sm">
            {chapter.seriesTitle} - Chapter {chapter.chapterNumber}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <Badge className="bg-primary/10 text-primary rounded-sm">
          {chapter.purchaseCount}{" "}
          {chapter.purchaseCount === 1 ? "Purchase" : "Purchases"}
        </Badge>
        <p className="text-sm ml-auto text-muted-foreground">
          $
          {chapter.revenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
};

export default function MostPerformance() {
  const [chapters, setChapters] = useState<PopularChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getMostPopularChaptersAction();
        if (result.success && result.data) {
          setChapters(result.data);
        } else {
          setError(result.error || "Failed to fetch popular chapters");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  return (
    <Card className="text-card-foreground flex flex-col rounded-xl border py-6 gap-6 shadow-none max-sm:col-span-full md:max-lg:col-span-full border-[#27272A] bg-[#18181B]">
      <CardHeader className="flex items-center justify-between">
        <span className="text-lg font-semibold">Most popular chapters</span>
      </CardHeader>

      <CardContent className="px-6 flex flex-1 flex-col justify-between gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center text-muted-foreground py-8">{error}</div>
        ) : chapters.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No popular chapters yet
          </div>
        ) : (
          chapters.map((chapter, index) => (
            <PerformanceChart
              key={chapter.id}
              chapter={chapter}
              index={index}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
