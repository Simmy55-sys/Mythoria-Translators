"use client";

import type React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import Image from "next/image";
import InbuiltEditor from "./global/inbuilt-editor";

interface Step2Props {
  selectedSeries: any;
  chapterData: any;
  updateChapterData: (updates: any) => void;
}

export default function AddChapterStepTwo({
  selectedSeries,
  chapterData,
  updateChapterData,
}: Step2Props) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateChapterData({ chapterFile: file });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateChapterData({ chapterImage: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        // Keep preview for display
        updateChapterData({ chapterImagePreview: event.target?.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Series Info */}
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

      {/* Chapter Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Chapter Number
          </label>
          <Input
            type="number"
            placeholder="e.g., 301"
            value={chapterData.chapterNumber}
            onChange={(e) =>
              updateChapterData({ chapterNumber: e.target.value })
            }
            className="border-[#27272A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Chapter Title
          </label>
          <Input
            placeholder="e.g., The Beginning of the End"
            value={chapterData.chapterTitle}
            onChange={(e) =>
              updateChapterData({ chapterTitle: e.target.value })
            }
            className="border-[#27272A]"
          />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium mb-3 text-foreground">
          Upload Chapter Content
        </label>
        <div className="space-y-3">
          <div className="flex max-md:flex-col gap-2">
            <button
              onClick={() => updateChapterData({ fileSource: "inbuilt" })}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all block w-full ${
                chapterData.fileSource === "inbuilt"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Inbuilt Editor
            </button>
            <button
              onClick={() => updateChapterData({ fileSource: "upload" })}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all block w-full ${
                chapterData.fileSource === "upload"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Direct Upload
            </button>
          </div>

          {chapterData.fileSource === "upload" ? (
            <div className="border-2 border-dashed border-[#27272A] rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <p className="text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {chapterData.chapterFile?.name || "No file selected"}
                </p>
              </label>
            </div>
          ) : (
            <div>
              <InbuiltEditor
                onSave={(content) => updateChapterData({ content })}
                initialContent={chapterData.content || ""}
                onImagesReady={(images) => updateChapterData({ images })}
              />
            </div>
          )}
        </div>
      </div>

      {/* Optional Chapter Image */}
      <div>
        <label className="block text-sm font-medium mb-3 text-foreground">
          Chapter Image (Optional)
        </label>
        <div className="border-2 border-dashed border-[#27272A] rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
          <input
            type="file"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            accept="image/*"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            {chapterData.chapterImagePreview || chapterData.chapterImage ? (
              <img
                src={
                  chapterData.chapterImagePreview ||
                  (typeof chapterData.chapterImage === "string"
                    ? chapterData.chapterImage
                    : "/placeholder.svg")
                }
                alt="Chapter"
                className="max-h-48 mx-auto rounded-lg"
              />
            ) : (
              <div>
                <p className="text-muted-foreground">
                  Click to upload chapter image
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
          </label>
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
              For better reader experience, use the inbuilt editor. This will
              add better effects that will help readers enjoy the stories.
            </li>
            <li className="text-sm">
              Only a single chapter can be uploaded at a time, if you want to
              upload multiple chapters, you can use the bulk chapter section
            </li>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
