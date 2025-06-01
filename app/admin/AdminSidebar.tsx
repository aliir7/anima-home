"use client";

import NavItems from "@/components/shared/Admin/NavItems";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu } from "lucide-react";
import ModeToggle from "@/components/shared/Header/ModeToggle";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="bg-card hidden h-screen w-64 flex-col border-r p-4 shadow-sm md:flex">
        <div className="flex-between">
          <h2 className="text-muted-foreground mt-4 mb-6 text-xl font-bold dark:text-white">
            پنل مدیریت
          </h2>
          <ModeToggle />
        </div>
        <NavItems />
      </aside>
      {/* Mobile Sidebar Trigger */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-4">
            <SheetTitle className="text-muted-foreground mt-6 mb-6 text-xl font-bold">
              پنل مدیریت
            </SheetTitle>
            <NavItems />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default AdminSidebar;
