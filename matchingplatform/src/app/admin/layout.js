import { requireRoleServer } from "../../lib/auth/requireRoleServer";

export default async function AdminLayout({ children }) {
  await requireRoleServer(["admin"]);
  return children;
}
