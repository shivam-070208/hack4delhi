"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAttendanceList } from "@/hooks/useAttendance";
import { useEmployees } from "@/hooks/useEmployees";

export default function AdminAttendanceBoard() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const { data: employees = [] } = useEmployees();
  const { data: attendanceRecords = [], isLoading } = useAttendanceList(
    month,
    selectedEmployeeId,
  );

  // Calculate stats
  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter((r) => r.status === "present").length,
    absent: attendanceRecords.filter((r) => r.status === "absent").length,
    halfday: attendanceRecords.filter((r) => r.status === "halfday").length,
  };

  // Group by employee
  const recordsByEmployee = attendanceRecords.reduce((acc, record) => {
    const empId = record.userId?._id;
    if (!acc[empId]) {
      acc[empId] = {
        name: record.userId?.name || "Unknown",
        records: [],
      };
    }
    acc[empId].records.push(record);
    return acc;
  }, {});

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

  const calculateAttendancePercentage = (records) => {
    if (records.length === 0) return 0;
    const presentDays = records.filter((r) => r.status === "present").length;
    const halfDays = records.filter((r) => r.status === "halfday").length * 0.5;
    return Math.round(((presentDays + halfDays) / records.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Attendance Analytics
        </h1>
        <p className="mt-2 text-base font-medium text-slate-600">
          Monitor and analyze employee attendance patterns
        </p>
        <div className="absolute top-0 -left-6 h-full w-1 rounded-r-full bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]" />
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

      {/* Filters */}
      <div className="grid gap-4 sm:grid-cols-2">
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

        <Card className="border-0 shadow-md">
          <CardHeader className="border-b border-slate-200 bg-white">
            <CardTitle className="text-lg font-bold text-slate-900">
              Filter by Employee
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      {/* Attendance by Employee */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-200 bg-white">
          <CardTitle className="text-lg font-bold text-slate-900">
            Employee Attendance Overview
          </CardTitle>
          <CardDescription>Attendance statistics for {month}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-6 w-6 animate-spin text-indigo-600" />
              <span className="ml-2 text-slate-600">Loading records...</span>
            </div>
          ) : Object.keys(recordsByEmployee).length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-slate-300 py-12 text-center">
              <Calendar className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-slate-600">No attendance records found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(recordsByEmployee).map(([empId, empData]) => {
                const percentage = calculateAttendancePercentage(
                  empData.records,
                );
                const presentDays = empData.records.filter(
                  (r) => r.status === "present",
                ).length;
                const absentDays = empData.records.filter(
                  (r) => r.status === "absent",
                ).length;
                const halfDays = empData.records.filter(
                  (r) => r.status === "halfday",
                ).length;

                return (
                  <div
                    key={empId}
                    className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 transition-all hover:shadow-md"
                  >
                    <div className="grid gap-4 sm:grid-cols-3 sm:items-center">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {empData.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {empData.records.length} days recorded
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">
                            Present: {presentDays}
                          </span>
                          <span className="text-sm text-slate-600">
                            Absent: {absentDays}
                          </span>
                          <span className="text-sm text-slate-600">
                            Half: {halfDays}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="flex items-center gap-3">
                          <div className="h-2 flex-1 rounded-full bg-slate-200">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                          <span className="w-12 text-sm font-semibold text-slate-900">
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <Badge className="border border-indigo-300 bg-indigo-100 text-indigo-800">
                          <TrendingUp className="mr-1 h-4 w-4" />
                          Attendance Rate
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Records */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-200 bg-white">
          <CardTitle className="text-lg font-bold text-slate-900">
            Detailed Records
          </CardTitle>
          <CardDescription>Complete attendance log for {month}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {attendanceRecords.length === 0 ? (
              <p className="py-8 text-center text-slate-500">
                No records to display
              </p>
            ) : (
              attendanceRecords.map((record) => (
                <div
                  key={record._id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
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
                          {record.hours}h
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
