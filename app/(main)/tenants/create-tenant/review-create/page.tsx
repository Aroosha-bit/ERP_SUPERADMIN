import TenantCreationWizard from "../tenant-creation-wizard";

export default async function ReviewCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ tenantId?: string }>;
}) {
  const { tenantId } = await searchParams;
  return <TenantCreationWizard stepIndex={6} tenantId={tenantId} />;
}
