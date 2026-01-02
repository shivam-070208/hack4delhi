"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEmployees } from "@/hooks/useEmployees";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddEmployeeModal from "./AddEmployeemodel";

export default function EmployeeList() {
  const { data, isLoading, isError } = useEmployees();
  const list = data || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Employees</h2>
        <AddEmployeeModal />
      </div>

      <p className="text-muted-foreground mb-6 text-sm">
        View and manage employees with role and profile access.
      </p>

      {isLoading && (
        <div className="text-center text-sm text-gray-500">
          Loading employees…
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center text-red-700">
          Failed to load employees.
        </div>
      )}

      {list.length === 0 && !isLoading && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-center text-gray-600">
          No employees found.
        </div>
      )}

      {list.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <Card
              key={e._id}
              className="group relative border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg"
            >
              {/* Header */}
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border">
                  <Image
                    src={e.userId?.image || "/profile-placeholder.png"}
                    alt={e.userId?.name || "Employee"}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <CardTitle className="text-base font-semibold text-gray-900">
                    {e.userId?.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {e.userId?.email}
                  </CardDescription>
                </div>
              </CardHeader>

              {/* Body */}
              <CardContent className="pt-0">
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  {e.designation}
                </span>
              </CardContent>

              <CardAction className="flex justify-end px-6 pb-4">
                <Link href={`/hr/dashboard/employees/${e.userId._id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    View Profile
                  </Button>
                </Link>
              </CardAction>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
