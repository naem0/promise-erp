"use server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { updateTag, cacheTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface Stats {
  id: number;
  title: string;
  count: number;
  image?: string | null;
  status: number;
  type: "achievement_stat" | "hero_stat" | "opportunity_stat";
}


export interface StatsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_stats: number;
    stats: Stats[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleStatsResponse {
  success: boolean;
  message: string;
  code: number;
  data?: Stats;
  errors?: Record<string, string[] | string>;
}

// add lesson
export async function addStats(formData: FormData): Promise<SingleStatsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/stats`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();
    updateTag("stats-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in addStats:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}

async function getStatsCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<StatsResponse> {
  "use cache"
  cacheTag("stats-list");
  try {
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (
        params.hasOwnProperty(key) &&
        params[key] !== undefined &&
        params[key] !== null
      ) {
        urlParams.append(key, params[key].toString());
      }
    }

    const res = await fetch(`${API_BASE}/stats?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  } catch (error: unknown) {
    console.error("Error in getStatsCached:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}

// Get Stats
export async function getStats(
  params: Record<string, unknown> = {}
): Promise<StatsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const data = await getStatsCached(token, params);
    return data;
  } catch (error: unknown) {
    console.error("Error in getStats:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}

export interface StatsSingleResponse {
  success: boolean;
  message: string;
  data: Stats;
}

// =======================
// 🔹 Update Stats
// =======================

export async function updateStats(
  id: number,
  formData: FormData
): Promise<SingleStatsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    formData.append("_method", "PUT");

    const res = await fetch(`${API_BASE}/stats/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();
    updateTag("stats-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateStats:", error);
      throw new Error(error.message);
    } else {
      console.error("An unexpected error occurred in updateStats:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
}

// =======================
// 🔹 Get Stats By ID
// =======================

export async function getStatsById(id: string): Promise<StatsSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/stats/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch statistics: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("Error in getStatsById:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}

// =======================
// 🔹 Delete Stats
// =======================
export async function deleteStats(id: number): Promise<SingleStatsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return { success: false, message: "Unauthorized", code: 401 };
    }

    const res = await fetch(`${API_BASE}/stats/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("stats-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteStats:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}
