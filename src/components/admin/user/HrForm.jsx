"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminAddUser, useAdminDepartmentsList } from "@/hooks/useAdmin";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["HR", "EMPLOYEE"], { message: "Select a role" }),
  departmentId: z.string().min(1, { message: "Select a department" }),
});

export default function UserForm({ onClose }) {
  const {
    data: departmentsData,
    isLoading: deptsLoading,
    isError: deptsError,
  } = useAdminDepartmentsList();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      departmentId: "",
    },
  });

  const addUser = useAdminAddUser();

  const onSubmit = async (values) => {
    try {
      await addUser.mutateAsync(values);
      onClose && onClose();
    } catch (err) {
      if (err?.message) {
        form.setError("root", { message: err.message });
      }
    }
  };

  let depts = departmentsData?.departments || [];
  if (!Array.isArray(depts) && Array.isArray(departmentsData)) {
    depts = departmentsData;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block font-medium">
          Name
        </label>
        <Input
          id="name"
          placeholder="Name"
          type="text"
          autoComplete="off"
          {...form.register("name")}
          aria-invalid={!!form.formState.errors.name}
        />
        {form.formState.errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="mb-1 block font-medium">
          Email
        </label>
        <Input
          id="email"
          placeholder="Email"
          type="email"
          autoComplete="off"
          {...form.register("email")}
          aria-invalid={!!form.formState.errors.email}
        />
        {form.formState.errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="mb-1 block font-medium">
          Password
        </label>
        <Input
          id="password"
          placeholder="Password"
          type="password"
          autoComplete="off"
          {...form.register("password")}
          aria-invalid={!!form.formState.errors.password}
        />
        {form.formState.errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {/* Role Field */}
      <div>
        <label htmlFor="role" className="mb-1 block font-medium">
          Role
        </label>
        <select
          id="role"
          className="input w-full rounded border px-3 py-2"
          {...form.register("role")}
          aria-invalid={!!form.formState.errors.role}
          value={form.watch("role")}
          onChange={(e) => {
            form.setValue("role", e.target.value);
          }}
        >
          <option value="">Select Role</option>
          <option value="HR">HR</option>
        </select>
        {form.formState.errors.role && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.role.message}
          </p>
        )}
      </div>

      {/* Department Select Field */}
      <div>
        <label htmlFor="departmentId" className="mb-1 block font-medium">
          Department
        </label>
        <select
          id="departmentId"
          className="input w-full rounded border px-3 py-2"
          {...form.register("departmentId")}
          aria-invalid={!!form.formState.errors.departmentId}
          value={form.watch("departmentId")}
          onChange={(e) => {
            form.setValue("departmentId", e.target.value);
          }}
          disabled={deptsLoading}
        >
          <option value="">Select Department</option>
          {depts.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
        {form.formState.errors.departmentId && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.departmentId.message}
          </p>
        )}
        {deptsError && (
          <p className="mt-1 text-sm text-red-600">
            Error loading departments.
          </p>
        )}
      </div>

      {/* General Form Error */}
      {form.formState.errors.root && (
        <div className="mt-2 text-sm text-red-600">
          {form.formState.errors.root.message}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Button
          type="submit"
          disabled={addUser.isLoading || form.isLoading}
          className="rounded bg-green-600 px-4 py-1 text-white"
        >
          {addUser.isLoading ? "Saving..." : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="rounded border px-4 py-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
