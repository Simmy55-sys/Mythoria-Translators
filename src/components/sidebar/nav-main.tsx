"use client";

import {
  IconBook,
  IconCirclePlusFilled,
  IconFilePlus,
  IconLibraryPlus,
  IconMail,
  IconDevicesCog,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  bulkChapters,
  manageSeries,
  newChapter,
  newSeries,
} from "@/routes/client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Add Chapter",
    url: newChapter,
    icon: IconFilePlus,
  },
  {
    title: "Add Bulk Chapters",
    url: bulkChapters,
    icon: IconLibraryPlus,
  },
  // {
  //   title: "Add Bulk Series",
  //   url: bulkSeries,
  //   icon: IconBook,
  // },
  {
    title: "Manage Series",
    url: manageSeries,
    icon: IconDevicesCog,
  },
];

export function NavMain() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:text-secondary-foreground active:bg-secondary/90 active:text-secondary-foreground min-w-8 duration-200 ease-linear"
              asChild
            >
              <Link href={newSeries}>
                <IconCirclePlusFilled />
                <span className="font-medium">New Series</span>
              </Link>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={cn(
                    isActive &&
                      "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
