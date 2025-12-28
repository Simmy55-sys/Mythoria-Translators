import { Card } from "@/components/ui/card";

interface Step4Props {
  selectedSeries: any;
  chapterData: any;
}

export default function AddChapterStepFour({
  selectedSeries,
  chapterData,
}: Step4Props) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border-primary/50 bg-primary/5">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Review Chapter Details
        </h3>

        <div className="space-y-4">
          {/* Series Info */}
          <div className="flex gap-4 pb-4 border-b border-border">
            <img
              src={selectedSeries.featuredImage || "/placeholder.svg"}
              alt={selectedSeries.title}
              className="w-20 h-28 object-cover rounded-lg"
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

          {/* Chapter Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Chapter Number
              </p>
              <p className="font-semibold text-foreground">
                {chapterData.chapterNumber || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Chapter Title
              </p>
              <p className="font-semibold text-foreground">
                {chapterData.chapterTitle || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Language</p>
              <p className="font-semibold text-foreground capitalize">
                {chapterData.language}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Publish Date</p>
              <p className="font-semibold text-foreground">
                {chapterData.publishDate}
              </p>
            </div>
          </div>

          {/* Chapter Type */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  chapterData.isPremium
                    ? "bg-secondary/20 text-secondary"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {chapterData.isPremium ? "Premium Chapter" : "Free Chapter"}
              </div>
            </div>
          </div>

          {/* Notes */}
          {chapterData.notes && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">
                Translator Notes
              </p>
              <p className="text-sm text-foreground">{chapterData.notes}</p>
            </div>
          )}

          {/* File Info */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Content Source</p>
            <p className="text-sm text-foreground">
              {chapterData.fileSource === "upload"
                ? "Direct Upload"
                : "Inbuilt Editor"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-primary/10 border-primary/50">
        <p className="text-sm text-foreground">
          ✓ Review all details above. Click{" "}
          <span className="font-semibold text-accent">Publish Chapter</span> to
          publish this chapter to your assigned series.
        </p>
      </Card>
    </div>
  );
}
