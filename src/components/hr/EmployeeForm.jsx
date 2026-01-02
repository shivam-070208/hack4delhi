"use client";
import { useState } from "react";
import { useAddEmployee } from "@/hooks/useEmployee";

export default function EmployeeForm({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    salary: "",
  });
  const [error, setError] = useState("");
  const { mutate, isLoading } = useAddEmployee();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.designation ||
      !form.salary
    ) {
      setError("All fields are required");
      return;
    }
    mutate(
      {
        ...form,
        salary: Number(form.salary),
      },
      {
        onSuccess: () => {
          setForm({
            name: "",
            email: "",
            password: "",
            designation: "",
            salary: "",
          });
          onClose?.();
        },
        onError: (err) => {
          setError(err.message || "Error adding employee");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm">Name</label>
        <input
          name="name"
          className="w-full rounded border px-3 py-2"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Email</label>
        <input
          name="email"
          type="email"
          className="w-full rounded border px-3 py-2"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Password</label>
        <input
          name="password"
          type="password"
          className="w-full rounded border px-3 py-2"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Designation</label>
        <input
          name="designation"
          className="w-full rounded border px-3 py-2"
          value={form.designation}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Salary</label>
        <input
          name="salary"
          type="number"
          min={0}
          className="w-full rounded border px-3 py-2"
          value={form.salary}
          onChange={handleChange}
          required
        />
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="rounded px-4 py-2"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Add Employee"}
        </button>
      </div>
    </form>
  );
}
