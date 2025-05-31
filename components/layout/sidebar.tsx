"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { UserType } from "@/types";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ClipboardList, User as UserRound, LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      showFor: [UserType.SALES_MAKER, UserType.SALES_CHECKER],
    },
    {
      name: "Applications",
      href: "/applications",
      icon: ClipboardList,
      showFor: [UserType.SALES_MAKER, UserType.SALES_CHECKER],
    },
    {
      name: "Customers",
      href: "/customers",
      icon: UserRound,
      showFor: [UserType.SALES_MAKER, UserType.SALES_CHECKER],
    },
  ];

  const filteredNavigation = user 
    ? navigation.filter(item => item.showFor.includes(user.userType))
    : [];

  return (
    <div className="flex flex-col border-r bg-muted/10 w-16 md:w-64 overflow-y-auto">
      <div className="h-16 border-b flex items-center justify-center md:justify-start px-4">
        <h1 className="font-bold text-xl hidden md:block">LOS</h1>
        <h1 className="font-bold text-xl md:hidden">L</h1>
      </div>
      <div className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          {filteredNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6",
                  pathname === item.href 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              />
              <span className="hidden md:inline-block">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-2 mb-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-0 md:mr-2" />
          <span className="hidden md:inline-block">Logout</span>
        </Button>
      </div>
    </div>
  );
}