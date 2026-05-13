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

export interface Tool {
    id: number;
    title: string;
    sub_title: string;
    status: number;
    image: string | null;
}

export interface ToolsResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        total_tools: number;
        tools: Tool[];
        pagination: PaginationType;
    };
    errors?: Record<string, string[]>;
}

export interface SingleToolResponse {
    success: boolean;
    message: string;
    code: number;
    data: Tool | null;
    errors?: Record<string, string[] | string>;
}

// =======================
// GET TOOLS (CACHED)
// =======================

export async function getToolsCached(
    token: string,
    params: Record<string, unknown> = {}
): Promise<ToolsResponse | null> {
    "use cache";
    cacheTag("tools-list");

    try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
        const urlParams = new URLSearchParams();
        for (const key in params) {
            if (params[key] !== undefined && params[key] !== null) {
                urlParams.append(key, String(params[key]));
            }
        }

        const res = await fetch(
            `${API_BASE}/course-tools?${urlParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

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
            console.error("Service error:", "Error fetching tools");
            return null;
        }
    }
}

// =======================
// GET TOOLS WRAPPER
// =======================

export async function getTools(
    params: Record<string, unknown> = {}
): Promise<ToolsResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const _cachedResult = await getToolsCached(token, params);

    if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

    return _cachedResult;
}

// =======================
// GET SINGLE TOOL
// =======================

export async function getToolById(id: number): Promise<SingleToolResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/course-tools/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`Status: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();

        return result;
    } catch (error: unknown) {
        console.error("Error in getToolById:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to fetch tool");
        } else {
            throw new Error("Failed to fetch tool");
        }
    }
}

// =======================
// CREATE TOOL
// =======================

export async function createTool(
    formData: FormData
): Promise<SingleToolResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/course-tools`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await res.json();

        updateTag("tools-list");
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in createTool:", error);
            throw new Error(error.message || "Failed to create tool");
        } else {
            throw new Error("Failed to create tool");
        }
    }
}

// =======================
// UPDATE TOOL
// =======================

export async function updateTool(
    id: number,
    formData: FormData
): Promise<SingleToolResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        // Use POST with _method=PUT for multipart/form-data
        formData.append("_method", "PUT");

        const res = await fetch(`${API_BASE}/course-tools/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await res.json();

        updateTag("tools-list");
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in updateTool:", error);
            throw new Error(error.message || "Failed to update tool");
        } else {
            throw new Error("Failed to update tool");
        }
    }
}

// =======================
// DELETE TOOL
// =======================

export async function deleteTool(id: number): Promise<SingleToolResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            throw new Error("No valid session/token");
        }

        const res = await fetch(`${API_BASE}/course-tools/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        updateTag("tools-list");
        return result;
    } catch (error: unknown) {
        console.error("Error in deleteTool:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Failed to delete tool");
        }
    }
}
