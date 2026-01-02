"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyFundRequests } from "@/hooks/useMyFundRequests";

const statusConfig = {
  PENDING: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-800",
  },
  APPROVED: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    badge: "bg-green-100 text-green-800",
  },
  REJECTED: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-800",
  },
};

export default function FundsRequestList({ refreshTrigger }) {
  const {
    data: requests = [],
    isLoading: loading,
    error,
    refetch,
  } = useMyFundRequests();

  useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">
              Your Fund Requests
            </CardTitle>
            <CardDescription>
              Track the status of your submitted requests
            </CardDescription>
          </div>
          <Button
            onClick={() => refetch()}
            variant="ghost"
            size="sm"
            className="hover:bg-slate-100"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-6 w-6 animate-spin text-indigo-600" />
            <span className="ml-2 text-slate-600">Loading requests...</span>
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-slate-300 py-12 text-center">
            <p className="text-slate-600">No fund requests yet.</p>
            <p className="text-sm text-slate-500">
              Create your first fund request above.
            </p>
          </div>
        )}

        {!loading && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((request) => {
              const config = statusConfig[request.status];
              return (
                <div
                  key={request._id}
                  className={`rounded-lg border-2 ${config.border} ${config.bg} p-5 transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-semibold text-slate-900">
                          {formatAmount(request.amount)}
                        </h3>
                        <Badge className={`${config.badge} border-0`}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className={`text-sm ${config.text} font-medium`}>
                        {request.purpose}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Requested on {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
