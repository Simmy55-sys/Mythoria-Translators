"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getRecentPurchasesAction } from "@/server-actions/translator";
import { manageSeriesChapterDetail } from "@/routes/client";
import Link from "next/link";

interface Purchase {
  id: string;
  purchaseDate: string;
  createdAt: string;
  chapterTitle: string;
  chapterNumber: number;
  chapterId: string;
  seriesTitle: string;
  seriesId: string;
  buyerUsername: string;
  revenue: number;
}

export default function RecentPurchasesTable() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getRecentPurchasesAction();
        if (result.success && result.data) {
          setPurchases(result.data);
        } else {
          setError(result.error || "Failed to fetch recent purchases");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  // Filter purchases based on search query
  const filteredPurchases = useMemo(() => {
    if (!searchQuery.trim()) {
      return purchases;
    }

    const query = searchQuery.toLowerCase();
    return purchases.filter(
      (purchase) =>
        purchase.chapterTitle.toLowerCase().includes(query) ||
        purchase.seriesTitle.toLowerCase().includes(query) ||
        purchase.buyerUsername.toLowerCase().includes(query) ||
        purchase.chapterNumber.toString().includes(query)
    );
  }, [purchases, searchQuery]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Card className="border border-[#27272A] bg-[#18181B]">
      <CardHeader>
        <div className="flex max-sm:flex-col sm:items-center justify-between gap-3">
          <div>
            <CardTitle>Recent Chapter Purchases</CardTitle>
            <CardDescription>
              Latest transactions from your readers
            </CardDescription>
          </div>
          <Input
            placeholder="Search..."
            className="sm:w-64 border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center text-muted-foreground py-8">
              {error}
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {searchQuery
                ? "No purchases found matching your search"
                : "No recent purchases"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#27272A] hover:bg-transparent">
                  <TableHead className="text-foreground font-semibold">
                    Purchase Date
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Chapter
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Series
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Buyer
                  </TableHead>
                  <TableHead className="text-foreground font-semibold text-right">
                    Revenue
                  </TableHead>
                  <TableHead className="text-foreground font-semibold text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow
                    key={purchase.id}
                    className="border-[#27272A] hover:bg-secondary/30 transition-colors"
                  >
                    <TableCell className="text-foreground text-sm">
                      {formatDate(purchase.createdAt || purchase.purchaseDate)}
                    </TableCell>
                    <TableCell className="text-foreground font-medium">
                      {purchase.chapterTitle} (Chapter {purchase.chapterNumber})
                    </TableCell>
                    <TableCell className="text-foreground text-sm">
                      {purchase.seriesTitle}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {purchase.buyerUsername}
                    </TableCell>
                    <TableCell className="text-foreground text-right font-medium">
                      $
                      {purchase.revenue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={manageSeriesChapterDetail(
                          purchase.seriesId,
                          purchase.chapterId
                        )}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-500 hover:text-blue-600 hover:bg-transparent gap-2"
                        >
                          View Chapter
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
