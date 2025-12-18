import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export default function AddBulkChaptersStepThree({
  bulkSettings,
  setBulkSettings,
}: {
  bulkSettings: any;
  setBulkSettings: React.Dispatch<React.SetStateAction<any>>;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border-[#27272A]">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Default Settings (Applied to All Chapters)
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Publish Date
            </label>
            <Input
              type="date"
              value={bulkSettings.publishDate}
              onChange={(e) =>
                setBulkSettings({
                  ...bulkSettings,
                  publishDate: e.target.value,
                })
              }
              className="border-[#27272A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Language
            </label>
            <Select
              onValueChange={(value) =>
                setBulkSettings({
                  ...bulkSettings,
                  language: value,
                })
              }
              value={bulkSettings.language}
            >
              <SelectTrigger className="w-full px-3 py-2 rounded-lg border border-[#27272A] text-foreground capitalize">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent className="bg-[#27272A]">
                {[
                  "English",
                  "Spanish",
                  "French",
                  "German",
                  "Chinese",
                  "Japanese",
                  "Korean",
                ].map((language) => (
                  <SelectItem
                    value={language}
                    className="hover:text-black hover:font-semibold group capitalize"
                    key={language}
                  >
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Chapter Type
            </label>
            <div className="flex max-md:flex-col items-center gap-4">
              <button
                onClick={() =>
                  setBulkSettings({
                    ...bulkSettings,
                    isPremium: false,
                  })
                }
                className={cn(
                  "flex-1 py-3 px-4 rounded-lg font-medium transition-all block w-full",
                  !bulkSettings.isPremium
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                Free Chapter
              </button>
              <button
                onClick={() =>
                  setBulkSettings({
                    ...bulkSettings,
                    isPremium: true,
                  })
                }
                className={cn(
                  "flex-1 py-3 px-4 rounded-lg font-medium transition-all block w-full",
                  bulkSettings.isPremium
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                Premium Chapter
              </button>
            </div>
            {bulkSettings.isPremium && (
              <p className="text-xs mt-3 text-amber-500">
                Users need coins to read these chapters
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Additional Notes (Optional)
            </label>
            <Textarea
              placeholder="Add notes that will apply to all chapters..."
              value={bulkSettings.notes}
              onChange={(e) =>
                setBulkSettings({
                  ...bulkSettings,
                  notes: e.target.value,
                })
              }
              className="border-[#27272A] min-h-32 resize-none"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
