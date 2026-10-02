export default function ModulesIndicator({ enabled, total }: { enabled: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, index) => (
          <span key={index} className={`h-2 w-2 rounded-sm ${index < enabled ? "bg-[#20A9E8]" : "bg-slate-200"}`} />
        ))}
      </div>

      <span className="text-sm text-slate-500">{enabled}/{total}</span>
    </div>
  );
}