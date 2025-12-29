"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminAddUser } from "@/hooks/useAdmin";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["HR", "EMPLOYEE"], { message: "Select a role" }),
});

export default function UserForm({ onClose }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block font-medium mb-1">Name</label>
        <Input
          id="name"
          placeholder="Name"
          type="text"
          autoComplete="off"
          {...form.register("name")}
          aria-invalid={!!form.formState.errors.name}
        />
        {form.formState.errors.name && (
          <p className="text-red-600 text-sm mt-1">{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block font-medium mb-1">Email</label>
        <Input
          id="email"
          placeholder="Email"
          type="email"
          autoComplete="off"
          {...form.register("email")}
          aria-invalid={!!form.formState.errors.email}
        />
        {form.formState.errors.email && (
          <p className="text-red-600 text-sm mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>
      
      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block font-medium mb-1">Password</label>
        <Input
          id="password"
          placeholder="Password"
          type="password"
          autoComplete="off"
          {...form.register("password")}
          aria-invalid={!!form.formState.errors.password}
        />
        {form.formState.errors.password && (
          <p className="text-red-600 text-sm mt-1">{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Role Field */}
      <div>
        <label htmlFor="role" className="block font-medium mb-1">Role</label>
        <select
          id="role"
          className="input w-full border rounded px-3 py-2"
          {...form.register("role")}
          aria-invalid={!!form.formState.errors.role}
          value={form.watch("role")}
          onChange={e => {
            form.setValue("role", e.target.value);
          }}
        >
          <option value="">Select Role</option>
          <option value="HR">HR</option>
        </select>
        {form.formState.errors.role && (
          <p className="text-red-600 text-sm mt-1">{form.formState.errors.role.message}</p>
        )}
      </div>

      {/* General Form Error */}
      {form.formState.errors.root && (
        <div className="text-red-600 text-sm mt-2">{form.formState.errors.root.message}</div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          type="submit"
          disabled={addUser.isLoading}
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          {addUser.isLoading ? "Saving..." : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border px-4 py-1 rounded"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
