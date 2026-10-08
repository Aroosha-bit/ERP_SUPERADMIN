import { redirect } from "next/navigation";

export default function CreateTenantPage() {
  redirect("/tenants/create-tenant/organization-basics?new=1");
}