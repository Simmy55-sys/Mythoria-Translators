import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AssignmentInformation({
  assignmentId,
  handleAssignmentIdChange,
  handleAssignmentIdBlur,
  assignmentError,
  searching,
}: {
  assignmentId: string;
  handleAssignmentIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAssignmentIdBlur: () => void;
  searching: boolean;
  assignmentError: string;
}) {
  {
    /* Assignment ID Card */
  }
  return (
    <Card className="p-6 border border-border/50 backdrop-blur-sm bg-[#27272A]/30">
      <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
          <Search className="w-4 h-4" />
        </span>
        Assignment Information
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Assignment ID
          </label>
          <div className="relative">
            <Input
              type="text"
              name="assignmentId"
              placeholder="Enter assignment ID..."
              value={assignmentId}
              onChange={handleAssignmentIdChange}
              onBlur={handleAssignmentIdBlur}
              className="w-full border-border pr-10"
              required
              autoComplete="off"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!searching && assignmentId && (
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer" />
            )}
          </div>
          {assignmentError && (
            <p className="text-sm text-destructive mt-1">{assignmentError}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Enter your assignment ID to auto-fill the series title
          </p>
        </div>
      </div>
    </Card>
  );
}
