"use client";
import React from "react";
import Image from "next/image";
import SalaryChart from "@/components/hr/SalaryChart";
import AttendanceGrid from "@/components/hr/AttendanceGrid";
import { useEmployee } from "@/hooks/useEmployee";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeDetail({ id }) {
  const { data, isLoading } = useEmployee(id);

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="max-w-xl mx-auto shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
            <div className="mb-3">
              <Skeleton className="h-9 w-36 mb-2" />
              <Skeleton className="h-24" />
            </div>
            <div>
              <Skeleton className="h-9 w-44 mb-2" />
              <Skeleton className="h-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="max-w-xl mx-auto p-8 flex justify-center items-center shadow-lg">
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
          (now.getMonth() - join.getMonth())
      )
    : 1;
  const totalPaid = salaryRecords.reduce((s, r) => s + (r.amount || 0), 0);
  const expected = (employee.salary || 0) * diffInMonths;
  const left = Math.max(0, expected - totalPaid);

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border bg-background">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-primary shadow-lg">
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
            <Badge variant="outline" className="ml-2 capitalize">{employee.employmentStatus || "active"}</Badge>
          </CardDescription>
          <div className="text-xs text-gray-400">
            Joined: {joinDateString ? join.toLocaleDateString() : "Unknown"}
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 pb-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 mb-6">
          <div className="flex-1 p-4 rounded-lg bg-muted/60 border flex flex-col items-center shadow-sm">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total Paid</span>
            <span className="font-bold text-lg text-primary">₹{totalPaid.toLocaleString()}</span>
          </div>
          <div className="flex-1 p-4 rounded-lg bg-muted/60 border flex flex-col items-center shadow-sm">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Expected Till Now</span>
            <span className="font-bold text-lg">₹{expected.toLocaleString()}</span>
          </div>
          <div className="flex-1 p-4 rounded-lg bg-muted/60 border flex flex-col items-center shadow-sm">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Amount Left</span>
            <span className="font-bold text-lg text-destructive">₹{left.toLocaleString()}</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-none shadow-sm bg-background">
            <CardHeader>
              <CardTitle className="text-base">Salary Payments</CardTitle>
              <CardDescription className="mb-2 text-xs text-muted-foreground">
                History of payments made to the employee.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalaryChart records={salaryRecords} />
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-background">
            <CardHeader>
              <CardTitle className="text-base">Attendance (last year)</CardTitle>
              <CardDescription className="mb-2 text-xs text-muted-foreground">
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
