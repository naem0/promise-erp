"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface ShippingItem {
  id: number; // Requisition item ID
  product_name: string;
  request_quantity: number;
  stock_qty: number;
  approved_qty: number;
  delivered_qty: number;
  remaining_qty: number;
  after_delivery_qty: number;
}

export interface ShippingApplicant {
  name: string;
  mob: string | null;
}

export interface RequisitionShippingDetail {
  requisition_no: string;
  delivery_branch: string | null;
  delivery_branch_id: number | null;
  applicant: ShippingApplicant;
  expected_date: string | null;
  delivery_date: string | null;
  delivery_status: number;
  delivery_status_text: string;
  requested_items: ShippingItem[];
  invoice: any | null;
  approval_dashboard: any[];
}

export interface ShippingDetailsResponse {
  success: boolean;
  message: string;
  code: number;
  data: RequisitionShippingDetail | RequisitionShippingDetail[];
  errors?: Record<string, string[]>;
}

// =======================
// GET SHIPPING DETAILS (CACHED)
// =======================

export async function getShippingDetailsCached(
  token: string,
  ids: string,
): Promise<ShippingDetailsResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/inventory/delivery/shipping?ids=${ids}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("Shipping details not found (404).");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error in getShippingDetailsCached:", error.message);
    }
    return null;
  }
}

// =======================
// GET SHIPPING DETAILS WRAPPER
// =======================

export async function getShippingDetails(ids: string): Promise<ShippingDetailsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const cachedResult = await getShippingDetailsCached(token, ids);

  if (!cachedResult) throw new Error("Failed to fetch shipping details from cache.");

  return cachedResult;
}

// =======================
// CREATE DELIVERY
// =======================

export async function createDelivery(formData: FormData): Promise<any> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/deliveries`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("Error in createDelivery:", error);
    throw error;
  }
}
