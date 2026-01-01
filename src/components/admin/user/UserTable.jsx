import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function UserTable({ users }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
      {users.map((u) => (
        <Card
          key={u._id}
          className="flex flex-col rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl"
        >
          <CardHeader className="flex flex-row items-center gap-4 px-6 pt-6 pb-2">
            {u.image ? (
              <div className="ring-primary rounded-full ring-2">
                <img
                  src={u.image}
                  alt={u.name}
                  className="h-14 w-14 rounded-full border-2 border-white object-cover"
                />
              </div>
            ) : (
              <div className="ring-primary flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-blue-200 via-indigo-100 to-blue-400 text-2xl font-bold text-indigo-800 ring-2">
                {u.name?.[0]?.toUpperCase() || <span>?</span>}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-lg font-semibold text-gray-800">
                {u.name}
              </CardTitle>
              <CardDescription className="truncate text-xs text-gray-400 select-all">
                <span className="font-mono">ID:</span> {u._id}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col px-6 pt-0">
            <div className="mt-2 flex flex-col gap-2 text-sm text-gray-700">
              <div className="inline-flex items-center gap-1">
                <span className="font-semibold">Role:</span>
                <span
                  className={
                    u.role === "ADMIN"
                      ? "rounded bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700 capitalize"
                      : u.role === "HR"
                        ? "rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 capitalize"
                        : "rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 capitalize"
                  }
                >
                  {u.role}
                </span>
              </div>
              <div className="inline-flex items-center gap-1">
                <span className="font-semibold">Status:</span>
                <span
                  className={
                    u.status === "active"
                      ? "rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700"
                      : "rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700"
                  }
                >
                  {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="mt-6 flex">
              <Link
                href={`./users/${u._id}`}
                className="bg-primary/90 hover:bg-primary border-primary/30 ml-auto rounded-lg border px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150"
              >
                View more &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
