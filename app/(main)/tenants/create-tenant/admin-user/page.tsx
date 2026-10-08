import TenantCreationWizard from "../tenant-creation-wizard";

export default async function AdminUserPage({
  searchParams,
}: {
  searchParams: Promise<{ tenantId?: string }>;
}) {
  const { tenantId } = await searchParams;
  return <TenantCreationWizard stepIndex={4} tenantId={tenantId} />;
}
