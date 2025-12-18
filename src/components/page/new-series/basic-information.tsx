import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

export default function BasicInformation({
  formData,
  handleInputChange,
}: {
  formData: { title: string; slug: string; author: string };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  return (
    <Card className="p-6 border border-border/50 backdrop-blur-sm bg-[#27272A]/30">
      <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
          1
        </span>
        Basic Information
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Series Title
          </label>
          <Input
            type="text"
            name="title"
            placeholder="Automatically populated by the correct id..."
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border-border"
            required
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Slug (Auto-generated)
          </label>
          <Input
            type="text"
            name="slug"
            value={formData.slug}
            className="w-full border-border text-muted-foreground"
            disabled
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Author
            </label>
            <Input
              type="text"
              name="author"
              placeholder="Series author..."
              value={formData.author}
              onChange={handleInputChange}
              className="w-full border-border"
              required
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Translator
            </label>
            <Input
              type="text"
              name="translator"
              placeholder="Translator name..."
              value={formData.translator}
              onChange={handleInputChange}
              className="w-full border-border"
            />
          </div> */}
        </div>
      </div>
    </Card>
  );
}
