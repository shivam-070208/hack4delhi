"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader } from "lucide-react";
import { toast } from "sonner";
import { useCreateFundRequest } from "@/hooks/useMyFundRequests";

export default function FundsRequestForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const mutation = useCreateFundRequest();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!purpose.trim()) {
      setError("Please enter the purpose of the fund request");
      return;
    }

    mutation.mutate(
      {
        amount: parseFloat(amount),
        purpose: purpose.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Fund request submitted successfully!");
          setSuccess(true);
          setAmount("");
          setPurpose("");

          setTimeout(() => {
            setSuccess(false);
            if (onSuccess) onSuccess();
          }, 2000);
        },
        onError: (error) => {
          setError(error.message);
          toast.error(`Error: ${error.message}`);
        },
      },
    );
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg">
      <CardHeader className="border-b border-slate-200 bg-white">
        <CardTitle className="text-lg font-bold text-slate-900">
          Request Funds
        </CardTitle>
        <p className="mt-1 text-sm text-slate-600">
          Submit a new fund request for your department
        </p>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700">
                Fund request submitted successfully!
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="amount" className="font-semibold text-slate-900">
              Amount <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-xl font-bold text-indigo-600">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={mutation.isPending}
                className="border-slate-300 pl-8 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500"
                step="0.01"
                min="0"
              />
            </div>
            <p className="text-xs text-slate-500">
              Enter the amount in Indian Rupees
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="purpose" className="font-semibold text-slate-900">
              Purpose <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="purpose"
              placeholder="Explain the purpose of this fund request..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              disabled={mutation.isPending}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none disabled:bg-slate-100"
              rows="4"
            />
            <p className="text-xs text-slate-500">
              Be specific about how the funds will be used
            </p>
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending || success}
            className="w-full bg-indigo-600 py-2 text-white shadow-lg hover:bg-indigo-700 disabled:bg-slate-400"
          >
            {mutation.isPending && (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mutation.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
