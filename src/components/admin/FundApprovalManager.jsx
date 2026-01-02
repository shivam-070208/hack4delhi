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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Loader,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useFunds } from "@/hooks/useFunds";
import {
  useApproveFundRequest,
  useRejectFundRequest,
} from "@/hooks/useFundActions";

const statusConfig = {
  PENDING: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-800",
  },
  APPROVED: {
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-800",
  },
  REJECTED: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800",
  },
};

export default function AdminFundApproval() {
  const [filter, setFilter] = useState("PENDING");
  const {
    data: requests = [],
    isLoading: loading,
    error,
    refetch,
  } = useFunds();

  const approveMutation = useApproveFundRequest();
  const rejectMutation = useRejectFundRequest();

  const handleApprove = (requestId) => {
    approveMutation.mutate(requestId, {
      onSuccess: () => {
        toast.success("Fund request approved successfully!");
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    });
  };

  const handleReject = (requestId) => {
    rejectMutation.mutate(requestId, {
      onSuccess: () => {
        toast.success("Fund request rejected successfully!");
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    });
  };

  const filteredRequests =
    filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="min-h-screen space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
      {/* Header */}
      <div className="relative">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Fund Requests Approval
        </h1>
        <p className="mt-2 text-base font-medium text-slate-600">
          Review and approve fund requests from HR departments
        </p>
        <div className="absolute top-0 -left-6 h-full w-1 rounded-r-full bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold text-blue-700">Total</p>
            <p className="text-3xl font-bold text-blue-900">
              {requests.length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold text-yellow-700">Pending</p>
            <p className="text-3xl font-bold text-yellow-900">
              {requests.filter((r) => r.status === "PENDING").length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold text-green-700">Approved</p>
            <p className="text-3xl font-bold text-green-900">
              {requests.filter((r) => r.status === "APPROVED").length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold text-red-700">Rejected</p>
            <p className="text-3xl font-bold text-red-900">
              {requests.filter((r) => r.status === "REJECTED").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["PENDING", "APPROVED", "REJECTED", "ALL"].map((status) => (
          <Button
            key={status}
            onClick={() => setFilter(status)}
            variant={filter === status ? "default" : "outline"}
            className={
              filter === status
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : ""
            }
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Requests List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Fund Requests
              </CardTitle>
              <CardDescription>
                {filteredRequests.length} request(s) found
              </CardDescription>
            </div>
            <Button
              onClick={() => refetch()}
              variant="ghost"
              size="sm"
              className="hover:bg-slate-100"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-6 w-6 animate-spin text-indigo-600" />
              <span className="ml-2 text-slate-600">Loading requests...</span>
            </div>
          )}

          {!loading && filteredRequests.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-slate-300 py-12 text-center">
              <p className="text-slate-600">No fund requests found.</p>
            </div>
          )}

          {!loading && filteredRequests.length > 0 && (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const config = statusConfig[request.status];
                const isProcessing =
                  approveMutation.isPending || rejectMutation.isPending;

                return (
                  <div
                    key={request._id}
                    className={`rounded-lg border-2 ${config.border} ${config.bg} p-6 transition-all hover:shadow-md`}
                  >
                    <div className="grid gap-4 sm:grid-cols-5 sm:items-center">
                      {/* Amount */}
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase">
                          Amount
                        </p>
                        <p className="text-xl font-bold text-slate-900">
                          {formatAmount(request.amount)}
                        </p>
                      </div>

                      {/* Purpose */}
                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold text-slate-600 uppercase">
                          Purpose
                        </p>
                        <p className="text-sm text-slate-700">
                          {request.purpose}
                        </p>
                      </div>

                      {/* Status & Date */}
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase">
                          Status
                        </p>
                        <Badge className={`mt-1 border-0 ${config.badge}`}>
                          {request.status}
                        </Badge>
                        <p className="mt-2 text-xs text-slate-500">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      {request.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(request._id)}
                            disabled={isProcessing}
                            size="sm"
                            className="flex-1 bg-green-600 text-white hover:bg-green-700 disabled:bg-slate-400"
                          >
                            {isProcessing ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            <span className="ml-1">Approve</span>
                          </Button>
                          <Button
                            onClick={() => handleReject(request._id)}
                            disabled={isProcessing}
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                          >
                            {isProcessing ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            <span className="ml-1">Reject</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
