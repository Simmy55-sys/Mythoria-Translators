"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { manageSeriesDetail, newSeries } from "@/routes/client";
import { getTranslatorSeriesAction } from "@/server-actions/translator";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import EditSeriesDialog from "./edit-series-dialog";

interface Series {
  id: string;
  title: string;
  slug: string;
  image: string;
  chapters: number;
  status: "ongoing" | "completed";
  views: number;
  rating: number;
}

interface SeriesResponse {
  id: string;
  title: string;
  author: string;
  featuredImage: string;
  novelType: string;
  chapters: number;
  slug?: string;
  status?: "ongoing" | "completed";
  views?: number;
  rating?: number;
}

export default function ManageSeriesComponent() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getTranslatorSeriesAction();
        if (result.success && result.data) {
          // Map backend response to frontend interface
          const mappedSeries: Series[] = result.data.map(
            (item: SeriesResponse) => ({
              id: item.id,
              title: item.title,
              slug: item.slug || item.title.toLowerCase().replace(/\s+/g, "-"),
              image: item.featuredImage || "/placeholder.svg",
              chapters: item.chapters || 0,
              status: item.status || "ongoing",
              views: item.views || 0,
              rating: item.rating || 0,
            })
          );
          setSeries(mappedSeries);
        } else {
          setError(result.error || "Failed to fetch series");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
        console.error("Error fetching series:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Manage Series
            </h1>
            <p className="text-muted-foreground">
              View and manage all your series
            </p>
          </div>
          <Link href={newSeries}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus size={20} />
              Add New Series
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center flex items-center gap-2">
              <Spinner />
              <p className="text-muted-foreground">Loading your series...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <Alert variant="destructive" className="mb-6">
            <CircleAlertIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Series Grid */}
        {!loading && !error && (
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {series.map((item) => (
              <Card
                key={item.id}
                className="border-none transition overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    width={100}
                    height={100}
                    quality={100}
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                  <Badge
                    variant={
                      item.status === "ongoing" ? "default" : "secondary"
                    }
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full font-semibold`}
                  >
                    {item.status === "ongoing" ? "Ongoing" : "Completed"}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.slug}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Chapters</p>
                      <p className="text-lg font-bold text-primary">
                        {item.chapters}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Views</p>
                      <p className="text-lg font-bold text-primary">
                        {item.views}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="text-lg font-bold text-primary">
                        {item.rating}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={manageSeriesDetail(item.id)} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-primary/30 hover:bg-primary/10 text-foreground bg-transparent hover:text-white"
                      >
                        <ChevronRight size={16} />
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-primary/30 hover:bg-primary/10 bg-transparent hover:text-white"
                      onClick={() => {
                        setSelectedSeriesId(item.id);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-destructive/30 hover:bg-destructive/10 text-destructive bg-transparent hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && series.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No Series Found
              </h2>
              <p className="text-muted-foreground mb-6">
                Start by creating your first series
              </p>
              <Link href={newSeries}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus size={20} />
                  Add New Series
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Edit Series Dialog */}
      {selectedSeriesId && (
        <EditSeriesDialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) {
              setSelectedSeriesId(null);
            }
          }}
          seriesId={selectedSeriesId}
          onSuccess={() => {
            // Refresh series list
            const fetchSeries = async () => {
              setLoading(true);
              setError("");
              try {
                const result = await getTranslatorSeriesAction();
                if (result.success && result.data) {
                  const mappedSeries: Series[] = result.data.map(
                    (item: SeriesResponse) => ({
                      id: item.id,
                      title: item.title,
                      slug: item.slug || item.title.toLowerCase().replace(/\s+/g, "-"),
                      image: item.featuredImage || "/placeholder.svg",
                      chapters: item.chapters || 0,
                      status: item.status || "ongoing",
                      views: item.views || 0,
                      rating: item.rating || 0,
                    })
                  );
                  setSeries(mappedSeries);
                } else {
                  setError(result.error || "Failed to fetch series");
                }
              } catch (err: any) {
                setError(err.message || "An unexpected error occurred");
                console.error("Error fetching series:", err);
              } finally {
                setLoading(false);
              }
            };
            fetchSeries();
          }}
        />
      )}
    </main>
  );
}
