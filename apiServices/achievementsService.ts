"use server";
import { cacheTag, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface Achievement {
  id: number;
  image?: string | null;
  title: string;
  description: string;
  name: string;
  designation: string;
  status: number;
}

export interface AchievementsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_achievements: number;
    achievements: Achievement[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleAchievementResponse {
  success: boolean;
  message: string;
  code: number;
  data: Achievement;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET ACHIEVEMENTS (CACHED)
// =======================

export async function getAchievementsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<AchievementsResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.ACHIEVEMENTS);
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/achievements?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No achievements found (404). Returning empty list.");
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
    console.error("getAchievementsCached error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch achievements");
  }
}

// =======================
// GET ACHIEVEMENTS WRAPPER
// =======================

export async function getAchievements(
  params: Record<string, unknown> = {},
): Promise<AchievementsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }
  try {
    const cachedResult = await getAchievementsCached(token, params);
    if (!cachedResult) {
      throw new Error("Failed to fetch achievements");
    }
    return cachedResult;
  } catch (error: unknown) {
    console.error("getAchievements error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}

// =======================
// GET SINGLE ACHIEVEMENT
// =======================

export async function getAchievementById(
  id: number,
): Promise<SingleAchievementResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 404) {
      console.warn("No achievement found (404). Returning null.");
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
    console.error("Error in getAchievementById:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to fetch achievement");
    }
  }
}

// =======================
// CREATE ACHIEVEMENT
// =======================

export async function createAchievement(
  formData: FormData,
): Promise<SingleAchievementResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/achievements`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.ACHIEVEMENTS);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createAchievement:", error);
      throw error;
    } else {
      throw new Error("Failed to create achievement");
    }
  }
}

// =======================
// UPDATE ACHIEVEMENT
// =======================

export async function updateAchievement(
  id: number,
  formData: FormData,
): Promise<SingleAchievementResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.ACHIEVEMENTS);
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateAchievement:", error);
      throw error;
    } else {
      throw new Error("Failed to update achievement");
    }
  }
}

// =======================
// DELETE ACHIEVEMENT
// =======================

export async function deleteAchievement(
  id: number,
): Promise<SingleAchievementResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.ACHIEVEMENTS);
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteAchievement:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to delete achievement");
    }
  }
}
