"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminAddDepartment } from "@/hooks/useAdmin";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  code: z.string().min(1, { message: "Code is required" }),
  description: z.string().optional(),
});

export default function DepartmentForm({ onClose }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", code: "", description: "" },
  });

  const addDepartment = useAdminAddDepartment();

  const onSubmit = async (values) => {
    try {
      await addDepartment.mutateAsync(values);
      onClose && onClose();
    } catch (err) {
      if (err?.message) {
        form.setError("root", { message: err.message });
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block font-medium">
          Name
        </label>
        <Input
          id="name"
          placeholder="Department name"
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="code" className="mb-1 block font-medium">
          Code
        </label>
        <Input id="code" placeholder="Dept code" {...form.register("code")} />
        {form.formState.errors.code && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.code.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block font-medium">
          Description
        </label>
        <Input
          id="description"
          placeholder="Optional description"
          {...form.register("description")}
        />
      </div>

      {form.formState.errors.root && (
        <div className="mt-2 text-sm text-red-600">
          {form.formState.errors.root.message}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button
          type="submit"
          disabled={addDepartment.isLoading}
          className="rounded bg-green-600 px-4 py-1 text-white"
        >
          {addDepartment.isLoading ? "Saving..." : "Save"}
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
