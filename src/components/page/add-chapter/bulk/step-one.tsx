import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AddBulkChaptersStepOne({
  loadingSeries,
  seriesList,
  selectedSeries,
  setSelectedSeries,
  setNextChapterNumber,
}: {
  loadingSeries: boolean;
  seriesList: any[];
  selectedSeries: any;
  setSelectedSeries: React.Dispatch<React.SetStateAction<any>>;
  setNextChapterNumber: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-medium mb-3 text-foreground">
          Search Series
        </label>
        <Input
          placeholder="Search by series name..."
          className="border-[#27272A]"
        />
      </div>

      {loadingSeries ? (
        <div className="text-center py-8 text-muted-foreground flex items-center">
          <Spinner />
          Loading your assigned series, please wait.
        </div>
      ) : seriesList.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No series assigned to you yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {seriesList.map((series) => (
            <div
              key={series.id}
              onClick={() => {
                setSelectedSeries(series);
                setNextChapterNumber(String((series.chapters || 0) + 1));
              }}
              className={cn(
                "flex gap-4 p-4 rounded-lg hover:bg-accent/20 transition-colors group cursor-pointer",
                selectedSeries?.id === series.id &&
                  "border-primary border-2 bg-primary/10 shadow-lg shadow-primary/20"
              )}
            >
              <div className="shrink-0">
                <Image
                  src={series.featuredImage || "/placeholder.svg"}
                  alt={series.title}
                  width={100}
                  height={100}
                  className="w-20 h-24 rounded-lg object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                  {series.title}
                </h3>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Author: <span className="font-medium">{series.author}</span>
                  </p>
                  <p>
                    Chapters:{" "}
                    <span className="font-medium">{series.chapters || 0}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSeries && (
        <Card className="p-4 border-primary/50 bg-primary/5">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Selected:</span>{" "}
            {selectedSeries.title}
          </p>
        </Card>
      )}

      <Alert className="border-none bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-500 mt-10">
        <CircleAlertIcon className="mt-[5px]" />
        <AlertTitle className="text-lg">Series Guidlines</AlertTitle>
        <AlertDescription className="text-amber-600/80 dark:text-amber-400/80">
          <li className="text-sm">
            You can only see the series you have been assigned to.
          </li>
          <li className="text-sm">Make sure you select the correct series</li>
          <li className="text-sm">
            Double-check the series type (Novel/Comic). You cannot change the
            series after creating the chapter
          </li>
        </AlertDescription>
      </Alert>
    </div>
  );
}
