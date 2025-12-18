"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  bulkChapters,
  bulkSeries,
  manageSeries,
  newChapter,
  newSeries,
} from "@/routes/client";
import { usePathname } from "next/navigation";
import { FaDiscord } from "react-icons/fa";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-[#27272A] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div>
          <div>
            <div className="flex items-center gap-3">
              {/* <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                <Upload className="w-4 h-4 text-primary-foreground" />
              </div> */}
              <h1 className="text-xl font-bold text-foreground">
                {headerMsg[pathname] ?? ""}
              </h1>
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://discord.gg/ztHauT2j"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              <FaDiscord className="size-4" />
              Discord channel
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

const headerMsg: Record<string, string> = {
  [newSeries]: "Add New Series",
  [newChapter]: "Add New Chapter",
  [bulkChapters]: "Add Bulk Chapters",
  [bulkSeries]: "Add Bulk Series",
  [manageSeries]: "Manage Your Series",
};
