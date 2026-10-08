import TenantCreationWizard from "../tenant-creation-wizard";

export default async function BusinessUnitPage({
  searchParams,
}: {
  searchParams: Promise<{ tenantId?: string }>;
}) {
  const { tenantId } = await searchParams;
  return <TenantCreationWizard stepIndex={1} tenantId={tenantId} />;
}
