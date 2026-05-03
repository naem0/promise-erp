"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

//   ******* Start getDashboardSummaryStats API *******
export interface DashboardSummaryStatItem {
  title: string;
  value: number;
  count?: number;
}
export interface RunningBatch {
  course: string;
  batch: string;
  start_date: string;
  end_date: string;
  total_students: number;
  present_today: number;
}

export interface DashboardSummaryStat {
  card_name: string;
  card_data: DashboardSummaryStatItem[];
}
export interface MonthlyBreakdownItem {
  title: string;
  value: number;
}
export interface DivisionalIncomeItem {
  title: string;          // Dhaka, Chittagong etc.
  value: number;
  period: string;         // Apr
  total_sell: number;
  monthly_breakdown: MonthlyBreakdownItem[];
}

// card
export interface DivisionalIncomeCard {
  card_name: string;
  card_data: DivisionalIncomeItem[];
}

export interface DashboardSummaryData {
  summary_stats: DashboardSummaryStat[];
  charts_analytics: DashboardSummaryStat[];
  running_batches: RunningBatch[];
  course_notice_result: DashboardSummaryStat[];
  divisional_income_report: DivisionalIncomeCard[];
}

export interface DashboardSummaryApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: DashboardSummaryData;
  errors?: Record<string, string[]>;
}

export async function getDashboardSummaryStats(): Promise<DashboardSummaryApiResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  try {
    if (!token) {
      throw new Error("No valid session or access token found.");
    }
    const res = await fetch(`${API_BASE}/dashboard/overview`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res?.status === 404) {
      console.warn("No courses found.");
      return null;
    }

    if (res?.status === 401) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }
    if (res?.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `getDashboardSummaryStats API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: DashboardSummaryApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching company mission:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching company mission");
  }
}
//   ******* End getDashboardSummaryStats API *******
