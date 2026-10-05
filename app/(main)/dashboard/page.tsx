import PageContainer from "@/components/common/page-container/PageContainer";
import PageHeader from "@/components/common/page-header/PageHeader";

export default function DashboardPage() {
  return (
    <PageContainer breadcrumbs={[{ label: "Dashboard" }]}>
      <PageHeader
        title="Dashboard"
        description="Overview of the PLRA ERP platform."
      />

      <div className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-slate-500">
        Dashboard page is under development.
      </div>

      {/* Existing dashboard content */}
    </PageContainer>
  );
}
