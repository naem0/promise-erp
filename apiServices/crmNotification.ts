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

export interface CRMNotification {
  id: string;
  read_at?: string;
  lead_id: number;
  name: string;
  phone: string;
  message: string;
  type: string;
  created_at_human: string;
  course_name?: string;
  consultant?: {
    name: string;
    phone: string;
  };
}

export interface CRMNotificationsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    notifications: CRMNotification[];
    unread_count: number;
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface MarkReadResponse {
  success: boolean;
  message: string;
  code: number;
  data: null;
  errors?: Record<string, string[]>;
}

// =======================
// GET NOTIFICATIONS (CACHED)
// =======================

export async function getCRMNotificationsCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<CRMNotificationsResponse | null> {
  "use cache: private";
  cacheTag("crm-notifications-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
        urlParams.append(key, String(params[key]));
      }
    }

    const queryString = urlParams.toString();
    const url = queryString
      ? `${API_BASE}/consultant-notifications?${queryString}`
      : `${API_BASE}/consultant-notifications`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      console.error("Unauthorized");
      return null
    }
    if (res.status === 403) {
      console.error("Forbidden");
      return null
    }
    if (res.status === 404) {
      console.error("Not Found");
      return null
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching CRM notifications:", error.message);
      console.error("Cache error:", error.message);

      return null;
    } else {
      console.error("Cache error:", "Error fetching CRM notifications");

      return null;
    }
  }
}

// =======================
// GET NOTIFICATIONS WRAPPER
// =======================

export async function getCRMNotifications(
  params: Record<string, unknown> = {}
): Promise<CRMNotificationsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const cachedResult = await getCRMNotificationsCached(token, params);

  if (!cachedResult) throw new Error("Failed to fetch data from cache.");

  return cachedResult;
}



// =======================
// GET NOTIFICATION COUNT CACHED
// =======================

export interface CRMNotificationCountResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    unread_count: number;
  };
}

export async function getCRMNotificationCountCached(
  token: string
): Promise<CRMNotificationCountResponse | null> {
  "use cache: private";
  cacheTag("crm-notifications-list");

  try {
    const res = await fetch(
      `${API_BASE}/consultant-notifications/count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 401) {
      console.error("Unauthorized");
      return null;
    }

    if (res.status === 403) {
      console.error("Forbidden");
      return null;
    }

    if (res.status === 404) {
      console.error("Not Found");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error fetching CRM notification count:",
        error.message
      );
    } else {
      console.error(
        "Unknown error fetching CRM notification count"
      );
    }

    return null;
  }
}


export async function getCRMNotificationCount(): Promise<CRMNotificationCountResponse | null> {
  try {
    const session = await getServerSession(authOptions);

    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session/token");
    }

    const cachedResult =
      await getCRMNotificationCountCached(token);

    if (!cachedResult) {
      throw new Error(
        "Failed to fetch notification count from cache."
      );
    }

    return cachedResult;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error in getCRMNotificationCount:",
        error.message
      );
    } else {
      console.error(
        "Unknown error in getCRMNotificationCount"
      );
    }

    return null;
  }
}

// =======================
// MARK NOTIFICATION AS READ
// =======================

export async function markCRMNotificationAsRead(
  notificationId: string
): Promise<MarkReadResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(
      `${API_BASE}/consultant-notifications/${notificationId}/mark-read`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );


    const result = await res.json();

    updateTag("crm-notifications-list");

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error marking notification as read:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Error marking notification as read");
    }
  }
}
