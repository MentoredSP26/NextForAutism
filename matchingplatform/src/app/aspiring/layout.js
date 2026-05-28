import { requireRoleServer } from "../../lib/auth/requireRoleServer";

export default async function AspiringLayout({ children }) {
  await requireRoleServer(["aspiring"]);
  return children;
}
