"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import ModeToggle from "../Header/ModeToggle";
import { GalleryVerticalEnd } from "lucide-react";

export function AdminSidebarHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          size="lg"
          className="cursor-default flex-row justify-between"
        >
          <div className="flex w-full items-center justify-between">
            {/* ✅ Brand (فقط در حالت expanded) */}
            <div className="flex flex-row items-center justify-between gap-2 overflow-hidden whitespace-nowrap transition-all group-data-[collapsed=true]:pointer-events-none group-data-[collapsed=true]:w-0 group-data-[collapsed=true]:opacity-0 md:gap-5">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground group flex size-8 shrink-0 items-center justify-center rounded-lg group-hover:cursor-pointer">
                <GalleryVerticalEnd className="size-4" />
                <ModeToggle className="cursor-pointer" />
              </div>

              <div className="text-right leading-tight">
                <div className="text-sm font-medium">Anima Home</div>
                <div className="text-muted-foreground text-sm">پنل مدیریت</div>
              </div>
            </div>

            {/* ✅ ModeToggle (button مستقل، بدون nesting) */}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
