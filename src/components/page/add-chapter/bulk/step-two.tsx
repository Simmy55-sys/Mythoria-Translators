"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { FileTextIcon, PlusIcon, UploadIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import InbuiltEditor with SSR disabled
const InbuiltEditor = dynamic(
  () => import("../../add-chapter/global/inbuilt-editor"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] bg-[#27272A] border border-border rounded-lg flex items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    ),
  }
);

export default function AddBulkChaptersStepTwo({
  selectedSeries,
  chapters,
  addChapter,
  removeChapter,
  updateChapter,
  handleMultipleFileUpload,
}: {
  selectedSeries: any;
  chapters: any[];
  addChapter: () => void;
  removeChapter: (id: string) => void;
  updateChapter: (id: string, updates: any) => void;
  handleMultipleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border-primary/30 bg-linear-to-r from-primary/10 to-transparent flex flex-row items-center justify-between">
        <div className="flex max-md:flex-col gap-4">
          <div className="flex items-end gap-4 justify-center">
            <Image
              src={selectedSeries.featuredImage || "/placeholder.svg"}
              alt={selectedSeries.title}
              className="w-24 h-32 object-cover rounded-lg"
              width={96}
              height={128}
              quality={100}
              priority
            />
            <Badge className="bg-secondary capitalize md:hidden">
              {selectedSeries.novelType || "Novel"}
            </Badge>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              {selectedSeries.title}
            </h3>
            <p className="text-muted-foreground mb-2">
              by {selectedSeries.author}
            </p>
            <p className="text-sm text-primary font-semibold">
              {selectedSeries.chapters || 0} chapters published
            </p>
          </div>
        </div>
        <Badge className="bg-secondary capitalize max-md:hidden">
          {selectedSeries.novelType || "Novel"}
        </Badge>
      </Card>

      {/* Bulk Upload Section */}
      <Card className="p-6 border-[#27272A]">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Bulk Upload Files
        </h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-[#27272A] rounded-lg p-8 text-center">
            <UploadIcon
              className="mx-auto mb-4 text-muted-foreground"
              size={48}
            />
            <p className="text-sm text-muted-foreground mb-2">
              Upload multiple chapter files at once
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported formats: DOCX, PDF, TXT
            </p>
            <Input
              type="file"
              multiple
              accept=".docx,.pdf,.txt,.doc"
              onChange={handleMultipleFileUpload}
              className="hidden"
              id="bulk-file-upload"
            />
            <Button
              variant="outline"
              onClick={() =>
                document.getElementById("bulk-file-upload")?.click()
              }
              className="border-primary/30 hover:bg-primary/10 hover:text-white"
            >
              <UploadIcon size={16} className="mr-2" />
              Select Files
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Chapter Manually */}
      <div className="flex max-md:flex-col gap-4 justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">
          Chapters count: ({chapters.length})
        </h3>
        <Button
          onClick={addChapter}
          variant="outline"
          className="border-primary/30 hover:bg-primary/10 hover:text-white"
        >
          <PlusIcon size={16} className="mr-2" />
          Add Chapter Manually
        </Button>
      </div>

      {/* Chapters List */}
      <div className="space-y-4">
        {chapters.length === 0 ? (
          <Card className="p-8 text-center border-[#27272A]">
            <FileTextIcon
              className="mx-auto mb-4 text-muted-foreground"
              size={48}
            />
            <p className="text-muted-foreground">
              No chapters added yet. Upload files or add manually.
            </p>
          </Card>
        ) : (
          chapters.map((chapter, index) => (
            <Card key={chapter.id} className="p-6 border-[#27272A]">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-md font-semibold text-foreground">
                  Selected Number #{index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeChapter(chapter.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Chapter Number
                  </label>
                  <Input
                    type="number"
                    value={chapter.chapterNumber}
                    onChange={(e) =>
                      updateChapter(chapter.id, {
                        chapterNumber: e.target.value,
                      })
                    }
                    className="border-[#27272A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Chapter Title
                  </label>
                  <Input
                    placeholder="e.g., The Beginning"
                    value={chapter.chapterTitle}
                    onChange={(e) =>
                      updateChapter(chapter.id, {
                        chapterTitle: e.target.value,
                      })
                    }
                    className="border-[#27272A]"
                  />
                </div>
              </div>

              {/* File Source Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Content Source
                </label>
                <div className="flex max-md:flex-col gap-2">
                  <button
                    onClick={() =>
                      updateChapter(chapter.id, {
                        fileSource: "upload",
                      })
                    }
                    className={cn(
                      "flex-1 py-2 px-4 rounded-lg font-medium transition-all block w-full",
                      chapter.fileSource === "upload"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    Upload File
                  </button>
                  <button
                    onClick={() =>
                      updateChapter(chapter.id, {
                        fileSource: "inbuilt",
                      })
                    }
                    className={cn(
                      "flex-1 py-2 px-4 rounded-lg font-medium transition-all block w-full",
                      chapter.fileSource === "inbuilt"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    Inbuilt Editor
                  </button>
                </div>
              </div>

              {/* Content Input Based on Source */}
              <div className="mt-4">
                {chapter.fileSource === "upload" && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Chapter File
                    </label>
                    <Input
                      type="file"
                      accept=".docx,.pdf,.txt,.doc"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateChapter(chapter.id, {
                            chapterFile: file,
                          });
                        }
                      }}
                      className="border-[#27272A]"
                    />
                    {chapter.chapterFile && (
                      <p className="text-xs mt-1 text-accent">
                        Selected: {chapter.chapterFile.name}
                      </p>
                    )}
                  </div>
                )}

                {chapter.fileSource === "inbuilt" && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Chapter Content
                    </label>
                    <InbuiltEditor
                      onSave={(content) =>
                        updateChapter(chapter.id, {
                          content,
                        })
                      }
                      initialContent={chapter.content || ""}
                    />
                  </div>
                )}
              </div>

              {/* Premium Settings */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Chapter Type
                </label>
                <div className="flex max-md:flex-col items-center gap-4">
                  <button
                    onClick={() =>
                      updateChapter(chapter.id, {
                        isPremium: false,
                      })
                    }
                    className={cn(
                      "flex-1 py-3 px-4 rounded-lg font-medium transition-all block w-full",
                      !chapter.isPremium
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    Free Chapter
                  </button>
                  <button
                    onClick={() =>
                      updateChapter(chapter.id, {
                        isPremium: true,
                      })
                    }
                    className={cn(
                      "flex-1 py-3 px-4 rounded-lg font-medium transition-all block w-full",
                      chapter.isPremium
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    Premium Chapter
                  </button>
                </div>

                {chapter.isPremium && (
                  <div className="mt-4 space-y-2">
                    <label
                      htmlFor={`priceInCoins-${chapter.id}`}
                      className="block text-sm font-medium text-foreground"
                    >
                      Coin Price
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`priceInCoins-${chapter.id}`}
                        type="number"
                        min="1"
                        step="1"
                        value={chapter.priceInCoins || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value > 0) {
                            updateChapter(chapter.id, {
                              priceInCoins: value,
                            });
                          } else if (e.target.value === "") {
                            updateChapter(chapter.id, {
                              priceInCoins: 0,
                            });
                          }
                        }}
                        className="border-[#27272A] w-32"
                        placeholder="20"
                      />
                      <span className="text-sm text-muted-foreground">
                        coins
                      </span>
                    </div>
                    <p className="text-xs text-amber-500">
                      Users need coins to read this chapter. Default: 20 coins
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <Alert className="border-none bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-500 mt-10">
        <CircleAlertIcon className="mt-[5px]" />
        <AlertTitle className="text-lg">Chapter Guidlines</AlertTitle>
        <AlertDescription className="text-amber-600/80 dark:text-amber-400/80">
          <li className="text-sm">
            Ensure to use clear and descriptive titles (Or use the title from
            the series)
          </li>
          <li className="text-sm">
            The chapter numbers cannot contain a decimal.
          </li>
          <li className="text-sm">
            For better reader experience, use the inbuilt editor. This will add
            better effects that will help readers enjoy the stories.
          </li>
          <li className="text-sm">
            Ensure to upload the correct file type (DOCX, PDF, TXT, DOC), and
            fill the necessary fields for all active chapters.
          </li>
        </AlertDescription>
      </Alert>
    </div>
  );
}
