import TenantCreationWizard from "../tenant-creation-wizard";

export default async function OrganizationBasicsPage({
  searchParams,
}: {
  searchParams: Promise<{ tenantId?: string; new?: string }>;
}) {
  const params = await searchParams;
  return (
    <TenantCreationWizard
      stepIndex={0}
      tenantId={params.tenantId}
      startNew={params.new === "1"}
    />
  );
}
