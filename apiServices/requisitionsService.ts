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

export interface RequisitionUser {
  id: number;
  name: string;
  designation?: string;
  phone?: string;
}

export interface RequisitionDepartment {
  id: number;
  name: string;
}

export interface RequisitionBranch {
  id: number;
  name: string;
}

export interface RequisitionItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  sub_total: number;
  reason_for_requirement: string;
  expected_date: string;
  approved_qty: number;
  delivered_qty: number;
  stock_qty: number;
  after_delivery_qty: number;
  status: number;
  note?: string;
  room_id?: number | string | null;
  room?: {
    id: number;
    name: string;
    room_no?: string;
  };
}

export interface Requisition {
  id: number;
  type: number; // 1 = Item-based, 2 = Amount-based
  type_text: string;
  requisition_condition: number;
  challan_no: string;
  user: RequisitionUser;
  department?: RequisitionDepartment;
  description: string;
  item_count: number;
  branch_from?: RequisitionBranch;
  branch_to?: RequisitionBranch;
  amount_requested: number;
  amount_reason?: string;
  amount_expected_date?: string;
  expected_date?: string;
  total_amount: number;
  advanced_amount?: number;
  settled_amount?: number;
  returned_amount?: number;
  settlement_type?: string;
  status: number;
  status_text: string;
  creator?: string;
  created_on?: string;
  approved_by?: string;
  approved_on?: string;
  rejected_by?: string;
  rejected_on?: string;
  completed_by?: string;
  completed_on?: string;
  remarks?: string;
  status_remarks?: string;
  items?: RequisitionItem[];
  amount_items?: {
    id: number;
    amount_requested: number;
    amount_reason: string | null;
    amount_expected_date: string | null;
    approved_amount: number;
    docs: unknown[];
    status: number;
  }[];
  amount?: {
    id: number;
    amount_requested: number;
    amount_reason: string | null;
    amount_expected_date: string | null;
    approved_amount: number;
    docs: unknown[];
    status: number;
  }[];
  approval_dashboard?: {
    step: number;
    role_name: string;
    status: number;
    actioned_by: string;
    actioned_at: string;
    note: string;
  }[];
}

export interface RequisitionInput {
  type: number;
  requisition_condition?: number | null;
  description?: string;
  user_id?: number;
  branch_from?: number;
  branch_to?: number;
  items?: {
    product_id: number;
    price: number;
    quantity: number;
    reason_for_requirement?: string;
    expected_date?: string;
    room_id?: number | string;
  }[];
  amount?: {
    amount_requested: number;
    amount_reason?: string;
    amount_expected_date?: string;
    docs?: { fileName: string; fileData: string }[];
  }[];
}

export interface RequisitionDetailData {
  total_requisitions?: number;
  requisitions: Requisition[];
  pagination?: PaginationType;
}

export interface RequisitionsResponse {
  success: boolean;
  message: string;
  code: number;
  data: RequisitionDetailData;
  errors?: Record<string, string[]>;
}

export interface SingleRequisitionResponse {
  success: boolean;
  message: string;
  code: number;
  data: Requisition;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET REQUISITIONS (CACHED)
// =======================

export async function getRequisitionsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<RequisitionsResponse | null> {
  "use cache";
  cacheTag("requisitions-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/requisitions?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No requisitions found (404). Returning empty list.");
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
      console.error("Service error:", "Error fetching requisitions");
      return null;
    }
  }
}

// =======================
// GET REQUISITIONS WRAPPER
// =======================

export async function getRequisitions(
  params: Record<string, unknown> = {},
): Promise<RequisitionsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const cachedResult = await getRequisitionsCached(token, params);

  if (!cachedResult) throw new Error("Failed to fetch data from cache.");

  return cachedResult;
}

// =======================
// GET SINGLE REQUISITION
// =======================

export async function getRequisitionById(
  id: number,
): Promise<SingleRequisitionResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/requisitions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Requisition not found (404).");
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
    console.error("Error in getRequisitionById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch requisition");
    } else {
      throw new Error("Failed to fetch requisition");
    }
  }
}

// =======================
// CREATE REQUISITION
// =======================

export async function createRequisition(
  body: RequisitionInput,
): Promise<SingleRequisitionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/requisitions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (res.ok && result?.success) {
      updateTag("requisitions-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createRequisition:", error);
      throw new Error(error.message || "Failed to create requisition");
    } else {
      throw new Error("Failed to create requisition");
    }
  }
}

// =======================
// UPDATE REQUISITION
// =======================

export async function updateRequisition(
  id: number,
  body: RequisitionInput,
): Promise<SingleRequisitionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/requisitions/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (res.ok && result?.success) {
      updateTag("requisitions-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateRequisition:", error);
      throw new Error(error.message || "Failed to update requisition");
    } else {
      throw new Error("Failed to update requisition");
    }
  }
}

// =======================
// DELETE REQUISITION
// =======================

export async function deleteRequisition(
  id: number,
): Promise<SingleRequisitionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/requisitions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    if (res.ok && result?.success) {
      updateTag("requisitions-list");
    }
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteRequisition:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete requisition");
    }
  }
}

// =======================
// GET APPROVAL DETAILS
// =======================

export interface ApprovalDetailsResponse {
  success: boolean;
  data: {
    items: Array<{
      id: number;
      product_id: number | string;
      request_qty: string | number;
      approved_qty: string | number;
      delivered_qty: string | number;
      status: string | number;
      stock_qty: string | number;
      after_delivery_qty: number;
      product?: {
        id: number;
        name: string;
      };
    }>;
    approvals: Array<{
      id: number;
      requisition_id: number;
      role_id: number;
      user_id: number | null;
      status: number;
      note: string | null;
      updated_at: string | null;
      user?: {
        id: number;
        name: string;
      } | null;
      role?: {
        id: number;
        name: string;
        display_name: string | null;
      } | null;
    }>;
  };
}

export async function getApprovalDetails(
  id: number,
): Promise<ApprovalDetailsResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session/token");

    const res = await fetch(
      `${API_BASE}/inventory/requisitions/${id}/approval-details`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) throw new Error(`Status: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (error: unknown) {
    console.error("Error in getApprovalDetails:", error);
    return null;
  }
}

// =======================
// ACTION ON ITEMS (APPROVE/REJECT)
// =======================

export async function requisitionRequestApproval(
  id: number,
  body: {
    items: Array<{ id: number; approved_qty?: number; approved_amount?: number; price?: number }>;
    action: "Approve" | "Reject";
    note?: string;
  },
): Promise<{ success: boolean; message: string }> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(
      `${API_BASE}/inventory/requisitions/${id}/items/action`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const result = await res.json();

    if (result?.success) {
      if (res.ok && result?.success) {
        updateTag("requisitions-list");
      }
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in requisitionRequestApproval:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to request approval");
    } else {
      throw new Error("Failed to request approval");
    }
  }
}

// =======================
// SUBMIT APPROVAL
// =======================

export async function submitApproval(
  id: number,
  body: {
    status: number; // 1 = Approved, 2 = Rejected
    note?: string | null;
  },
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session/token");

    const res = await fetch(
      `${API_BASE}/inventory/requisitions/${id}/submit-approval`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("Error in submitApproval:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to submit approval");
    } else {
      throw new Error("Failed to submit approval");
    }
  }
}
