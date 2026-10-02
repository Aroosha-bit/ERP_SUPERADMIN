"use client";

import { useMemo, useState } from "react";
import { CircleAlert, ChevronDown, Plus } from "lucide-react";
import { tenantUsers } from "@/data/tenants";

export default function TenantUsers() {
  const [role, setRole] = useState("All");

  const admins = tenantUsers.filter((user) => user.isAdmin);

  const users = useMemo(() => {
    const nonAdmins = tenantUsers.filter((user) => !user.isAdmin);

    if (role === "All") return nonAdmins;

    return nonAdmins.filter((user) => user.role === role);
  }, [role]);

  const roles = ["All", ...Array.from(new Set(tenantUsers.filter((user) => !user.isAdmin).map((user) => user.role)))];

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 items-start gap-3 rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-4 text-sm text-slate-700">
          <CircleAlert size={19} className="mt-0.5 shrink-0 text-[#020D2B]" />
          <p>Full user &amp; role management happens in the tenant&apos;s own console (Users &amp; Roles). Shown here for support context only.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select value={role} onChange={(event) => setRole(event.target.value)} className="h-11 appearance-none rounded-lg border-0 bg-white py-2 pl-4 pr-10 text-sm text-slate-700 outline-none">
              {roles.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>

          <button type="button" className="flex h-11 items-center gap-2 rounded-lg bg-[#020D2B] px-5 text-sm font-medium text-white hover:bg-[#020D2B]/90">
            <Plus size={18} />
            New User
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[18px] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#020D2B]">Admin(s)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#020D2B]">Email</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar initials={admin.initials} />
                      <span className="text-sm text-slate-700">{admin.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">{admin.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[18px] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#020D2B]">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#020D2B]">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#020D2B]">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#020D2B]">Status</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-200 last:border-b-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar initials={user.initials} />
                      <span className="text-sm text-slate-700">{user.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.role}</td>

                  <td className="px-6 py-4">
                    <UserStatus status={user.status} />
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">No users found for this role.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UserAvatar({ initials }: { initials: string }) {
  return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-medium text-white">{initials}</div>;
}

function UserStatus({ status }: { status: "Active" | "Invited" | "Suspended" }) {
  const styles = {
    Active: "border-green-400 bg-green-50 text-green-600",
    Invited: "border-indigo-300 bg-indigo-50 text-indigo-600",
    Suspended: "border-red-400 bg-red-50 text-red-600",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {status}
    </span>
  );
}