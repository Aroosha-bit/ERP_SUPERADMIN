import TenantCreationWizard from "../tenant-creation-wizard";

export default async function PlanModulesPage({
  searchParams,
}: {
  searchParams: Promise<{ tenantId?: string }>;
}) {
  const { tenantId } = await searchParams;
  return <TenantCreationWizard stepIndex={3} tenantId={tenantId} />;
}
