import PageContainer from "@/components/common/page-container/PageContainer";
import PageHeader from "@/components/common/page-header/PageHeader";

export default function PlatformSettingsPage() {
  return (
    <PageContainer
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Platform Settings" },
      ]}
    >
      <PageHeader
        title="Platform Settings"
        description="Manage platform-wide settings and configurations."
      />

      <div className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-slate-500">
        Platform Settings page is under development.
      </div>
    </PageContainer>
  );
}
