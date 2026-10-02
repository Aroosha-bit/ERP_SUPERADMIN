import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.href ? <Link href={item.href} className="transition-colors hover:text-[#020D2B]">{item.label}</Link> : <span className="font-medium text-slate-700">{item.label}</span>}
          {index < items.length - 1 && <ChevronRight size={14} />}
        </div>
      ))}
    </nav>
  );
}