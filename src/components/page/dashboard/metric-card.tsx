import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronUp } from "lucide-react";

export default function MetricCard({
  stats,
  value,
  badge,
  Icon,
}: {
  stats: string;
  value: number | string;
  badge: string;
  Icon: (props: React.ComponentProps<React.ElementType>) => React.ReactNode;
}) {
  return (
    <Card className="shadow-none border-[#27272A] w-[151.33px] bg-[#18181B]">
      <CardHeader className="flex items-center justify-between">
        <span
          data-slot="avatar"
          className="relative flex shrink-0 overflow-hidden size-9.5 rounded-md mx-auto"
        >
          <span
            data-slot="avatar-fallback"
            className="flex items-center justify-center size-9.5 shrink-0 rounded-md [&amp;&gt;svg]:size-4.75 bg-chart-1/20 text-chart-1"
          >
            <Icon className="size-4" />
          </span>
        </span>
      </CardHeader>

      <CardContent className="px-6 flex flex-1 flex-col justify-between gap-4">
        <p className="flex flex-col gap-1 mx-auto text-center">
          <span className="text-lg font-semibold">{value}</span>
          <span className="text-muted-foreground text-sm">{stats}</span>
        </p>

        <Badge className="mx-auto">{badge}</Badge>
      </CardContent>
    </Card>
  );
}
