import type { TenantStatus } from "@/types/tenant";

type FilterValue = "All" | TenantStatus;

interface Props {
  activeFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  counts: Record<FilterValue, number>;
}

const filters: FilterValue[] = ["All", "Active", "Trial", "Onboarding", "Suspended"];

export default function TenantFilters({ activeFilter, onFilterChange, counts }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => {
        const active = activeFilter === filter;

        return (
          <button key={filter} type="button" onClick={() => onFilterChange(filter)} className={`rounded-full border px-3 py-1 text-sm transition-colors ${active ? "border-[#020D2B] bg-[#020D2B] text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
            {filter} • {counts[filter]}
          </button>
        );
      })}
    </div>
  );
}