import PageContainer from "@/components/common/page-container/PageContainer";
import PageHeader from "@/components/common/page-header/PageHeader";

export default function OrganizationalHierarchyPage() {
  return (
    <PageContainer
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Organizational Hierarchy" },
      ]}
    >
      <PageHeader
        title="Organizational Hierarchy"
        description="Manage organizational hierarchy and reporting structure."
      />

      <div className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-slate-500">
        Organizational Hierarchy page is under development.
      </div>
    </PageContainer>
  );
}
