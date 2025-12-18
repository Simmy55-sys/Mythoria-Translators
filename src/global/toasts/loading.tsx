import { LoaderIcon, X } from "lucide-react";

export default function LoadingToast({ text }: { text: string }) {
  return (
    <div className="rounded-2xl px-6 py-4 flex items-center gap-4 max-w-sm w-full text-card-foreground shadow-toast bg-[#27272A] border">
      {/* Info Icon */}
      <div className="shrink-0">
        <LoaderIcon className="animate-spin" />
      </div>

      {/* Message */}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>

      {/* Button */}
    </div>
  );
}
