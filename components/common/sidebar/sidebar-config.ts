import type { ElementType } from "react";
import { LayoutDashboard, Settings, List } from "lucide-react";
import { RiBuilding2Line } from "react-icons/ri";
import { TbHierarchy } from "react-icons/tb";
import { PiBoundingBox } from "react-icons/pi";

export const ERP_ROLES = {
  SUPER_ADMIN: "SYS_ADMIN",
  TENANT_ADMIN: "TenantAdmin",
} as const;

export type SidebarItem = {
  title: string;
  href?: string;
  icon: ElementType;
  allowedRoles?: string[];
  requiredPermissions?: string[];
  children?: SidebarItem[];
};

export type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

export const sidebarSections: SidebarSection[] = [
  {
    title: "PLATFORM",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        allowedRoles: [ERP_ROLES.SUPER_ADMIN],
      },
      {
        title: "Tenant Directory",
        href: "/tenants",
        icon: RiBuilding2Line,
        allowedRoles: [ERP_ROLES.SUPER_ADMIN],
      },
      {
        title: "Platform Settings",
        href: "/platform-settings",
        icon: Settings,
        allowedRoles: [ERP_ROLES.SUPER_ADMIN],
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
        allowedRoles: [ERP_ROLES.SUPER_ADMIN],
      },
      {
        title: "Organizational Hierarchy",
        href: "/organizational-hierarchy",
        icon: TbHierarchy,
        allowedRoles: [ERP_ROLES.SUPER_ADMIN],
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
        allowedRoles: [ERP_ROLES.SUPER_ADMIN],
      },
    ],
  },
];
