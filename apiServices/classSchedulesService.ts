"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface ClassSchedule {
  id: number;
  organization_id: number;
  title: string;
  start_time: string; // "06:00 PM"
  end_time: string;   // "08:00 PM"
  status: number;
  status_text: string; // "Active" or "Inactive"
}

export interface ClassSchedulesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    class_schedules: ClassSchedule[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleClassScheduleResponse {
  success: boolean;
  message: string;
  code: number;
  data: ClassSchedule;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET CLASS SCHEDULES (CACHED)
// =======================

export async function getClassSchedulesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<ClassSchedulesResponse | null> {
  "use cache";
  cacheTag("class-schedules-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/class-schedules?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No class schedules found (404).");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found or invalid.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }
    const result = await res.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error: Error fetching class schedules");
      return null;
    }
  }
}

// =======================
// GET CLASS SCHEDULES WRAPPER
// =======================

export async function getClassSchedules(
  params: Record<string, unknown> = {},
): Promise<ClassSchedulesResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getClassSchedulesCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch class schedules data.");

  return _cachedResult;
}

// =======================
// GET SINGLE CLASS SCHEDULE
// =======================

export async function getClassScheduleById(
  id: number,
): Promise<SingleClassScheduleResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/class-schedules/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 404) {
      console.warn(`No class schedule found with ID ${id} (404).`);
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }
    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("Error in getClassScheduleById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch class schedule details");
    } else {
      throw new Error("Failed to fetch class schedule details");
    }
  }
}

// =======================
// CREATE CLASS SCHEDULE
// =======================

export async function createClassSchedule(
  data: Record<string, unknown>,
): Promise<SingleClassScheduleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/class-schedules`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    updateTag("class-schedules-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createClassSchedule:", error);
      throw new Error(error.message || "Failed to create class schedule");
    } else {
      throw new Error("Failed to create class schedule");
    }
  }
}

// =======================
// UPDATE CLASS SCHEDULE
// =======================

export async function updateClassSchedule(
  id: number,
  data: Record<string, unknown>,
): Promise<SingleClassScheduleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/class-schedules/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        _method: "PUT",
      }),
    });

    const result = await res.json();
    updateTag("class-schedules-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateClassSchedule:", error);
      throw new Error(error.message || "Failed to update class schedule");
    } else {
      throw new Error("Failed to update class schedule");
    }
  }
}

// =======================
// DELETE CLASS SCHEDULE
// =======================

export async function deleteClassSchedule(
  id: number,
): Promise<SingleClassScheduleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/class-schedules/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    updateTag("class-schedules-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteClassSchedule:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete class schedule");
    }
  }
}
