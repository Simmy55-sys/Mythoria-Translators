"use client";

import { useEffect, useState } from "react";
import TranslatorSeriesAverageRating from "./average-series-rating";
import MostPerformance from "./most-performance";
import TotalEarningsAndReport from "./earnings-and-report";
import MetricCard from "./metric-card";
import {
  BookIcon,
  DollarSignIcon,
  FileIcon,
  MessageCircleIcon,
  ShoppingCartIcon,
} from "lucide-react";
import RecentPurchasesTable from "./recent-purchases";
import { getDashboardStatsAction } from "@/server-actions/translator";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TranslatorDashboardComponent() {
  const [stats, setStats] = useState<{
    seriesPublished: number;
    totalChapters: number;
    revenue: number;
    chapterSales: number;
    comments: number;
    averageRating: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getDashboardStatsAction();
        if (result.success && result.data) {
          setStats(result.data);
        } else {
          setError(result.error || "Failed to fetch dashboard statistics");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const records = stats
    ? [
        {
          stats: "Series Published",
          value: stats.seriesPublished,
          badge: "Total count",
          Icon: BookIcon,
        },
        {
          stats: "Total Chapters",
          value: stats.totalChapters,
          badge: "Chapter count",
          Icon: FileIcon,
        },
        {
          stats: "Revenue",
          value: `$${stats.revenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          badge: "Last 6 months",
          Icon: DollarSignIcon,
        },
        {
          stats: "Chapter Sales",
          value: stats.chapterSales,
          badge: "Last 6 months",
          Icon: ShoppingCartIcon,
        },
        {
          stats: "Comments",
          value: stats.comments.toString(),
          badge: "All Series",
          Icon: MessageCircleIcon,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
      <div className="grid grid-cols-2 gap-6 xl:grid-cols-3">
        <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6 xl:grid-cols-5 justify-items-center">
          {records.map((record) => (
            <MetricCard key={record.stats} {...record} />
          ))}
        </div>
        <TranslatorSeriesAverageRating averageRating={stats?.averageRating} />

        <MostPerformance />
        <div className="col-span-2 grid grid-cols-2 gap-6 xl:grid-cols-5">
          <TotalEarningsAndReport />
        </div>
      </div>

      <div className="mt-10">
        <RecentPurchasesTable />
      </div>
    </div>
  );
}
