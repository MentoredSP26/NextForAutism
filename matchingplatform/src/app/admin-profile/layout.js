import { requireRoleServer } from "../../lib/auth/requireRoleServer";

export default async function AdminProfileLayout({ children }) {
  await requireRoleServer(["admin"]);
  return children;
}
