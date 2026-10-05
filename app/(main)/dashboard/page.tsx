import PageContainer from "@/components/common/page-container/PageContainer";
import PageHeader from "@/components/common/page-header/PageHeader";

export default function DashboardPage() {
  return (
    <PageContainer
      breadcrumbs={[
        { label: "Dashboard" },
      ]}
    >
      <PageHeader
        title="Dashboard"
        description="Overview of the PLRA ERP platform."
      />

      {/* Existing dashboard content */}
    </PageContainer>
  );
}