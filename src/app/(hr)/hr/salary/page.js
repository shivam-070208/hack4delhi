import React from "react";
import SalaryManagement from "@/components/hr/SalaryManagement";

export default function SalaryPage() {
  return (
    <section className="min-h-screen space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
      {/* Header */}
      <div className="relative">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Salary Management
        </h1>
        <p className="mt-2 text-base font-medium text-slate-600">
          Process and manage employee salary payments
        </p>
        <div className="absolute top-0 -left-6 h-full w-1 rounded-r-full bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
      </div>

      {/* Content */}
      <SalaryManagement />
    </section>
  );
}
