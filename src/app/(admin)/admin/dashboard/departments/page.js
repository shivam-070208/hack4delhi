import DepartmentPage from "@/components/admin/departments/DepartmentPage";
import { authRequire } from "@/lib/auth-utils";

export default async function AdminDepartmentsPage() {
  await authRequire("admin");

  return <DepartmentPage />;
}
