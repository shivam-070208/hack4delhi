"use client";

export default function UserForm({ onClose }) {
  return (
    <form className="space-y-3">
      <input className="input" placeholder="Name" />
      <input className="input" placeholder="Employee ID" />
      <input className="input" placeholder="Email" />

      <select className="input">
        <option value="">Select Role</option>
        <option value="HR">HR</option>
        <option value="EMPLOYEE">Employee</option>
      </select>

      <input className="input" placeholder="Department" />
      <input className="input" placeholder="Designation" />

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          Save
        </button>

        <button
          type="button"
          onClick={onClose}
          className="border px-4 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
