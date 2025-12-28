"use client";

import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("./rich-text-editor"),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 p-2 bg-slate-800/50 rounded-lg border border-border">
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          <div className="w-px h-6 bg-border mx-1" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
        </div>
        <div className="border border-border rounded-lg bg-[#27272A] min-h-[150px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading editor...</p>
        </div>
      </div>
    ),
  }
);

export default function Description({
  description,
  handleInputChange,
}: {
  description: string;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  const handleDescriptionChange = (html: string) => {
    // Create a synthetic event to match the expected signature
    const syntheticEvent = {
      target: {
        name: "description",
        value: html,
      },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    handleInputChange(syntheticEvent);
  };

  return (
    <Card className="p-6 border border-border/50 backdrop-blur-sm bg-[#27272A]/30">
      <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
          2
        </span>
        Description
      </h2>
      <RichTextEditor
        content={description}
        onChange={handleDescriptionChange}
        placeholder="Write a compelling summary for your novel..."
      />
    </Card>
  );
}
