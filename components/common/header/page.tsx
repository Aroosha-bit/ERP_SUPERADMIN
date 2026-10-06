"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
}

const pageTitles = [
  {
    path: "/tenants/create-tenant",
    title: "New Tenant",
  },
  {
    path: "/tenants",
    title: "Tenant Directory",
  },
  {
    path: "/platform-settings",
    title: "Platform Settings",
  },
  {
    path: "/enterprise-structure",
    title: "Enterprise Structure",
  },
  {
    path: "/organizational-hierarchy",
    title: "Organizational Hierarchy",
  },
  {
    path: "/audit-logs",
    title: "Audit Logs",
  },
  {
    path: "/dashboard",
    title: "Dashboard",
  },
];

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const pageTitle =
    pageTitles.find(
      (page) => pathname === page.path || pathname.startsWith(`${page.path}/`),
    )?.title ?? "Dashboard";

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-[91px] bg-primary text-white lg:left-[280px]">
      <div className="flex h-full items-center justify-between px-4 sm:px-7 lg:px-8">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="shrink-0 rounded-lg p-2 text-slate-200 transition-colors hover:bg-white/10 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>

          <div className="min-w-0">
            <div className="text-[13px] font-medium text-slate-300 sm:text-[15px]">
              Platform Console
            </div>

            <h1 className="truncate text-[20px] font-semibold leading-tight sm:text-[26px]">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
            aria-label="Notifications"
          >
            <Bell size={26} strokeWidth={1.8} />

            <span className="absolute right-[7px] top-[7px] h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#020D2B]" />
          </button>
        </div>
      </div>
    </header>
  );
}
