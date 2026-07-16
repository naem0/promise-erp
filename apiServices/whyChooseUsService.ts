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

export interface WhyChooseUs {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image?: string | null;
  status: number;
}

export interface WhyChooseUsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_entries: number;
    why_choose_us: WhyChooseUs[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleWhyChooseUsResponse {
  success: boolean;
  message: string;
  code: number;
  data: WhyChooseUs;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET WHY CHOOSE US (CACHED)
// =======================

export async function getWhyChooseUsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<WhyChooseUsResponse | null> {
  "use cache";
  cacheTag("why-choose-us-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/why-choose-us?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No why choose us items found (404). Returning empty list.");
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
    console.error("getWhyChooseUsCached error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch Why Choose Us entries");
  }
}

// =======================
// GET WHY CHOOSE US WRAPPER
// =======================

export async function getWhyChooseUs(
  params: Record<string, unknown> = {},
): Promise<WhyChooseUsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }
  try {
    const cachedResult = await getWhyChooseUsCached(token, params);
    if (!cachedResult) {
      throw new Error("Failed to fetch Why Choose Us entries");
    }
    return cachedResult;
  } catch (error: unknown) {
    console.error("getWhyChooseUs error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}

// =======================
// GET SINGLE WHY CHOOSE US
// =======================

export async function getWhyChooseUsById(
  id: number,
): Promise<SingleWhyChooseUsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/why-choose-us/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (res.status === 404) {
      console.warn("No why choose us item found (404). Returning null.");
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
    console.error("Error in getWhyChooseUsById:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to fetch Why Choose Us entry");
    }
  }
}

// =======================
// CREATE WHY CHOOSE US
// =======================

export async function createWhyChooseUs(
  formData: FormData,
): Promise<SingleWhyChooseUsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/why-choose-us`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      updateTag("why-choose-us-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createWhyChooseUs:", error);
      throw error;
    } else {
      throw new Error("Failed to create Why Choose Us entry");
    }
  }
}

// =======================
// UPDATE WHY CHOOSE US
// =======================

export async function updateWhyChooseUs(
  id: number,
  formData: FormData,
): Promise<SingleWhyChooseUsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/why-choose-us/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      updateTag("why-choose-us-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateWhyChooseUs:", error);
      throw error;
    } else {
      throw new Error("Failed to update Why Choose Us entry");
    }
  }
}

// =======================
// DELETE WHY CHOOSE US
// =======================

export async function deleteWhyChooseUs(
  id: number,
): Promise<SingleWhyChooseUsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/why-choose-us/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const result = await res.json();

    updateTag("why-choose-us-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteWhyChooseUs:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to delete Why Choose Us entry");
    }
  }
}
