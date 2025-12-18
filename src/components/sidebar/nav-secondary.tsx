"use client";

import * as React from "react";
import { IconSettings, IconHelp, IconSearch } from "@tabler/icons-react";
import { toast } from "sonner";
import InfoToast from "@/global/toasts/info";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Settings",
    url: "#",
    icon: IconSettings,
    isImplemented: false,
  },
  {
    title: "Get Help",
    url: "#",
    icon: IconHelp,
    isImplemented: false,
  },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: IconSearch,
  // },
];

export function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof items)[0]
  ) => {
    if (!item.isImplemented && item.url === "#") {
      e.preventDefault();
      const toastId = toast.custom(
        (t) => (
          <InfoToast
            text="We're working on creating this page. Please check back soon!"
            toastId={t}
          />
        ),
        { duration: 4000 }
      );
    }
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url} onClick={(e) => handleItemClick(e, item)}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
