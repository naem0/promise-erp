"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";
import { id } from "date-fns/locale/id";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface Brand {
  id: number;
  name: string;
  description?: string;
  status: number;
  products_count: number;
}

export interface BrandsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_brands: number;
    brands: Brand[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleBrandResponse {
  success: boolean;
  message: string;
  code: number;
  data: Brand;
  errors?: Record<string, string[] | string>;
}

export interface SimpleBrand {
  id: number;
  name: string;
  status: number;
}

export interface SimpleBrandsResponse {
  success: boolean;
  message: string;
  code: number;
  data?: {
    brands: SimpleBrand[];
    pagination?: PaginationType;
  };
  errors?: Record<string, string[]>;
}

// =======================
// GET BRANDS (CACHED)
// =======================

export async function getBrandsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<BrandsResponse | null> {
  "use cache";
  cacheTag("brands-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/brands?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No brands found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401) {
      console.warn("Unauthorized access to brands (401)");
      return null;
    }
    if (res.status === 403) {
      console.warn("Forbidden access to brands (403)");
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
      console.error("Service error:", "Error fetching brands");
      return null;
    }
  }
}

// =======================
// GET BRANDS WRAPPER
// =======================

export async function getBrands(
  params: Record<string, unknown> = {},
): Promise<BrandsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getBrandsCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
// GET BRANDS SIMPLE LIST (CACHED)
// =======================

export async function getBrandsSimpleListCached(
  token: string,
  search?: string,
): Promise<SimpleBrandsResponse | null> {
  "use cache";
  cacheTag("brands-simple-list");

  try {
    const urlParams = new URLSearchParams();
    if (search) {
      urlParams.append("search", search);
    }

    const queryString = urlParams.toString() ? `?${urlParams.toString()}` : "";

    const res = await fetch(
      `${API_BASE}/inventory/brands/simple-list${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No brands found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized/Forbidden access to simple brands list");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }
    const result = await res.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Service error in getBrandsSimpleListCached:",
        error.message,
      );
    } else {
      console.error("Service error in getBrandsSimpleListCached");
    }
    return null;
  }
}

// =======================
// GET BRANDS SIMPLE LIST
// =======================

export async function getBrandsSimpleList(
  params: Record<string, unknown> = {},
): Promise<SimpleBrandsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const search = typeof params.search === "string" ? params.search : undefined;
  const _cachedResult = await getBrandsSimpleListCached(token, search);

  if (!_cachedResult)
    throw new Error("Failed to fetch simple brands list from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE BRAND
// =======================

export async function getBrandById(
  id: number,
): Promise<SingleBrandResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/brands/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 404) {
      console.warn(`Brand with ID ${id} not found (404).`);
      return null;
    }
    if (res.status === 401) {
      console.warn("Unauthorized access to brand (401)");
      return null;
    }
    if (res.status === 403) {
      console.warn("Forbidden access to brand (403)");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("Error in getBrandById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch brand");
    } else {
      throw new Error("Failed to fetch brand");
    }
  }
}

// =======================
// CREATE BRAND
// =======================

export async function createBrand(
  formData: FormData,
): Promise<SingleBrandResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/brands`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("brands-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createBrand:", error);
      throw new Error(error.message || "Failed to create brand");
    } else {
      throw new Error("Failed to create brand");
    }
  }
}

// =======================
// UPDATE BRAND
// =======================

