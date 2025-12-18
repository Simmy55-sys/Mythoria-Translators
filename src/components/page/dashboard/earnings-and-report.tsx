"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { CircleDollarSignIcon, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getEarningsDataAction } from "@/server-actions/translator";

export const description = "A bar chart with a label";

const chartConfig = {
  earned: {
    label: "Earned",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function TotalEarningsAndReport() {
  const [earningsData, setEarningsData] = useState<{
    monthlyData: Array<{ month: string; earned: number }>;
    lastMonthEarnings: number;
    thisWeekEarnings: number;
    lastWeekEarnings: number;
    totalEarnings: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getEarningsDataAction(currentYear);
        if (result.success && result.data) {
          setEarningsData(result.data);
        } else {
          setError(result.error || "Failed to fetch earnings data");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [currentYear]);

  // Calculate percentage changes
  const thisWeekChange =
    earningsData && earningsData.lastWeekEarnings > 0
      ? ((earningsData.thisWeekEarnings - earningsData.lastWeekEarnings) /
          earningsData.lastWeekEarnings) *
        100
      : earningsData && earningsData.thisWeekEarnings > 0
      ? 100
      : 0;

  // Calculate performance (this week vs last week, or total if no last week data)
  const performance =
    earningsData && earningsData.lastWeekEarnings > 0
      ? ((earningsData.thisWeekEarnings - earningsData.lastWeekEarnings) /
          earningsData.lastWeekEarnings) *
        100
      : earningsData && earningsData.totalEarnings > 0
      ? 100
      : 0;

  // Format earnings for display
  const formatEarnings = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Card className="text-card-foreground flex-col rounded-xl border py-6 shadow-sm grid grid-cols-1 gap-4 md:grid-cols-5 col-span-full border-[#27272A] bg-[#18181B]">
        <div className="col-span-full flex items-center justify-center py-12">
          <Spinner />
        </div>
      </Card>
    );
  }

  if (error || !earningsData) {
    return (
      <Card className="text-card-foreground flex-col rounded-xl border py-6 shadow-sm grid grid-cols-1 gap-4 md:grid-cols-5 col-span-full border-[#27272A] bg-[#18181B]">
        <div className="col-span-full text-center text-muted-foreground py-12">
          {error || "Failed to load earnings data"}
        </div>
      </Card>
    );
  }

  // Transform data for chart (use "earned" instead of "desktop")
  const chartData = earningsData.monthlyData.map((item) => ({
    month: item.month,
    earned: item.earned,
  }));

  return (
    <Card className="text-card-foreground flex-col rounded-xl border py-6 shadow-sm grid grid-cols-1 gap-4 md:grid-cols-5 col-span-full border-[#27272A] bg-[#18181B]">
      <div className="max-md:border-b md:col-span-3 md:border-r border-[#27272A] md:pr-4">
        <CardHeader className="flex justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Total Earnings</span>
            <span className="text-muted-foreground text-sm">
              Yearly overview
            </span>
          </div>

          <p className="text-sm font-medium">{currentYear}</p>
        </CardHeader>

        <CardContent className="px-6 max-md:pb-6">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="earned" fill="var(--color-earned)" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </div>

      <div className="flex flex-col gap-8 md:col-span-2">
        <CardHeader className="flex justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Report</span>
            <span className="text-muted-foreground text-sm">
              Last month Earning is{" "}
              {formatEarnings(earningsData.lastMonthEarnings)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="px-6 flex flex-1 items-center">
          <div className="flex flex-1 justify-around gap-1">
            <div className="flex flex-col items-center gap-4 p-2">
              <span
                data-slot="avatar"
                className="relative flex shrink-0 overflow-hidden size-12 rounded-sm"
              >
                <span
                  data-slot="avatar-fallback"
                  className="flex size-full items-center justify-center bg-chart-5/10 text-chart-5 shrink-0 rounded-sm"
                >
                  <CircleDollarSignIcon className="size-6" />
                </span>
              </span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-muted-foreground">This week</span>
                <span
                  className={`text-2xl font-medium ${
                    thisWeekChange >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatPercentage(thisWeekChange)}
                </span>
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="h-[inherit]! bg-[#27272A]"
            />

            <div className="flex flex-col items-center gap-4 p-2">
              <span
                data-slot="avatar"
                className="relative flex shrink-0 overflow-hidden size-12 rounded-sm"
              >
                <span
                  data-slot="avatar-fallback"
                  className="flex size-full items-center justify-center bg-chart-5/10 text-chart-5 shrink-0 rounded-sm"
                >
                  <WalletIcon className="size-6" />
                </span>
              </span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-medium">
                  {formatEarnings(earningsData.totalEarnings)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <div className="px-6">
          <Separator orientation="horizontal" className="bg-[#27272A]" />
        </div>

        <CardFooter className="justify-between gap-2">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground">Performance</span>
            <span
              className={`text-xl font-medium ${
                performance >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatPercentage(performance)}
            </span>
          </div>

          <Button variant="outline">View Report</Button>
        </CardFooter>
      </div>
    </Card>
  );
}
