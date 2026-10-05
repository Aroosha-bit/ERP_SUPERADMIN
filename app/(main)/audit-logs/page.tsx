import PageContainer from "@/components/common/page-container/PageContainer";
import PageHeader from "@/components/common/page-header/PageHeader";

export default function AuditLogsPage() {
  return (
    <PageContainer
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Audit Logs" },
      ]}
    >
      <PageHeader
        title="Audit Logs"
        description="View platform activity and audit history."
      />

      <div className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-slate-500">
        Audit Logs page is under development.
      </div>
    </PageContainer>
  );
}
