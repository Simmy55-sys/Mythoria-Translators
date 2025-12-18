"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Download, Trash2 } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { manageSeriesDetail } from "@/routes/client";
import {
  getChapterByIdAction,
  getSeriesByIdAction,
  updateChapterAction,
  deleteChapterAction,
} from "@/server-actions/translator";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface ChapterResponse {
  id: string;
  title: string;
  chapterNumber: number;
  publishDate: string;
  isPremium: boolean;
  content: string;
  language?: string;
  fileUrl?: string;
}

interface SeriesResponse {
  id: string;
  title: string;
  slug: string;
}

export default function ChapterDetailsComponent({
  params,
}: {
  params: { seriesId: string; chapterId: string };
}) {
  const [chapter, setChapter] = useState<ChapterResponse | null>(null);
  const [series, setSeries] = useState<SeriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showFullContent, setShowFullContent] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch chapter details
        const chapterResult = await getChapterByIdAction(
          params.seriesId,
          params.chapterId
        );
        if (!chapterResult.success) {
          setError(chapterResult.error || "Failed to fetch chapter");
          setLoading(false);
          return;
        }

        setChapter(chapterResult.data);

        // Fetch series details for title
        const seriesResult = await getSeriesByIdAction(params.seriesId);
        if (seriesResult.success) {
          setSeries(seriesResult.data);
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
        console.error("Error fetching chapter details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.seriesId, params.chapterId]);

  // Calculate word count from content
  const wordCount = chapter?.content
    ? chapter.content.split(/\s+/).filter((word) => word.length > 0).length
    : 0;

  // Estimate read time (average reading speed: 200 words per minute)
  const readTime = Math.ceil(wordCount / 200);

  // Truncate content for preview (first 3 paragraphs or 500 characters)
  const getPreviewContent = (content: string) => {
    if (!content) return "";
    const paragraphs = content.split("\n").filter((p) => p.trim().length > 0);
    if (paragraphs.length <= 3) return content;

    // Get first 3 paragraphs
    const preview = paragraphs.slice(0, 3).join("\n\n");
    // If still too long, truncate to 500 characters
    if (preview.length > 500) {
      return preview.substring(0, 500) + "...";
    }
    return preview;
  };

  const previewContent = chapter?.content
    ? getPreviewContent(chapter.content)
    : "";
  const hasMoreContent =
    chapter?.content && chapter.content.length > previewContent.length;

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle delete chapter
  const handleDelete = async () => {
    if (!chapter) return;

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
      const result = await deleteChapterAction(
        params.seriesId,
        params.chapterId
      );

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

      // Redirect to series details page
      router.push(manageSeriesDetail(params.seriesId));
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
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center flex items-center gap-2">
              <Spinner />
              <p className="text-muted-foreground">
                Loading chapter details...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !chapter) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link
            href={manageSeriesDetail(params.seriesId)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition"
          >
            <ArrowLeft size={16} />
            Back to Series Chapters
          </Link>
          <Alert variant="destructive">
            <CircleAlertIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || "Chapter not found"}</AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <Link
          href={manageSeriesDetail(params.seriesId)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition"
        >
          <ArrowLeft size={16} />
          Back to Series Chapters
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            {series?.title || "Loading..."}
          </p>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {chapter.title}
              </h1>
              <p className="text-muted-foreground">
                Chapter {chapter.chapterNumber}
              </p>
            </div>
            <Badge
              variant={chapter.isPremium ? "secondary" : "default"}
              className="px-3 py-1 rounded-full text-sm font-semibold"
            >
              {chapter.isPremium ? "Premium" : "Published"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chapter Preview */}
            <Card className="bg-card border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Chapter Preview
              </h2>
              <div className="prose prose-invert max-w-none">
                {chapter.content ? (
                  <>
                    <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {(showFullContent ? chapter.content : previewContent)
                        .split("\n")
                        .map((para, index) => (
                          <p key={index} className="mb-4">
                            {para || "\u00A0"}
                          </p>
                        ))}
                    </div>
                    {hasMoreContent && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <Button
                          variant="outline"
                          onClick={() => setShowFullContent(!showFullContent)}
                          className="w-full border-primary/30 hover:bg-primary/10 text-foreground hover:text-foreground bg-transparent"
                        >
                          {showFullContent ? "Show Less" : "View Full Content"}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    No content available for preview.
                  </p>
                )}
              </div>
            </Card>

            {/* Chapter Information */}
            <Card className="bg-card border border-border p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Chapter Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Language</p>
                  <p className="text-foreground font-medium">
                    {chapter.language || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Read Time
                  </p>
                  <p className="text-foreground font-medium">
                    {readTime} {readTime === 1 ? "min" : "mins"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Word Count
                  </p>
                  <p className="text-foreground font-medium">
                    {wordCount.toLocaleString()}{" "}
                    {wordCount === 1 ? "word" : "words"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    File Available
                  </p>
                  <p className="text-foreground font-medium">
                    {chapter.fileUrl ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-primary" />
                    <span className="text-sm text-muted-foreground">Views</span>
                  </div>
                  <span className="text-lg font-bold text-primary">-</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <span className="text-sm text-muted-foreground">Likes</span>
                  <span className="text-lg font-bold text-primary">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Comments
                  </span>
                  <span className="text-lg font-bold text-primary">-</span>
                </div>
              </div>
            </Card>

            {/* Details Card */}
            <Card className="bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Published
                  </p>
                  <p className="text-sm text-foreground">
                    {formatDate(chapter.publishDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Availability
                  </p>
                  <p className="text-sm text-foreground">
                    {chapter.isPremium ? "Premium Only" : "Free to Read"}
                  </p>
                </div>
                {chapter.fileUrl && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Original File
                    </p>
                    <a
                      href={chapter.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View File
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href={`/add-chapter?seriesId=${params.seriesId}&chapterId=${params.chapterId}&edit=true`}
              >
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Edit size={16} />
                  Edit Chapter
                </Button>
              </Link>
              {chapter.fileUrl && (
                <Button
                  variant="outline"
                  className="w-full border-[#27272A] hover:text-foreground hover:bg-card bg-transparent"
                  onClick={() => window.open(chapter.fileUrl, "_blank")}
                >
                  <Download size={16} />
                  Download File
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full border-destructive/30 hover:bg-destructive/10 text-destructive bg-transparent hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={deleting}
              >
                <Trash2 size={16} />
                Delete Chapter
              </Button>
            </div>
          </div>
        </div>
        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection chapterId={params.chapterId} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              chapter "{chapter?.title}" and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
