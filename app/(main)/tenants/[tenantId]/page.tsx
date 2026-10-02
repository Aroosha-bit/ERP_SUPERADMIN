import TenantDetails from "@/components/tenants/details/TenantDetails";

export default async function TenantDetailsPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;

  return <TenantDetails tenantId={tenantId} />;
}