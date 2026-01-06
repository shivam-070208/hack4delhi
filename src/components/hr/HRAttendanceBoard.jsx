"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Loader,
  RefreshCw,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMarkAttendance, useAttendanceList } from "@/hooks/useAttendance";
import { useEmployees } from "@/hooks/useEmployees";

export default function HRAttendanceBoard() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [status, setStatus] = useState("present");
  const [hours, setHours] = useState(8);

  const { data: employees = [] } = useEmployees();
  const { data: attendanceRecords = [], isLoading } = useAttendanceList(
    month,
    selectedEmployeeId,
  );
  const markAttendanceMutation = useMarkAttendance();

  const handleMarkAttendance = () => {
    if (!selectedEmployeeId) {
      toast.error("Please select an employee");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    markAttendanceMutation.mutate(
      {
        userId: selectedEmployeeId,
        date: new Date(selectedDate),
        status,
        hours: status === "halfday" ? parseFloat(hours) : 0,
      },
      {
        onSuccess: () => {
          toast.success("Attendance recorded successfully!");
          setSelectedDate(new Date().toISOString().split("T")[0]);
          setStatus("present");
          setHours(8);
        },
        onError: (error) => {
          toast.error(`Error: ${error.message}`);
        },
      },
    );
  };

  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter((r) => r.status === "present").length,
    absent: attendanceRecords.filter((r) => r.status === "absent").length,
    halfday: attendanceRecords.filter((r) => r.status === "halfday").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-300";
      case "absent":
        return "bg-red-100 text-red-800 border-red-300";
      case "halfday":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="h-4 w-4" />;
      case "absent":
        return <XCircle className="h-4 w-4" />;
      case "halfday":
        return <Clock className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Attendance Management
        </h1>
        <p className="mt-2 text-base font-medium text-slate-600">
          Track and manage employee attendance
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-700">Total Records</p>
            <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm text-green-700">Present</p>
            <p className="text-3xl font-bold text-green-900">{stats.present}</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm text-red-700">Absent</p>
            <p className="text-3xl font-bold text-red-900">{stats.absent}</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-700">Half Day</p>
            <p className="text-3xl font-bold text-yellow-900">
              {stats.halfday}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Record Attendance Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-200 bg-white">
          <CardTitle className="text-lg font-bold text-slate-900">
            Record Attendance
          </CardTitle>
          <CardDescription>Mark attendance for an employee</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-900">
                Employee
              </label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                disabled={markAttendanceMutation.isPending}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Select an employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.userId}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Date
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-2 border-slate-300"
                  disabled={markAttendanceMutation.isPending}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={markAttendanceMutation.isPending}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="halfday">Half Day</option>
                </select>
              </div>

              {status === "halfday" && (
                <div>
                  <label className="text-sm font-semibold text-slate-900">
                    Hours
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="8"
                    step="0.5"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    disabled={markAttendanceMutation.isPending}
                    className="mt-2 border-slate-300"
                    placeholder="Hours worked"
                  />
                </div>
              )}
            </div>

            <Button
              onClick={handleMarkAttendance}
              disabled={markAttendanceMutation.isPending || !selectedEmployeeId}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md hover:from-indigo-700 hover:to-indigo-800"
            >
              {markAttendanceMutation.isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                "Record Attendance"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Month and Filter */}
      <Card className="border-0 shadow-md">
        <CardHeader className="border-b border-slate-200 bg-white">
          <CardTitle className="text-lg font-bold text-slate-900">
            Filter by Month
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border-slate-300"
          />
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-200 bg-white">
          <CardTitle className="text-lg font-bold text-slate-900">
            Attendance Records
          </CardTitle>
          <CardDescription>
            Showing {attendanceRecords.length} record(s) for {month}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-6 w-6 animate-spin text-indigo-600" />
              <span className="ml-2 text-slate-600">Loading records...</span>
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-slate-300 py-12 text-center">
              <Calendar className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-slate-600">No attendance records found</p>
            </div>
          ) : (
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {attendanceRecords.map((record) => (
                <div
                  key={record._id}
                  className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {record.userId?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(record.date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`border ${getStatusColor(record.status)}`}
                      >
                        {getStatusIcon(record.status)}
                        <span className="ml-1 capitalize">{record.status}</span>
                      </Badge>
                      {record.status === "halfday" && (
                        <span className="text-sm text-slate-600">
                          {record.hours}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
