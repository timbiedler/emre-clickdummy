"use client";

import { PageHeader } from "@/components/emre/app-shell";
import { StatusBadge } from "@/components/emre/status-badge";
import { platformUsers } from "@/data/users";
import { USER_ROLES } from "@/data/roles";
import { PERMISSION_MODULES, ROLE_PERMISSIONS } from "@/lib/permissions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApp } from "@/context/app-context";
import { useUi } from "@/lib/ui-i18n";

export default function AdminUsersPage() {
  const { role: currentRole } = useApp();
  const { t } = useUi();

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="nav.usersRoles"
        descriptionKey="admin.users"
      />

      <div className="surface-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {platformUsers.slice(0, 20).map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-slate-500 text-xs">{u.email}</TableCell>
                <TableCell>{t(`roles.${u.role}`)}</TableCell>
                <TableCell className="text-xs">{u.industry}</TableCell>
                <TableCell className="text-xs">{u.companyName}</TableCell>
                <TableCell>{u.country}</TableCell>
                <TableCell>
                  <StatusBadge variant={u.status === "active" ? "success" : "warning"}>
                    {u.status}
                  </StatusBadge>
                </TableCell>
                <TableCell className="text-xs text-slate-500">{u.lastLogin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="surface-card p-5 overflow-x-auto">
        <p className="text-sm font-semibold text-slate-900 mb-4">
          {t("admin.permissionMatrix")} — {t(`roles.${currentRole}`)}
        </p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 pr-4">Module</th>
              {["view", "create", "edit", "approve", "export", "admin"].map((a) => (
                <th key={a} className="px-2 py-2 capitalize">{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSION_MODULES.map((mod) => (
              <tr key={mod} className="border-b border-slate-100">
                <td className="py-2 pr-4 font-medium">{mod}</td>
                {(["view", "create", "edit", "approve", "export", "admin"] as const).map((action) => (
                  <td key={action} className="px-2 py-2 text-center">
                    {USER_ROLES.slice(0, 1).map(() =>
                      ROLE_PERMISSIONS.admin[mod]?.includes(action) ? "✓" : "—"
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
