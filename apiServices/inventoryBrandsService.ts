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

    // The user specified POST/inventory/brands/{id} for update
    const res = await fetch(`${API_BASE}/inventory/brands/${id}`, {
      method: "PUT",
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
  "use cache";
  cacheTag("deliveries-list");

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
  total_quantity: number;
  delivery_cost: number;
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
