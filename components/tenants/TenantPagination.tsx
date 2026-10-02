import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  pageIndex: number;
  pageCount: number;
  previousPage: () => void;
  nextPage: () => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
}

export default function TenantPagination({ pageIndex, pageCount, previousPage, nextPage, canPreviousPage, canNextPage }: Props) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
      <span className="text-sm text-slate-500">Page {pageIndex + 1} of {pageCount}</span>

      <div className="flex items-center gap-2">
        <button type="button" onClick={previousPage} disabled={!canPreviousPage} className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronLeft size={17} />
        </button>

        <button type="button" onClick={nextPage} disabled={!canNextPage} className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}