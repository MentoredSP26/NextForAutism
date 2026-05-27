import { requireRoleServer } from "../../lib/auth/requireRoleServer";

export default async function MatchingLayout({ children }) {
  await requireRoleServer(["admin"]);
  return children;
}
