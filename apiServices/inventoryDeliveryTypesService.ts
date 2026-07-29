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

export interface DeliveryType {
  id: number;
  name: string;
  status: number;
  status_text: string;
  delivery_partners_count: number;
}

export interface DeliveryTypesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_delivery_types: number;
    delivery_types: DeliveryType[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleDeliveryTypeResponse {
  success: boolean;
  message: string;
  code: number;
  data: DeliveryType;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET DELIVERY TYPES (CACHED)
// =======================

export async function getDeliveryTypesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<DeliveryTypesResponse | null> {
  "use cache";
  cacheTag("delivery-types-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/delivery-types?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No delivery types found (404). Returning empty list.");
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
    console.error("getDeliveryTypesCached error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch delivery types");
  }
}

// =======================
// GET DELIVERY TYPES WRAPPER
// =======================

export async function getDeliveryTypes(
  params: Record<string, unknown> = {},
): Promise<DeliveryTypesResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }
  try {
    const cachedResult = await getDeliveryTypesCached(token, params);
    if (!cachedResult) {
      throw new Error("Failed to fetch delivery types");
    }
    return cachedResult;
  } catch (error: unknown) {
    console.error("getDeliveryTypes error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}

// =======================
// GET SINGLE DELIVERY TYPE
// =======================

export async function getDeliveryTypeById(
  id: number,
): Promise<SingleDeliveryTypeResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/inventory/delivery-types/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 404) {
      console.warn("No delivery type found (404). Returning null.");
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
    console.error("Error in getDeliveryTypeById:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to fetch delivery type");
    }
  }
}

// =======================
// CREATE DELIVERY TYPE
// =======================

export async function createDeliveryType(
  formData: FormData,
): Promise<SingleDeliveryTypeResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/inventory/delivery-types`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("delivery-types-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createDeliveryType:", error);
      throw error;
    } else {
      throw new Error("Failed to create delivery type");
    }
  }
}

// =======================
// UPDATE DELIVERY TYPE
// =======================

export async function updateDeliveryType(
  id: number,
  formData: FormData,
): Promise<SingleDeliveryTypeResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    // Laravel method spoofing for PUT via POST
    if (!formData.has("_method")) {
      formData.append("_method", "PUT");
    }

    const res = await fetch(`${API_BASE}/inventory/delivery-types/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("delivery-types-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateDeliveryType:", error);
      throw error;
    } else {
      throw new Error("Failed to update delivery type");
    }
  }
}

// =======================
// DELETE DELIVERY TYPE
// =======================

export async function deleteDeliveryType(
  id: number,
): Promise<SingleDeliveryTypeResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/inventory/delivery-types/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("delivery-types-list");
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteDeliveryType:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to delete delivery type");
    }
  }
}
