"use server";
import { PaginationType } from "@/types/pagination";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

//   ******* Start getCourseSalesSummary API *******

export interface CourseSalesSummaryItem {
  title?: string;
  key?: string;
  value: number;
  growth: string;
  course_name?: string;
}

export interface CourseSalesSummaryData {
  total_branches: number;
  summary: CourseSalesSummaryItem[];
}

export interface CourseSalesSummaryApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: CourseSalesSummaryData;
  errors?: Record<string, string[]>;
}

export async function getCourseSalesSummary(): Promise<CourseSalesSummaryApiResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  try {
    if (!token) {
      throw new Error("No valid session or access token found.");
    }
    const res = await fetch(`${API_BASE}/dashboard/course-sales-summary`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res?.status === 404) {
      console.warn("No course sales summary found.");
      return null;
    }

    if (res?.status === 401 || res?.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `getCourseSalesSummary API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: CourseSalesSummaryApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching course sales summary:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching course sales summary");
  }
}
//   ******* End getCourseSalesSummary API *******

//   ******* Start getCourseSalesReportList API *******

export interface CourseSalesReportItem {
  branch_id: number;
  branch_name: string;
  course_name: string;
  batch_name: string;
  received: number;
  due: number;
  total_enrollments: number;
}

export interface CourseSalesReportData {
  totals: {
    received: number;
    due: number;
    total_enrollments: number;
  };
  report: CourseSalesReportItem[];
  pagination: PaginationType;
}

export interface CourseSalesReportApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: CourseSalesReportData;
  errors?: Record<string, string[]>;
}

export async function getCourseSalesReportList(
  params: Record<string, unknown> = {}
): Promise<CourseSalesReportApiResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  try {
    if (!token) {
      throw new Error("No valid session or access token found.");
    }
    
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/dashboard/course-sales-report?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res?.status === 404) {
      console.warn("No course sales report found.");
      return null;
    }

    if (res?.status === 401 || res?.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `getCourseSalesReportList API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: CourseSalesReportApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching course sales report list:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching course sales report list");
  }
}
//   ******* End getCourseSalesReportList API *******
