import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function DepartmentTable({ departments }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
      {departments.map((d) => (
        <Card
          key={d._id}
          className="flex flex-col rounded-xl border bg-white shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl"
        >
          <CardHeader className="flex flex-row items-center gap-4 px-6 pt-6 pb-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-lg font-semibold text-gray-800">
                {d.name}
              </CardTitle>
              <CardDescription className="truncate text-xs text-gray-400 select-all">
                Code: {d.code}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col px-6 pt-0">
            <div className="mt-2 flex-1 text-sm text-gray-700">
              {d.description || (
                <span className="text-sm text-gray-400">No description</span>
              )}
            </div>
            <div className="mt-4 flex">
              <Link
                href={`./departments/${d._id}`}
                className="bg-primary/90 hover:bg-primary border-primary/30 ml-auto rounded-lg border px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150"
              >
                View &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
