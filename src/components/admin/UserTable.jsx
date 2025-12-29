export default function UserTable({ users }) {

  console.log(users)
  return (
    <table className="w-full border rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Name</th>
          <th>User ID</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <tr key={u._id} className="border-t text-center">
            <td className="p-2">{u.name}</td>
            <td>{u._id}</td>
            <td>{u.role}</td>
            <td className={u.status==="active"?"text-accent":"text-destructive"}>{u.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
