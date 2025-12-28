export default function UserTable({ users }) {
  return (
    <table className="w-full border rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Name</th>
          <th>Employee ID</th>
          <th>Role</th>
          <th>Department</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <tr key={u._id} className="border-t text-center">
            <td className="p-2">{u.name}</td>
            <td>{u.employeeId}</td>
            <td>{u.role}</td>
            <td>{u.department}</td>
            <td>
              {u.isActive ? (
                <span className="text-green-600">Active</span>
              ) : (
                <span className="text-red-600">Inactive</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
