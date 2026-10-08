import TenantCreationWizard from "../tenant-creation-wizard";

export default async function BrandingPage({
  searchParams,
}: {
  searchParams: Promise<{ tenantId?: string }>;
}) {
  const { tenantId } = await searchParams;
  return <TenantCreationWizard stepIndex={5} tenantId={tenantId} />;
}
