"use server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { handleApiError, processApiResponse } from "@/lib/apiErrorHandler";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// Group type
export interface Group {
  id: number;
  group_name: string;
  batch_id: string;
  is_active: boolean;
  total_students: string;
  division_id: number;
  district_id: number;
  batch: {
    id: number;
    name: string;
  };
  course: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    name: string;
  };
}



// Main data object
export interface GroupData {
  total_groups: number;
  groups: Group[];
  pagination: PaginationType;
}

// API Response type
export interface GroupResponse {
  success: boolean;
  message: string;
  code: number;
  data: GroupData;
}

// =======================
//  Get Groups (Paginated)
// =======================

export async function getGroupsCached(
  page = 1,
  token: string,
  params: Record<string, unknown> = {}
): Promise<GroupResponse | null> {
  "use cache";
  cacheTag("groups-list");

  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();
    urlParams.append("page", page.toString());

    for (const key in params) {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params.hasOwnProperty(key)
      ) {
        urlParams.append(key, params[key].toString());
      }
    }

    const res = await fetch(`${API_BASE}/groups?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    return await res.json();
  } catch (error) {
    console.error("Error in getGroupsCached:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getGroups(
  page = 1,
  params: Record<string, unknown> = {}
): Promise<GroupResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const _cachedResult = await getGroupsCached(page, token, params);

    if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

    return _cachedResult;
  } catch (error) {
    console.error("Error in get groups:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get groups"
    );
  }
}

// =======================
//  Add Group
// =======================

export interface AddGroupApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: Group;
  errors?: Record<string, string[] | string>;
}
export interface GroupFormData {
  group_name: string;
  division_id?: number;
  district_id?: number;
  branch_id?: number;
  course_id?: number;
  batch_id?: number;
  is_active?: boolean;
}

export async function addGroup(
  groupData: GroupFormData
): Promise<AddGroupApiResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
        errors: {},
        code: 401,
      };
    }
    const response = await fetch(`${API_BASE}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(groupData),
    });

    const result = await processApiResponse(response, "Failed to add group.");

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        errors: result.errors,
        code: result.code,
      };
    }

    updateTag("groups-list");

    return {
      success: true,
      message: result.message || "Group added successfully.",
      data: result.data,
      code: result.code || 200,
    };
  } catch (error) {
    return await handleApiError(error, "Failed to add group.");
  }
}

// =======================
//  Get Group By ID
// =======================

export interface GroupSingleResponse {
  success: boolean;
  message: string;
  data: Group;
}

export async function getGroupById(
  id: string
): Promise<GroupSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/groups/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch group: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error in getGroupById:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error occurred while fetching group"
    );
  }
}

// =======================
//  Update Group
// =======================

export async function updateGroup(
  id: string,
  groupData: GroupFormData
): Promise<AddGroupApiResponse> {
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

    const res = await fetch(`${API_BASE}/groups/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(groupData),
    });

    const result = await processApiResponse(res, "Failed to update group.");

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        errors: result.errors,
        code: result.code,
      };
    }

    updateTag("groups-list");
    return {
      success: true,
      message: result.message || "Group updated successfully.",
      data: result.data,
      code: result.code || 200,
    };
  } catch (error) {
    return await handleApiError(error, "Failed to update group.");
  }
}

// =======================
// Delete Group
// =======================

export interface DeleteGroupResponse {
  success: boolean;
  message: string;
  code?: number;
  data?: unknown;
}

export async function deleteGroup(
  id: number
): Promise<DeleteGroupResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      return { success: false, message: "Unauthorized", code: 401 };
    }

    const res = await fetch(`${API_BASE}/groups/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await processApiResponse(res, "Failed to delete group");
    
    if (!result.success) {
      return { success: false, message: result.message, code: result.code };
    }
    
    updateTag("groups-list");
    return { success: true, message: result.message || "Group deleted successfully", code: result.code };
  } catch (error) {
    const errorResult = await handleApiError(error, "Failed to delete group");
    return { success: false, message: errorResult.message, code: errorResult.code };
  }
}
