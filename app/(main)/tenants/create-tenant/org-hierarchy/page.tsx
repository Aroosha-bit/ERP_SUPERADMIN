import TenantCreationWizard from "../tenant-creation-wizard";

export default async function OrganizationHierarchyPage({
  searchParams,
}: {
  searchParams: Promise<{ tenantId?: string }>;
}) {
  const { tenantId } = await searchParams;
  return <TenantCreationWizard stepIndex={2} tenantId={tenantId} />;
}
