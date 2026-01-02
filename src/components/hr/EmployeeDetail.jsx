"use client";
import React from "react";
import Image from "next/image";
import SalaryChart from "@/components/hr/SalaryChart";
import AttendanceGrid from "@/components/hr/AttendanceGrid";
import { useEmployee } from "@/hooks/useEmployee";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeDetail({ id }) {
  const { data, isLoading } = useEmployee(id);

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="mx-auto max-w-xl shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-3 gap-4">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
            <div className="mb-3">
              <Skeleton className="mb-2 h-9 w-36" />
              <Skeleton className="h-24" />
            </div>
            <div>
              <Skeleton className="mb-2 h-9 w-44" />
              <Skeleton className="h-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="mx-auto flex max-w-xl items-center justify-center p-8 shadow-lg">
        <span className="text-gray-500">No data</span>
      </Card>
    );
  }
  const { employee, salaryRecords = [], attendanceRecords = [] } = data;

  const joinDateString = employee.joiningDate || employee.createdAt;
  const join = joinDateString ? new Date(joinDateString) : new Date();
  const now = new Date();

  const diffInMonths = joinDateString
    ? Math.max(
        1,
        (now.getFullYear() - join.getFullYear()) * 12 +
          (now.getMonth() - join.getMonth()),
      )
    : 1;
  const totalPaid = salaryRecords.reduce((s, r) => s + (r.amount || 0), 0);
  const expected = (employee.salary || 0) * diffInMonths;
  const left = Math.max(0, expected - totalPaid);

  return (
    <Card className="bg-background mx-auto max-w-2xl border shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="border-primary relative h-20 w-20 overflow-hidden rounded-full border-2 shadow-lg">
          <Image
            src={employee.userId?.image || "/profile-placeholder.png"}
            alt={employee.userId?.name || "user"}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 space-y-0.5">
          <CardTitle className="text-2xl">{employee.userId?.name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span className="text-base">{employee.designation}</span>
            <Badge variant="outline" className="ml-2 capitalize">
              {employee.employmentStatus || "active"}
            </Badge>
          </CardDescription>
          <div className="text-xs text-gray-400">
            Joined: {joinDateString ? join.toLocaleDateString() : "Unknown"}
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 pb-6">
        <div className="mb-6 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
          <div className="bg-muted/60 flex flex-1 flex-col items-center rounded-lg border p-4 shadow-sm">
            <span className="text-muted-foreground mb-1 text-[10px] tracking-wider uppercase">
              Total Paid
            </span>
            <span className="text-primary text-lg font-bold">
              ₹{totalPaid.toLocaleString()}
            </span>
          </div>
          <div className="bg-muted/60 flex flex-1 flex-col items-center rounded-lg border p-4 shadow-sm">
            <span className="text-muted-foreground mb-1 text-[10px] tracking-wider uppercase">
              Expected Till Now
            </span>
            <span className="text-lg font-bold">
              ₹{expected.toLocaleString()}
            </span>
          </div>
          <div className="bg-muted/60 flex flex-1 flex-col items-center rounded-lg border p-4 shadow-sm">
            <span className="text-muted-foreground mb-1 text-[10px] tracking-wider uppercase">
              Amount Left
            </span>
            <span className="text-destructive text-lg font-bold">
              ₹{left.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-background border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Salary Payments</CardTitle>
              <CardDescription className="text-muted-foreground mb-2 text-xs">
                History of payments made to the employee.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalaryChart records={salaryRecords} />
            </CardContent>
          </Card>
          <Card className="bg-background border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">
                Attendance (last year)
              </CardTitle>
              <CardDescription className="text-muted-foreground mb-2 text-xs">
                Days present/absent in the last 12 months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceGrid records={attendanceRecords} />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
