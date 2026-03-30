"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

//   ******* Start getDashboardSummaryStats API *******
export interface DashboardCardItem {
  title: string;
  value: number;
}
export interface DashboardCard {
  card_name: string;
  card_data: DashboardCardItem[];
}
export interface DashboardSummaryApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: DashboardCard[];
  errors?: Record<string, string[]>;
}

export async function getDashboardSummaryStats(): Promise<DashboardSummaryApiResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  try {
    if (!token) {
      throw new Error("No valid session or access token found.");
    }
    const res = await fetch(`${API_BASE}/dashboard/summary-stats`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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
