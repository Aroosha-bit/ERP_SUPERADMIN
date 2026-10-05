"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiBuilding2Line } from "react-icons/ri";
import { TbHierarchy } from "react-icons/tb";
import { PiBoundingBox } from "react-icons/pi";
import {
  LayoutDashboard,
  Building2,
  Settings,
  Network,
  GitBranch,
  List,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import type { ElementType } from "react";
import erplogo from "@/public/assets/erplogo.svg";
interface SidebarItem {
  title: string;
  href: string;
  icon: ElementType;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sidebarSections: SidebarSection[] = [
  {
    title: "PLATFORM",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Tenant Directory",
        href: "/tenants",
        icon: RiBuilding2Line,
      },
      {
        title: "Platform Settings",
        href: "/platform-settings",
        icon: Settings,
      },
    ],
  },

  {
    title: "REFERENCE DATA",
    items: [
      {
        title: "Enterprise Structure",
        href: "/enterprise-structure",
        icon: PiBoundingBox,
      },
      {
        title: "Organizational Hierarchy",
        href: "/organizational-hierarchy",
        icon: TbHierarchy,
      },
      
    ],
  },

  {
    title: "GOVERNANCE",
    items: [
      {
        title: "Audit Logs",
        href: "/audit-logs",
        icon: List,
      },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/40
          transition-opacity duration-300
          lg:hidden
          ${
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[280px] flex-col
          bg-[#020D2B] text-white

          transform transition-transform duration-300 ease-in-out

          lg:translate-x-0

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo / Brand */}
        <div className="flex h-[91px] shrink-0 items-center border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <Image src={erplogo} alt="ERPLO" />
            <div className="flex flex-col">
              <div className="text-[17px] font-semibold tracking-wide">ERP</div>
              <div className="whitespace-nowrap text-[13px] text-slate-300">
                Punjab Lands Records Authority
              </div>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <nav className=" flex-1
    overflow-y-auto
    px-4
    py-0

    [scrollbar-width:none]
    [-ms-overflow-style:none]
    [&::-webkit-scrollbar]:hidden">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-8">
              <div className="mb-4 px-0.5 text-[12px] font-medium tracking-wide text-slate-300">
                {section.title}
              </div>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        group relative flex h-14
                        items-center gap-4
                        rounded-lg px-4
                        text-[16px] font-medium
                        transition-all duration-200

                        ${
                          isActive
                            ? "bg-[#182544] text-white"
                            : "text-slate-100 hover:bg-white/5"
                        }
                      `}
                    >
                      {/* Active blue indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[#20A9E8]" />
                      )}

                      <Icon
                        size={23}
                        className={`
                          shrink-0
                          ${isActive ? "text-white" : "text-slate-200"}
                        `}
                      />

                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User / Bottom section */}
        <div className="shrink-0 border-t border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center ">
              <User size={20} />
            </div>

            <div className="min-w-0">
              <div className="text-[15px] font-semibold">PLRA</div>

              <div className="text-[13px] text-slate-400">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
