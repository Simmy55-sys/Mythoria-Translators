"use client";

import Link from "next/link";
import {
  IconDashboard,
  IconDots,
  IconReport,
  IconTrack,
} from "@tabler/icons-react";
import { toast } from "sonner";
import InfoToast from "@/global/toasts/info";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboard } from "@/routes/client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  {
    name: "Dashboard",
    url: dashboard,
    icon: IconDashboard,
    isImplemented: true,
  },
  {
    name: "Novels Report",
    url: "#",
    icon: IconReport,
    isImplemented: false,
  },
  {
    name: "Payment Tracking",
    url: "#",
    icon: IconTrack,
    isImplemented: false,
  },
];

export function NavDocuments() {
  const pathname = usePathname();

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
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Analytics</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={cn(
                  isActive &&
                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                )}
              >
                <Link href={item.url} onClick={(e) => handleItemClick(e, item)}>
                  <item.icon />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <IconDots className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
