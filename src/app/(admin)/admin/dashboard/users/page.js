import UserPage from "@/components/admin/user/UserPage";
import { authRequire } from "@/lib/auth-utils";

export default async function AdminUsersPage() {
  await authRequire("admin");

  return <UserPage />;
}
