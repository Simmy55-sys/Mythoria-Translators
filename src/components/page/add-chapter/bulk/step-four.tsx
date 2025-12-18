import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";

export default function AddBulkChaptersStepFour({
  selectedSeries,
  chapters,
  bulkSettings,
}: {
  selectedSeries: any;
  chapters: any[];
  bulkSettings: any;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border-primary/50 bg-primary/5">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Review Bulk Chapters
        </h3>

        <div className="space-y-4">
          <div className="flex gap-4 pb-4 border-b border-border">
            <Image
              src={selectedSeries.featuredImage || "/placeholder.svg"}
              alt={selectedSeries.title}
              className="w-20 h-28 object-cover rounded-lg"
              width={80}
              height={112}
            />
            <div>
              <p className="text-xs text-muted-foreground">Series</p>
              <p className="font-semibold text-foreground">
                {selectedSeries.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                by {selectedSeries.author}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Total Chapters
              </p>
              <p className="font-semibold text-foreground">{chapters.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Language</p>
              <p className="font-semibold text-foreground capitalize">
                {bulkSettings.language}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Publish Date</p>
              <p className="font-semibold text-foreground">
                {bulkSettings.publishDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Chapter Type</p>
              <p className="font-semibold text-foreground">
                {bulkSettings.isPremium ? "Premium" : "Free"}
              </p>
            </div>
          </div>

          {bulkSettings.notes && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Notes</p>
              <p className="text-sm text-foreground">{bulkSettings.notes}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Chapters Summary */}
      <Card className="p-6 border-[#27272A]">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Chapters to Publish ({chapters.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  Chapter {chapter.chapterNumber}:{" "}
                  {chapter.chapterTitle || "Untitled"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Source:{" "}
                  {chapter.fileSource === "upload"
                    ? "File Upload"
                    : chapter.fileSource === "gdrive"
                    ? "Google Drive"
                    : "Inbuilt Editor"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Alert className="border-none bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-500">
        <CircleAlertIcon className="mt-[5px]" />
        <AlertTitle className="text-lg">Important</AlertTitle>
        <AlertDescription className="text-amber-600/80 dark:text-amber-400/80">
          <p className="text-sm">
            You are about to publish {chapters.length} chapter(s). This process
            may take a few minutes. Please do not close this page.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
