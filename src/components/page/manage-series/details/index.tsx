"use client";

import {
  manageSeries,
  manageSeriesChapterDetail,
  newChapter,
} from "@/routes/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Lock,
  Calendar,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getSeriesByIdAction,
  getSeriesChaptersAction,
  deleteChapterAction,
} from "@/server-actions/translator";
import EditSeriesDialog from "../edit-series-dialog";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import LoadingToast from "@/global/toasts/loading";
import ErrorToast from "@/global/toasts/error";
import SuccessToast from "@/global/toasts/success";
import CommentSection from "@/components/comment/comment-section";

interface Chapter {
  id: string;
  number: number;
  title: string;
  date: string;
  status: "published" | "draft" | "locked";
  views: number;
  locked: boolean;
}

interface SeriesResponse {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  status: "ongoing" | "completed";
  categories: string[];
  description?: string;
  author?: string;
}

interface ChapterResponse {
  id: string;
  title: string;
  chapterNumber: number;
  publishDate: string;
  isPremium: boolean;
}

export default function ManageSeriesDetailsComponent({
  params,
}: {
  params: { seriesId: string };
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [series, setSeries] = useState<SeriesResponse | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const chaptersPerPage = 20;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch series details
        const seriesResult = await getSeriesByIdAction(params.seriesId);
        if (!seriesResult.success) {
          setError(seriesResult.error || "Failed to fetch series");
          setLoading(false);
          return;
        }

        setSeries(seriesResult.data);

        // Fetch chapters
        const chaptersResult = await getSeriesChaptersAction(params.seriesId);
        if (!chaptersResult.success) {
          setError(chaptersResult.error || "Failed to fetch chapters");
          setLoading(false);
          return;
        }

        // Map backend chapters to frontend format
        const mappedChapters: Chapter[] = chaptersResult.data.map(
          (ch: ChapterResponse) => ({
            id: ch.id,
            number: ch.chapterNumber,
            title: ch.title,
            date: new Date(ch.publishDate).toLocaleDateString(),
            status: "published" as const, // All chapters from backend are published
            views: 0, // Not available from backend yet
            locked: ch.isPremium,
          })
        );

        // Sort by chapter number descending (newest first)
        mappedChapters.sort((a, b) => b.number - a.number);
        setChapters(mappedChapters);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
        console.error("Error fetching series details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.seriesId]);

  const startIdx = (currentPage - 1) * chaptersPerPage;
  const endIdx = startIdx + chaptersPerPage;
  const paginatedChapters = chapters.slice(startIdx, endIdx);
  const totalPages = Math.ceil(chapters.length / chaptersPerPage);

  // Handle delete chapter
  const handleDeleteClick = (chapter: Chapter) => {
    setChapterToDelete(chapter);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!chapterToDelete || !series) return;

    setDeleting(true);
    let notificationId: string | number = "";
    toast.custom(
      (t) => {
        notificationId = t;
        return <LoadingToast text="Deleting chapter. Please wait..." />;
      },
      { duration: Infinity }
    );

    try {
      const result = await deleteChapterAction(series.id, chapterToDelete.id);

      if (!result.success) {
        toast.custom(
          (t) => (
            <ErrorToast
              text={result.error || "Failed to delete chapter."}
              toastId={t}
            />
          ),
          { id: notificationId }
        );
        return;
      }

      toast.custom(
        (t) => (
          <SuccessToast text="Chapter deleted successfully!" toastId={t} />
        ),
        { id: notificationId }
      );

      // Remove chapter from list
      setChapters(chapters.filter((ch) => ch.id !== chapterToDelete.id));
      setDeleteDialogOpen(false);
      setChapterToDelete(null);
    } catch (err: any) {
      console.error("Error deleting chapter:", err);
      toast.custom(
        (t) => (
          <ErrorToast
            text={err.message || "Failed to delete chapter. Please try again."}
            toastId={t}
          />
        ),
        { id: notificationId }
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center flex items-center gap-2">
          <Spinner />
          <p className="text-muted-foreground">Loading series details...</p>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link
            href={manageSeries}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition"
          >
            <ArrowLeft size={16} />
            Back to Series
          </Link>
          <Alert variant="destructive">
            <CircleAlertIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || "Series not found"}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <Link
          href={manageSeries}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition"
        >
          <ArrowLeft size={16} />
          Back to Series
        </Link>

        {/* Series Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Image */}
          <div className="md:col-span-1">
            <Image
              src={series.featuredImage || "/placeholder.svg"}
              alt={series.title}
              className="w-full h-auto rounded-lg border border-border"
              width={100}
              height={100}
              quality={100}
              priority
            />
          </div>

          {/* Details */}
          <div className="md:col-span-3">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {series.title}
                </h1>
                <p className="text-muted-foreground">{series.slug}</p>
              </div>
              <Badge
                variant={series.status === "ongoing" ? "default" : "secondary"}
                className={`px-3 py-1 rounded-full font-semibold`}
              >
                {series.status === "ongoing" ? "Ongoing" : "Completed"}
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-[#27272A]/20 border border-[#27272A] p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Total Chapters
                </p>
                <p className="text-2xl font-bold text-primary">
                  {chapters.length}
                </p>
              </Card>
              <Card className="bg-[#27272A]/20 border border-[#27272A] p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Total Views
                </p>
                <p className="text-2xl font-bold text-primary">-</p>
              </Card>
              <Card className="bg-[#27272A]/20 border border-[#27272A] p-4">
                <p className="text-xs text-muted-foreground mb-1">Likes</p>
                <p className="text-2xl font-bold text-primary">-</p>
              </Card>
              <Card className="bg-[#27272A]/20 border border-[#27272A] p-4">
                <p className="text-xs text-muted-foreground mb-1">Bookmarks</p>
                <p className="text-2xl font-bold text-primary">-</p>
              </Card>
            </div>

            {/* Categories */}
            {series.categories && series.categories.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {series.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Link href={`${newChapter}?seriesId=${series.id}`}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus size={16} />
                  Add Chapter
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-[#27272A] hover:text-foreground hover:bg-card bg-transparent"
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit size={16} />
                Edit Series
              </Button>
            </div>
          </div>
        </div>

        {/* Chapters Table */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Chapters</h2>
          {chapters.length === 0 ? (
            <Card className="bg-[#27272A]/20 border border-[#27272A]/50 p-8 text-center">
              <p className="text-muted-foreground">
                No chapters yet. Add your first chapter!
              </p>
            </Card>
          ) : (
            <>
              <Card className="bg-[#27272A]/20 border border-[#27272A]/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-[#27272A]/50">
                      <tr className="bg-background/50">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">
                          Chapter
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">
                          Published
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">
                          Views
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272A]/50">
                      {paginatedChapters.map((chapter) => (
                        <tr
                          key={chapter.id}
                          className="hover:bg-background/50 transition"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            {chapter.number}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground line-clamp-1">
                            {chapter.title}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                                chapter.status === "published"
                                  ? "bg-green-500/20 text-green-400"
                                  : chapter.status === "draft"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {chapter.status === "published" && (
                                <CheckCircle size={14} />
                              )}
                              {chapter.status === "locked" && (
                                <Lock size={14} />
                              )}
                              {chapter.status.charAt(0).toUpperCase() +
                                chapter.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar size={14} />
                            {chapter.date}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-primary">
                            {chapter.views.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Link
                                href={manageSeriesChapterDetail(
                                  series.id,
                                  chapter.id
                                )}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  View
                                </Button>
                              </Link>
                              <Link
                                href={`${newChapter}?seriesId=${series.id}&chapterId=${chapter.id}&edit=true`}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Edit size={14} />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:text-destructive text-destructive/70"
                                onClick={() => handleDeleteClick(chapter)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-border"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage + i - 2;
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pageNum === currentPage ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={
                              pageNum === currentPage
                                ? "bg-primary text-primary-foreground"
                                : "border-border"
                            }
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="border-border"
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection seriesId={params.seriesId} />
        </div>
      </div>

      {/* Edit Series Dialog */}
      <EditSeriesDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
        }}
        seriesId={params.seriesId}
        onSuccess={() => {
          // Reload series data
          const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
              const seriesResult = await getSeriesByIdAction(params.seriesId);
              if (!seriesResult.success) {
                setError(seriesResult.error || "Failed to fetch series");
                setLoading(false);
                return;
              }
              setSeries(seriesResult.data);
            } catch (err: any) {
              setError(err.message || "An unexpected error occurred");
              console.error("Error fetching series details:", err);
            } finally {
              setLoading(false);
            }
          };
          fetchData();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              chapter "{chapterToDelete?.title}" and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
