"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Step3Props {
  chapterData: any;
  updateChapterData: (updates: any) => void;
}

export default function AddChapterStepThree({
  chapterData,
  updateChapterData,
}: Step3Props) {
  return (
    <div className="space-y-6">
      {/* Publish Settings */}
      <Card className="p-6 border-[#27272A]">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Publish Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Publish Date
            </label>
            <Input
              type="date"
              value={chapterData.publishDate}
              onChange={(e) =>
                updateChapterData({ publishDate: e.target.value })
              }
              className=" border-[#27272A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Language
            </label>
            <Select
              onValueChange={(value) => updateChapterData({ language: value })}
            >
              <SelectTrigger
                id="read-chapter"
                className="w-full px-3 py-2 rounded-lg  border border-[#27272A] text-foreground capitalize"
              >
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent className="bg-[#27272A]">
                {[
                  "english",
                  "spanish",
                  "french",
                  "german",
                  "chinese",
                  "japanese",
                  "korean",
                ].map((language) => (
                  <SelectItem
                    value={String(language)}
                    className="hover:text-black hover:font-semibold group capitalize"
                    key={language}
                  >
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Chapter Type */}
      <Card className="p-6 border-[#27272A]">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Chapter Type
        </h3>

        <div className="flex max-md:flex-col items-center gap-4">
          <button
            onClick={() => updateChapterData({ isPremium: false })}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all block w-full ${
              !chapterData.isPremium
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Free Chapter
          </button>
          <button
            onClick={() => updateChapterData({ isPremium: true })}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all block w-full ${
              chapterData.isPremium
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Premium Chapter
          </button>
        </div>

        {chapterData.isPremium && (
          <div className="mt-4 space-y-2">
            <label
              htmlFor="priceInCoins"
              className="block text-sm font-medium text-foreground"
            >
              Coin Price
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="priceInCoins"
                type="number"
                min="1"
                step="1"
                value={chapterData.priceInCoins || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value) && value > 0) {
                    updateChapterData({ priceInCoins: value });
                  } else if (e.target.value === "") {
                    updateChapterData({ priceInCoins: 0 });
                  }
                }}
                className="border-[#27272A] w-32"
                placeholder="20"
              />
              <span className="text-sm text-muted-foreground">coins</span>
            </div>
            <p className="text-xs text-amber-500">
              Users need coins to read this chapter. Default: 20 coins
            </p>
          </div>
        )}
      </Card>

      {/* Additional Notes */}
      <Card className="p-6 border-[#27272A]">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Additional Notes
        </h3>
        <Textarea
          placeholder="Add any notes about this chapter (translator notes, special formatting, etc.)"
          value={chapterData.notes}
          onChange={(e) => updateChapterData({ notes: e.target.value })}
          className=" border-[#27272A] min-h-32 resize-none"
        />
      </Card>
    </div>
  );
}
