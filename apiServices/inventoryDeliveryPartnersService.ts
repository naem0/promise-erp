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

export interface DeliveryPartner {
  id: number;
  name: string;
  contact: string;
  email?: string;
  description?: string;
  address?: string;
  status: number;
  status_text: string;
}

export interface DeliveryPartnersResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_delivery_partners: number;
    delivery_partners: DeliveryPartner[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleDeliveryPartnerResponse {
  success: boolean;
  message: string;
  code: number;
  data: DeliveryPartner;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET DELIVERY PARTNERS (CACHED)
// =======================

export async function getDeliveryPartnersCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<DeliveryPartnersResponse | null> {
  "use cache";
  cacheTag("delivery-partners-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/delivery-partners?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No delivery partners found (404). Returning empty list.");
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
      console.error("Service error:", "Error fetching delivery partners");
      return null;
    }
  }
}

// =======================
// GET DELIVERY PARTNERS WRAPPER
// =======================

export async function getDeliveryPartners(
  params: Record<string, unknown> = {},
): Promise<DeliveryPartnersResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getDeliveryPartnersCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE DELIVERY PARTNER
// =======================

export async function getDeliveryPartnerById(
  id: number,
): Promise<SingleDeliveryPartnerResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/delivery-partners/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn(`No delivery partner found with ID ${id} (404).`);
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
    console.error("Error in getDeliveryPartnerById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch delivery partner details");
    } else {
      throw new Error("Failed to fetch delivery partner details");
    }
  }
}

// =======================
// CREATE DELIVERY PARTNER
// =======================

export async function createDeliveryPartner(
  formData: FormData,
): Promise<SingleDeliveryPartnerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/delivery-partners`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("delivery-partners-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createDeliveryPartner:", error);
      throw new Error(error.message || "Failed to create delivery partner");
    } else {
      throw new Error("Failed to create delivery partner");
    }
  }
}

// =======================
// UPDATE DELIVERY PARTNER
// =======================

export async function updateDeliveryPartner(
  id: number,
  formData: FormData,
): Promise<SingleDeliveryPartnerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    // Laravel uses method spoofing for updates using POST with _method=PUT
    if (!formData.has("_method")) {
      formData.append("_method", "PUT");
    }

    const res = await fetch(`${API_BASE}/inventory/delivery-partners/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("delivery-partners-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateDeliveryPartner:", error);
      throw new Error(error.message || "Failed to update delivery partner");
    } else {
      throw new Error("Failed to update delivery partner");
    }
  }
}

// =======================
// DELETE DELIVERY PARTNER
// =======================

export async function deleteDeliveryPartner(
  id: number,
): Promise<SingleDeliveryPartnerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/delivery-partners/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("delivery-partners-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteDeliveryPartner:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete delivery partner");
    }
  }
}
