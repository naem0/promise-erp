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

export interface RequisitionFlow {
  id: number;
  name: string;
  status: number;
  status_text: string;
  is_head: boolean;
}

export interface RequisitionFlowsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    flows: RequisitionFlow[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleRequisitionFlowResponse {
  success: boolean;
  message: string;
  code: number;
  data: RequisitionFlow;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET REQUISITION FLOWS (CACHED)
// =======================

export async function getRequisitionFlowsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<RequisitionFlowsResponse | null> {
  "use cache";
  cacheTag("requisition-flows-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/requisition-flows?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No items found (404). Returning empty list.");
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
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching requisition flows");
      return null;
    }
  }
}

// =======================
// GET REQUISITION FLOWS WRAPPER
// =======================

export async function getRequisitionFlows(
  params: Record<string, unknown> = {},
): Promise<RequisitionFlowsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getRequisitionFlowsCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch requisition flows.");

  return _cachedResult;
}

// =======================
// GET SINGLE REQUISITION FLOW
// =======================

export async function getRequisitionFlowById(
  id: number,
): Promise<SingleRequisitionFlowResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/inventory/requisition-flows/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("No item found (404). Returning null.");
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
    console.error("Error in getRequisitionFlowById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch requisition flow");
    } else {
      throw new Error("Failed to fetch requisition flow");
    }
  }
}

// =======================
// CREATE REQUISITION FLOW
// =======================

export async function createRequisitionFlow(data: {
  name: string;
  status?: number;
  is_head?: boolean;
}): Promise<SingleRequisitionFlowResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/inventory/requisition-flows`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("requisition-flows-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createRequisitionFlow:", error);
      throw new Error(error.message || "Failed to create requisition flow");
    } else {
      throw new Error("Failed to create requisition flow");
    }
  }
}

// =======================
// UPDATE REQUISITION FLOW
// =======================

export async function updateRequisitionFlow(
  id: number,
  data: { name?: string; status?: number; is_head?: boolean },
): Promise<SingleRequisitionFlowResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/inventory/requisition-flows/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("requisition-flows-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateRequisitionFlow:", error);
      throw new Error(error.message || "Failed to update requisition flow");
    } else {
      throw new Error("Failed to update requisition flow");
    }
  }
}

// =======================
// DELETE REQUISITION FLOW
// =======================

export async function deleteRequisitionFlow(
  id: number,
): Promise<SingleRequisitionFlowResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/inventory/requisition-flows/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("requisition-flows-list");
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteRequisitionFlow:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to delete requisition flow");
    } else {
      throw new Error("Failed to delete requisition flow");
    }
  }
}
