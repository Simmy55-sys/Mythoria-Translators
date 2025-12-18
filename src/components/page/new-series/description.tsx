import { Card } from "@/components/ui/card";

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
  return (
    <Card className="p-6 border border-border/50 backdrop-blur-sm bg-[#27272A]/30">
      <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
          2
        </span>
        Description
      </h2>
      <textarea
        name="description"
        placeholder="Write a compelling summary for your novel..."
        value={description}
        onChange={handleInputChange}
        className="w-full border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0 focus:ring-primary/50 resize-none bg-[#27272A] border-[#27272A]"
        rows={6}
        required
      />
    </Card>
  );
}
