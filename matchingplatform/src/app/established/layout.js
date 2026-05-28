import { requireRoleServer } from "../../lib/auth/requireRoleServer";

export default async function EstablishedLayout({ children }) {
  await requireRoleServer(["established"]);
  return children;
}