export async function updateBrand(
  id: number,
  formData: FormData,
): Promise<SingleBrandResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    if (!formData.has("_method")) {
      formData.append("_method", "PUT");
    }

    const res = await fetch(`${API_BASE}/inventory/brands/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("brands-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateBrand:", error);
      throw new Error(error.message || "Failed to update brand");
    } else {
      throw new Error("Failed to update brand");
    }
  }
}

// =======================
// DELETE BRAND
// =======================

export async function deleteBrand(id: number): Promise<SingleBrandResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/brands/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("brands-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteBrand:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete brand");
    }
  }
}

// =======================Start GET Inventory Deliveries =======================

export interface Delivery {
  id: number;
  requisition: string;
  delivery_branch: string;
  aspect_delivery: string;
  delivery_date: string;
  challan: string;
  delivery_type: string;
  status: number;
  status_text: string;
}

export interface DeliveriesData {
  total_deliveries: number;
  deliveries: Delivery[];
  pagination: PaginationType;
}

export interface DeliveriesResponse {
  success: boolean;
  message: string;
  code: number;
  data: DeliveriesData;
  errors?: Record<string, string[]>;
}

export async function getInventoryDeliveriesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<DeliveriesResponse | null> {
  try {
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/deliveries?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No deliveries found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401) {
      console.warn("Unauthorized access to deliveries (401)");
      return null;
    }

    if (res.status === 403) {
      console.warn("Forbidden access to deliveries (403)");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result: DeliveriesResponse = await res.json();

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching deliveries");
      return null;
    }
  }
}

export async function getInventoryDeliveries(
  params: Record<string, unknown> = {},
): Promise<DeliveriesResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }

  const cachedResult = await getInventoryDeliveriesCached(token, params);

  if (!cachedResult) {
    throw new Error("Failed to fetch data from cache.");
  }

  return cachedResult;
}

// =======================End GET Inventory Deliveries =======================

// =======================Start GET Delivery Challan Invoice =============================

export interface DeliveredFrom {
  name: string;
  phone: string;
  website: string;
  address: string;
  bin_no: string | null;
}

export interface DeliveredTo {
  name: string;
  branch: string;
  phone: string;
}

export interface DeliveryInvoiceItem {
  id: number;
  product_name: string;
  quantity: number;
}

export interface DeliveryInvoiceData {
  req_id: string;
  challan_no: string;
  challan_date: string;
  delivery_date: string;
  delivered_from: DeliveredFrom;
  delivered_to: DeliveredTo;
  items: DeliveryInvoiceItem[];
  grouped_items: any[];
  total_quantity: number;
  delivery_cost: number;
  delivery_status: number;
  delivery_status_text: string;
  scan_url: string;
}

export interface DeliveryInvoiceResponse {
  success: boolean;
  message: string;
  code: number;
  data: DeliveryInvoiceData;
  errors?: Record<string, string[]>;
}

export async function getDeliveryChallanInvoice(
  id: string | number,
): Promise<DeliveryInvoiceResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }
  try {
    const res = await fetch(`${API_BASE}/inventory/deliveries/${id}/invoice`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("No deliveries found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401) {
      console.warn("Unauthorized access to deliveries (401)");
      return null;
    }

    if (res.status === 403) {
      console.warn("Forbidden access to deliveries (403)");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `Failed to fetch delivery invoice: ${res.status} ${res.statusText}`,
      );
    }

    const result: DeliveryInvoiceResponse = await res.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching delivery invoice:", error.message);
      return null;
    } else {
      console.error("Error fetching delivery invoice:", error);
      return null;
    }
  }
}

// =======================End GET Delivery Challan Invoice =============================

// =======================Start GET Delivery By ID =============================

export interface DeliveryApplicant {
  name: string;
  mob: string;
}

export interface RequestedItem {
  id: number;
  product_name: string;
  request_quantity: number;
  stock_qty: number;
  approved_qty: number;
  after_delivery_qty: number;
}

export interface DeliveryInvoice {
  invoice_no: string;
  branch: string;
  applicant: string;
  total_item: number;
  delivery_type: string;
  delivery_by: string;
  status: number;
  status_text: string;
  attachment?: string;
  description?: string;
}

export interface ApprovalDashboardItem {
  role_name: string;
  status: string;
  date_time: string;
  note?: string;
}

export interface DeliveryDetailData {
  requisition_no: string;
  delivery_branch: string;
  delivery_branch_id: number;
  applicant: DeliveryApplicant;
  expected_date?: string;
  delivery_status?: number;
  delivery_status_text?: string;
  requested_items: RequestedItem[];
  invoice?: DeliveryInvoice;
  approval_dashboard: ApprovalDashboardItem[];
}

export interface DeliveryDetailResponse {
  success: boolean;
  message: string;
  code: number;
  data: DeliveryDetailData;
  errors?: Record<string, string[]>;
}

export async function getDeliveryById(
  id: string | number,
): Promise<DeliveryDetailResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }
  try {
    const res = await fetch(`${API_BASE}/inventory/deliveries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Delivery not found (404). Returning null.");
      throw new Error(`${res.status} ${res.statusText}`);
    }

    if (res.status === 401) {
      console.warn("Unauthorized access to delivery (401)");
      throw new Error(`${res.status} ${res.statusText}`);
    }

    if (res.status === 403) {
      console.warn("Forbidden access to delivery (403)");
      throw new Error(`${res.status} ${res.statusText}`);
    }

    if (!res.ok) {
      throw new Error(
        `Failed to fetch delivery details: ${res.status} ${res.statusText}`,
      );
    }

    const result: DeliveryDetailResponse = await res.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching delivery details:", error.message);
      throw new Error(error.message || "Failed to fetch delivery details");
    } else {
      console.error("Error fetching delivery details:", error);
      throw new Error("Failed to fetch delivery details");
    }
  }
}

// =======================End GET Delivery By ID =============================
