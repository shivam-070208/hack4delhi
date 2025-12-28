import { authRequire } from "@/lib/auth-utils";

import { connectDB } from "@/db/connect";
import User from "@/db/User";

import UserTable from "@/components/admin/UserTable";
import AddUserModal from "@/components/admin/AddUserModal";

export default async function AdminUsersPage() {
 await authRequire("admin");
 // RBAC check
await connectDB();

  const users = await User.find({
    role: { $in: ["HR", "EMPLOYEE"] },
  }).lean();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">HR & Employees</h1>
        <AddUserModal />
      </div>

      <UserTable users={users} />
    </div>
  );
}
