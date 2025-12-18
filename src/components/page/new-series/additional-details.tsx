import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = ["Ongoing", "Completed", "Hiatus"];

export default function AdditionalDetails({
  formData,
  handleInputChange,
  setFormData,
}: {
  formData: {
    status: string;
    novelType: string;
    language: string;
    originalLanguage: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) {
  return (
    <Card className="p-6 border border-border/50 backdrop-blur-sm bg-[#27272A]/30">
      <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
          4
        </span>
        Additional Details
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Series Type
          </label>
          <Select
            value={formData.novelType}
            onValueChange={(value: "novel" | "manga" | "manhwa") =>
              setFormData((prev: any) => ({ ...prev, novelType: value }))
            }
          >
            <SelectTrigger className="[&>span_svg]:text-muted-foreground/80 w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 border-[#27272A]">
              <SelectValue placeholder="Select series type" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 max-h-100 [&_*[role=option]]:pr-8 [&_*[role=option]]:pl-2 [&_*[role=option]>span]:right-2 [&_*[role=option]>span]:left-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0 bg-[#27272A]">
              {[
                {
                  value: "novel",
                  label: "Novel",
                  flag: "https://cdn.shadcnstudio.com/ss-assets/flags/korea.png",
                },
                {
                  value: "manga",
                  label: "Manga",
                  flag: "https://cdn.shadcnstudio.com/ss-assets/flags/japan.png",
                },
                {
                  value: "manhwa",
                  label: "Manhwa",
                  flag: "https://cdn.shadcnstudio.com/ss-assets/flags/korea.png",
                },
              ].map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <img
                    src={type.flag}
                    alt={`${type.label} flag`}
                    className="h-4 w-5"
                  />{" "}
                  <span className="truncate">{type.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Language
          </label>
          <Input
            type="text"
            name="language"
            placeholder="English"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Original Language
          </label>
          <Input
            type="text"
            name="originalLanguage"
            placeholder="Korean"
            value={formData.originalLanguage}
            onChange={handleInputChange}
            className="w-full border-border"
          />
        </div>
      </div>
    </Card>
  );
}
