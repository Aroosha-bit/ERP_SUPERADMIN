"use client";

export type TenantTab = "overview" | "modules" | "users" | "activity";

const tabs = [
  { label: "Overview", value: "overview", disabled: false },
  { label: "Modules", value: "modules", disabled: false },
  { label: "Users", value: "users", disabled: false },
  { label: "Activity", value: "activity", disabled: false },
  { label: "Roles", value: "roles", disabled: true },
] as const;

interface Props {
  activeTab: TenantTab;
  onChange: (tab: TenantTab) => void;
}

export default function TenantTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex overflow-x-auto border-b border-slate-200">
      {tabs.map((tab) => {
        const active = tab.value === activeTab;

        return (
          <button key={tab.value} type="button" disabled={tab.disabled} onClick={() => !tab.disabled && onChange(tab.value as TenantTab)} className={`cursor-pointer relative shrink-0 px-4 py-4 text-sm transition-colors ${active ? "font-semibold text-[#020D2B]" : "text-slate-600"} ${tab.disabled ? "cursor-not-allowed opacity-40" : "hover:text-[#020D2B]"}`}>
            {tab.label}
            {active && <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full bg-[#20A9E8]" />}
          </button>
        );
      })}
    </div>
  );
}