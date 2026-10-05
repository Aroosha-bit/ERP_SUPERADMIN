import type { ReactNode } from "react";
import Breadcrumb from "@/components/common/breadcrumb/page";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageContainerProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export default function PageContainer({ children, breadcrumbs, className = "" }: PageContainerProps) {
  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-6">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      {children}
    </div>
  );
}