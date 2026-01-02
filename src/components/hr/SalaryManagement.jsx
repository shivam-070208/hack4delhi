"use client";
import React, { useEffect, useState } from "react";
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
  DollarSign,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEmployees } from "@/hooks/useEmployees";
import { useWallet } from "@/hooks/useWallet";
import { useEmployeeSalary } from "@/hooks/useEmployeeSalary";
import { useSalaryPay } from "@/hooks/useSalaryPay";
import { useMonthlySalaryTotal } from "@/hooks/useSalaryTransactions";
import Image from "next/image";
function EmployeePayRow({
  employee,
  salaryAmount,
  onSalaryChange,
  onPayClick,
  isProcessing,
}) {
  const { data: employeeData = {} } = useEmployeeSalary(employee._id);

  const displaySalary =
    salaryAmount || (employeeData.salary ? employeeData.salary.toString() : "");

  return (
    <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 transition-all hover:shadow-md">
      <div className="grid gap-4 sm:grid-cols-5 sm:items-center">
        {/* Employee Image and Name */}
        <div className="flex items-center gap-3">
          <Image
            src={employee.image || "/profile-placeholder.png"}
            alt={employee.name}
            width="100"
            height="100"
            className="h-12 w-12 rounded-full border-2 border-slate-300 object-cover"
            onError={(e) => {
              e.target.src = "/profile-placeholder.png";
            }}
          />
          <div>
            <p className="font-semibold text-slate-900">{employee.name}</p>
            <p className="text-sm text-slate-500">{employee.email}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase">
            Department
          </p>
          <p className="text-sm text-slate-900">
            {employee.department || "N/A"}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">
            Salary Amount (₹)
          </label>
          <Input
            type="number"
            placeholder={
              employeeData.salary
                ? `${employeeData.salary}`
                : "Enter salary amount"
            }
            value={displaySalary}
            onChange={(e) => onSalaryChange(e.target.value)}
            disabled={isProcessing}
            className="border-slate-300"
            step="0.01"
            min="0"
          />
        </div>

        <Button
          onClick={onPayClick}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md hover:from-green-700 hover:to-green-800 disabled:bg-slate-400"
        >
          {isProcessing ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            "Pay Salary"
          )}
        </Button>
      </div>
    </div>
  );
}

export default function SalaryManagement() {
  const getDefaultMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const monthStr = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${monthStr}`;
  };

  const [month, setMonth] = useState(getDefaultMonth());
  const [salaryAmounts, setSalaryAmounts] = useState({});

  const { data: employees = [], isLoading, error } = useEmployees();
  const { data: walletData = { balance: 0 } } = useWallet();
  const { total: paidThisMonth } = useMonthlySalaryTotal(month);
  const payMutation = useSalaryPay();

  const handlePaySalary = (employeeId) => {
    if (!salaryAmounts[employeeId] || salaryAmounts[employeeId] <= 0) {
      toast.error("Please enter a valid salary amount");
      return;
    }

    payMutation.mutate(
      {
        employeeId,
        amount: parseFloat(salaryAmounts[employeeId]),
        month: month || new Date().toISOString().slice(0, 7),
      },
      {
        onSuccess: () => {
          toast.success("Salary paid successfully!");
          setSalaryAmounts({});
        },
        onError: (error) => {
          toast.error(`Error: ${error.message}`);
        },
      },
    );
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card className="border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-700">
                Your Wallet Balance
              </p>
              <p className="text-4xl font-bold text-indigo-900">
                ₹{formatAmount(walletData.balance || 0)}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-indigo-600" />
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-blue-700">Total Employees</p>
                <p className="text-3xl font-bold text-blue-900">
                  {employees.length}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-green-700">Paid This Month</p>
                <p className="text-3xl font-bold text-green-900">
                  {formatAmount(paidThisMonth || 0)}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Month Selection */}
      <Card className="border-0 shadow-md">
        <CardHeader className="border-b border-slate-200 bg-white">
          <CardTitle className="text-lg font-bold text-slate-900">
            Select Month
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full border-slate-300"
          />
          <p className="mt-2 text-sm text-slate-500">
            Salary for {month || "current month"}
          </p>
        </CardContent>
      </Card>

      {/* Employees List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-200 bg-white">
          <CardTitle className="text-lg font-bold text-slate-900">
            Pay Employees
          </CardTitle>
          <CardDescription>Manage and process salary payments</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-6 w-6 animate-spin text-indigo-600" />
              <span className="ml-2 text-slate-600">Loading employees...</span>
            </div>
          )}

          {!isLoading && employees.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-slate-300 py-12 text-center">
              <p className="text-slate-600">No employees found.</p>
            </div>
          )}

          {!isLoading && employees.length > 0 && (
            <div className="space-y-4">
              {employees.map((employee) => (
                <EmployeePayRow
                  key={employee._id}
                  employee={employee}
                  salaryAmount={salaryAmounts[employee._id] || ""}
                  onSalaryChange={(value) =>
                    setSalaryAmounts((prev) => ({
                      ...prev,
                      [employee._id]: value,
                    }))
                  }
                  onPayClick={() => handlePaySalary(employee._id)}
                  isProcessing={payMutation.isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
