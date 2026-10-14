"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, User, X } from "lucide-react";
import Image from "next/image";

import erplogo from "@/public/assets/erplogo.svg";
import { useAuth } from "@/provider/AuthProvider";
import { sidebarSections, type SidebarItem } from "./sidebar-config";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function matchesRoute(pathname: string, href?: string) {
  if (!href) return false;

  return pathname === href || pathname.startsWith(`${href}/`);
}

function hasActiveRoute(item: SidebarItem, pathname: string): boolean {
  return (
    matchesRoute(pathname, item.href) ||
    (item.children?.some((child) => hasActiveRoute(child, pathname)) ?? false)
  );
}

function filterAuthorizedItems(
  items: SidebarItem[],
  roles: string[],
  permissions: string[],
): SidebarItem[] {
  return items.flatMap((item) => {
    const roleAllowed =
      !item.allowedRoles?.length ||
      item.allowedRoles.some((role) => roles.includes(role));

    const permissionAllowed =
      !item.requiredPermissions?.length ||
      item.requiredPermissions.every((permission) =>
        permissions.includes(permission),
      );

    if (!roleAllowed || !permissionAllowed) return [];

    const children = item.children
      ? filterAuthorizedItems(item.children, roles, permissions)
      : undefined;

    // Hide parents with no destination and no visible children.
    if (!item.href && item.children && !children?.length) {
      return [];
    }

    return [{ ...item, children }];
  });
}

function NavigationItem({
  item,
  pathname,
  onClose,
  depth = 0,
}: {
  item: SidebarItem;
  pathname: string;
  onClose: () => void;
  depth?: number;
}) {
  const active = hasActiveRoute(item, pathname);
  const hasChildren = Boolean(item.children?.length);

  const [expanded, setExpanded] = useState(active);

  useEffect(() => {
    if (active) {
      setExpanded(true);
    }
  }, [active]);

  const Icon = item.icon;

  const itemClass = `group relative flex min-h-12 w-full items-center gap-4 rounded-lg px-4 text-left text-[15px] font-medium transition-colors duration-200 ${
    active ? "bg-sidebar-active text-white" : "text-slate-100 hover:bg-white/5"
  }`;

  const content = (
    <>
      {active && (
        <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-accent" />
      )}

      <Icon size={22} className="shrink-0" />

      <span className="min-w-0 flex-1 truncate">{item.title}</span>

      {hasChildren && (
        <ChevronDown
          size={17}
          className={`shrink-0 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      )}
    </>
  );

  return (
    <div>
      {hasChildren ? (
        <button
          type="button"
          onClick={() => setExpanded((previous) => !previous)}
          aria-expanded={expanded}
          className={itemClass}
          style={{ paddingLeft: `${16 + depth * 12}px` }}
        >
          {content}
        </button>
      ) : item.href ? (
        <Link
          href={item.href}
          onClick={onClose}
          aria-current={matchesRoute(pathname, item.href) ? "page" : undefined}
          className={itemClass}
          style={{ paddingLeft: `${16 + depth * 12}px` }}
        >
          {content}
        </Link>
      ) : null}

      {hasChildren && expanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavigationItem
              key={child.href ?? child.title}
              item={child}
              pathname={pathname}
              onClose={onClose}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const roles = user?.roles ?? [];
  const permissions = user?.permissions ?? [];

  const visibleSections = useMemo(
    () =>
      sidebarSections
        .map((section) => ({
          ...section,
          items: filterAuthorizedItems(section.items, roles, permissions),
        }))
        .filter((section) => section.items.length > 0),
    [roles, permissions],
  );

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-[280px] flex-col bg-sidebar text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-[91px] shrink-0 items-center border-b border-gray-50 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <Image src={erplogo} alt="ERP Logo" className="shrink-0" />

            <div className="min-w-0">
              <div className="text-[17px] font-semibold tracking-wide">ERP</div>
              <div className="whitespace-nowrap text-[13px] text-slate-300">
                Punjab Lands Records Authority
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto shrink-0 rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 pb-6 pt-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visibleSections.map((section) => (
            <div key={section.title} className="mb-8 last:mb-0">
              <div className="mb-3 px-1 text-[12px] font-medium tracking-wide text-slate-400">
                {section.title}
              </div>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavigationItem
                    key={item.href ?? item.title}
                    item={item}
                    pathname={pathname}
                    onClose={onClose}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logged-in user */}
        <div className="shrink-0 border-t border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
              <User size={20} />
            </div>

            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold">
                {user?.name ?? "ERP User"}
              </div>

              <div className="text-[13px] text-slate-400">
                {roles.join(", ") || "No assigned role"}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
