import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Employee from "@/db/Employee";
import HR from "@/db/HR";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper: get last N months as labels (e.g., ["2024-03", ...])
function getPrevMonthsLabels(count = 6) {
  const result = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    result.push(`${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}`);
  }
  return result;
}

// Helper to turn agg group result into dict
function aggToDict(arr, valueKey) {
  const dict = {};
  arr.forEach((g) => {
    const yr = g._id.year;
    const mon = g._id.month;
    const key = `${yr}-${`${mon}`.padStart(2, "0")}`;
    dict[key] = g[valueKey];
  });
  return dict;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access only" },
        { status: 403 },
      );
    }
    await connectDB();

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Dashboard Stats
    const totalWorkingEmployees = await Employee.countDocuments({
      employmentStatus: "active",
      createdAt: { $gte: monthStart },
    });

    const totalHR = await HR.countDocuments({
      status: "active",
      createdAt: { $gte: monthStart },
    });

    const totalSalaryDisbursedAgg = await Employee.aggregate([
      {
        $match: {
          employmentStatus: "active",
          createdAt: { $gte: monthStart },
        },
      },
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);
    const totalSalaryDisbursed =
      totalSalaryDisbursedAgg.length > 0
        ? Math.round(totalSalaryDisbursedAgg[0].totalSalary / 100000)
        : 0;

    const activeSince = new Date(Date.now() - 10 * 60 * 1000);
    const activeNow = await Employee.countDocuments({
      lastActive: { $gte: activeSince },
      employmentStatus: "active",
    });

    // Trends
    const prevMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );
    const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const prevTotalWorkingEmployees = await Employee.countDocuments({
      employmentStatus: "active",
      createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
    });

    const prevTotalHR = await HR.countDocuments({
      status: "active",
      createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
    });

    const prevTotalSalaryDisbursedAgg = await Employee.aggregate([
      {
        $match: {
          employmentStatus: "active",
          createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);
    const prevTotalSalaryDisbursed =
      prevTotalSalaryDisbursedAgg.length > 0
        ? Math.round(prevTotalSalaryDisbursedAgg[0].totalSalary / 100000)
        : 0;

    // Calculating Trends
    const calcTrend = (curr, prev, isPercentage = true) => {
      if (prev === 0) {
        if (curr === 0) return isPercentage ? "0%" : "Stable";
        return isPercentage ? "+100%" : "Increase";
      }
      const diff = curr - prev;
      if (isPercentage) {
        const percent = (diff / prev) * 100;
        return `${diff >= 0 ? "+" : ""}${percent.toFixed(1)}%`;
      } else {
        if (diff === 0) return "Stable";
        return diff > 0 ? "Increase" : "Decrease";
      }
    };

    const totalWorkingEmployeesTrend = calcTrend(
      totalWorkingEmployees,
      prevTotalWorkingEmployees,
    );
    const totalHRTrend = calcTrend(totalHR, prevTotalHR, false);
    const salaryDisbursedTrend = calcTrend(
      totalSalaryDisbursed,
      prevTotalSalaryDisbursed,
    );

    // Dashboard Chart Data (for @DashboardChart.jsx)
    const numMonths = 6;
    const months = getPrevMonthsLabels(numMonths);

    // Employees per month
    const employeesByMonthAgg = await Employee.aggregate([
      {
        $match: {
          employmentStatus: "active",
          createdAt: {
            $gte: new Date(
              today.getFullYear(),
              today.getMonth() - (numMonths - 1),
              1,
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);
    // HRs per month
    const hrByMonthAgg = await HR.aggregate([
      {
        $match: {
          status: "active",
          createdAt: {
            $gte: new Date(
              today.getFullYear(),
              today.getMonth() - (numMonths - 1),
              1,
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);
    // Salary per month
    const salaryByMonthAgg = await Employee.aggregate([
      {
        $match: {
          employmentStatus: "active",
          createdAt: {
            $gte: new Date(
              today.getFullYear(),
              today.getMonth() - (numMonths - 1),
              1,
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);

    // Map agg to dicts keyed by "YYYY-MM"
    const empDict = aggToDict(employeesByMonthAgg, "count");
    const hrDict = aggToDict(hrByMonthAgg, "count");
    const salDict = aggToDict(salaryByMonthAgg, "totalSalary");

    // Produce chartData in the shape expected by DashboardChart.jsx
    // {
    //   labels: [...], // months
    //   employee: [...], // employees for each month
    //   hr: [...],      // HRs for each month
    //   salary: [...]   // salary (lakhs) for each month
    // }
    const chartData = {
      labels: months,
      employee: months.map((label) => empDict[label] || 0),
      hr: months.map((label) => hrDict[label] || 0),
      salary: months.map((label) =>
        salDict[label] ? Math.round(salDict[label] / 100000) : 0,
      ),
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          totalWorkingEmployees,
          totalWorkingEmployeesTrend,
          totalHR,
          totalHRTrend,
          totalSalaryDisbursed,
          salaryDisbursedTrend,
          activeNow,
          chartData, // For DashboardChart.jsx
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin dashboard data fetch failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
