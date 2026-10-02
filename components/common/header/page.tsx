"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({
  onMenuClick,
}: HeaderProps) {
  const pathname = usePathname();
  const pageTitle = pathname.startsWith("/tenants/create-tenant")
    ? "New Tenant"
    : pathname.startsWith("/tenants")
      ? "Tenant Directory"
      : "Dashboard";

  return (
    <header
      className="
        fixed right-0 top-0 z-30
        h-[91px]
        bg-[#020D2B]
        text-white

        left-0
        lg:left-[280px]
      "
    >
      <div className="flex h-full items-center justify-between px-5 sm:px-7 lg:px-8">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-4">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="
              rounded-lg p-2
              text-slate-200
              hover:bg-white/10
              lg:hidden
            "
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>

          <div className="min-w-0">
            <div className="text-[14px] font-medium text-slate-200 sm:text-[15px]">
              Platform Console
            </div>

            <h1 className="truncate text-[24px] font-semibold leading-tight sm:text-[26px]">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center">
          {/* Notification */}
          <button
            type="button"
            className="
              relative
              flex h-11 w-11
              items-center justify-center
              rounded-lg
              text-white
              hover:bg-white/10
            "
            aria-label="Notifications"
          >
            <Bell size={26} strokeWidth={1.8} />

            {/* Notification dot */}
            <span
              className="
                absolute
                right-[7px]
                top-[7px]
                h-2.5
                w-2.5
                rounded-full
                bg-red-500
                ring-2
                ring-[#020D2B]
              "
            />
          </button>
        </div>
      </div>
    </header>
  );
}