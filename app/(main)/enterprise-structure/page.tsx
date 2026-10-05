import PageContainer from "@/components/common/page-container/PageContainer";
import PageHeader from "@/components/common/page-header/PageHeader";

export default function EnterpriseStructurePage() {
  return (
    <PageContainer
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Enterprise Structure" },
      ]}
    >
      <PageHeader
        title="Enterprise Structure"
        description="Manage the enterprise structure of the organization."
      />

      <div className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-slate-500">
        Enterprise Structure page is under development.
      </div>
    </PageContainer>
  );
}
