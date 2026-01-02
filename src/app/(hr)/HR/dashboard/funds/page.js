"use client"
import React, { useState } from "react";
import FundsRequestForm from "@/components/hr/FundsRequestForm";
import FundsRequestList from "@/components/hr/FundsRequestList";

export default function FundsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <section className="min-h-screen space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
      {/* Header */}
      <div className="relative">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Fund Requests
        </h1>
        <p className="mt-2 text-base font-medium text-slate-600">
          Request and track funds for your department operations
        </p>
        <div className="absolute top-0 -left-6 h-full w-1 rounded-r-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <div>
          <FundsRequestForm
            onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </div>

        {/* List */}
        <div>
          <FundsRequestList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </section>
  );
}
