"use server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { cacheTag, updateTag } from "next/cache"
import { handleApiError, processApiResponse } from "@/lib/apiErrorHandler"
import { PaginationType } from "@/types/pagination"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"

// District Interface
export interface District {
  id: number;
  name: string;
}

// Division Interface
export interface Division {
  id: number;
  name: string;
  districts: District[];
  districts_count: number;
}

//  Success Response Interface
export interface DivisionSuccessResponse {
  success: true;
  message: string;
  code: number;
  data: {
    total_divisions: number;
    divisions: Division[];
    pagination: PaginationType;
  };
}

//  Error Response Interface
export interface DivisionErrorResponse {
  success: false;
  message: string;
  code: number;
  errors?: Record<string, string[] | string>;
}

//  Union Type for Response
export type DivisionResponseType = DivisionSuccessResponse | DivisionErrorResponse;

// =======================
// 🔹 Get Divisions (Paginated)
// =======================

export async function getDivisionsCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<DivisionSuccessResponse> {
  "use cache"
  cacheTag("divisions-list")

  try {
    const urlParams = new URLSearchParams()

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null && params.hasOwnProperty(key)) {
        urlParams.append(key, params[key].toString())
      }
    }

    const res = await fetch(`${API_BASE}/divisions?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    return await res.json()
  } catch (error) {
    console.error("Error in getDivisionsCached:", error)
    throw new Error(error instanceof Error ? error.message : "Unknown error occurred while fetching divisions")
  }
}

export async function getDivisions(
  params: Record<string, unknown> = {}
): Promise<DivisionSuccessResponse> {
  // try-এর বাইরে রাখা হয়েছে যাতে Next.js build-time dynamic signal সঠিকভাবে প্রপাগেট হয়
  const session = await getServerSession(authOptions)
  const token = session?.accessToken

  if (!token) {
    throw new Error("No valid session or access token found.")
  }

  try {
    return await getDivisionsCached(token, params)
  } catch (error) {
    console.error("Error in getDivisions:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to get divisions")
  }
}

// =======================
//  Add Division
// =======================

export interface DivisionFormData {
  name: string;
}
export async function addDivision(
  formData: DivisionFormData
): Promise<DivisionResponseType> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
      };
    }

    const res = await fetch(`${API_BASE}/divisions`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await processApiResponse(res, "Failed to add division.");
    
    if (!result.success) {
      return result;
    }
    
    updateTag("divisions-list");
    return {
      success: true,
      message: result.message || "Division added successfully.",
      data: result.data,
      code: result.code || 200,
    };
  } catch (error) {
    return await handleApiError(error, "Failed to add division.");
  }
}

// =======================
//  Get Division by ID
// =======================


export interface DivisionDetailsResponse {
  success: boolean;
  message: string;
  code: number;
  data?: {
    division?: Division;
  };
}

export async function getDivision(id: number): Promise<DivisionDetailsResponse> {
  try {
    const session = await getServerSession(authOptions)
    const token = session?.accessToken

    if (!token) {
      throw new Error("No valid session or access token found.")
    }

    const res = await fetch(`${API_BASE}/divisions/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })

    return await res.json()
  } catch (error) {
    console.error("Error in get Division:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get Division"
    );
  }
}

// =======================
//  Update Division
// =======================

export async function updateDivision(
  id: number,
  formData: DivisionFormData
): Promise<DivisionResponseType> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        code: 401,
      };
    }

    const res = await fetch(`${API_BASE}/divisions/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await processApiResponse(res, "Failed to update division.");
    
    if (!result.success) {
      return result;
    }
    
    updateTag("divisions-list");
    return {
      success: true,
      message: result.message || "Division updated successfully.",
      data: result.data,
      code: result.code || 200,
    };
  } catch (error) {
    return await handleApiError(error, "Failed to update division.");
  }
}

// =======================
//  Delete Division
// =======================

export async function deleteDivision(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getServerSession(authOptions)
    const token = session?.accessToken

    if (!token) {
      return { success: false, message: "Unauthorized" }
    }

    const res = await fetch(`${API_BASE}/divisions/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      const errorData = await res.json().catch(async () => ({ message: await res.text() }));
      return { success: false, message: errorData.message || "Failed to delete division." };
    }

    // If the response is OK, assume success and provide a default message
    updateTag("divisions-list")
    return { success: true, message: "Division deleted successfully." };
  } catch (error) {
    console.error("Error in deleteDivision:", error)
    return { success: false, message: error instanceof Error ? error.message : "Failed to delete division" };
  }
}
// =======================
//  Get Divisions By ID
// =======================
export async function getDivisionsById(
  id: string
): Promise<DivisionResponseType> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/divisions/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch district: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error in getDistrictById:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching district"
    );
  }
}