import EmployeeDetail from "@/components/hr/EmployeeDetail";

export default async function page({ params }) {
  const { id } =await params;
  return (
    <div className="p-6">
      <EmployeeDetail id={id} />
    </div>
  );
}
