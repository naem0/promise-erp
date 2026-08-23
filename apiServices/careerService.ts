"use server";
import { cacheTag, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface CareerCategory {
    id: number;
    name: string;
}

export interface CareerBranch {
    id: number;
    name: string;
}

export interface CareerTool {
    id: number;
    title: string;
}

export interface Career {
    id: number;
    title: string;
    slug: string;
    subtitle: string;
    short_description?: string;
    description?: string;
    salary?: string;
    deadline?: string;
    image?: string;
    job_type: number;
    job_type_label: string;
    location: string;
    status: number;
    meta_title?: string;
    meta_description?: string;
    meta_tag?: string[];
    schema?: string;
    career_category: CareerCategory;
    branch: CareerBranch;
    tools?: CareerTool[];
}

export interface CareersResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        total_careers: number;
        careers: Career[];
        pagination: PaginationType;
    };
    errors?: Record<string, string[]>;
}

export interface CareerCategoriesResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        total_career_categories: number;
        career_categories: CareerCategory[];
        pagination: PaginationType;
    };
    errors?: Record<string, string[]>;
}

export interface SingleCareerResponse {
    success: boolean;
    message: string;
    code: number;
    data: Career;
    errors?: Record<string, string[] | string>;
}

// =======================
// GET CAREERS (CACHED)
// =======================

export async function getCareersCached(
    token: string,
    params: Record<string, unknown> = {}
): Promise<CareersResponse | null> {
    "use cache";
    cacheTag(CACHE_TAGS.CAREERS);
    // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    try {
        const urlParams = new URLSearchParams();
        for (const key in params) {
            if (params[key] !== undefined && params[key] !== null) {
                urlParams.append(key, String(params[key]));
            }
        }

        const res = await fetch(
            `${API_BASE}/careers?${urlParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!res.ok) {
            console.error(`Careers fetch failed: ${res.status} ${res.statusText}`);
            return null;
        }

        return await res.json();
    } catch (error: unknown) {
        console.error("Error in getCareersCached:", error instanceof Error ? error.message : error);
        return null;
    }
}

export async function getCareers(
    params: Record<string, unknown> = {}
): Promise<CareersResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const result = await getCareersCached(token, params);
    if (!result) throw new Error("Failed to fetch careers.");
    return result;
}

// =======================
// GET SINGLE CAREER
// =======================

export async function getCareerById(id: number): Promise<SingleCareerResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/careers/${id}`, {
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
        console.error("Error in getCareerById:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to fetch career");
        } else {
            throw new Error("Failed to fetch career");
        }
    }
}

// =======================
// CREATE CAREER
// =======================

export async function createCareer(
    formData: FormData
): Promise<SingleCareerResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/careers`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await res.json();

        if (res.ok && result?.success) {
          updateTag(CACHE_TAGS.CAREERS);
        }
        return result;
    } catch (error: unknown) {
        console.error("Error in createCareer:", error);
        if (error instanceof Error) {
            console.error("Error in createCareer:", error);
            throw new Error(error.message || "Failed to create career");
        } else {
            throw new Error("Failed to create career");
        }
    }
}

// =======================
// UPDATE CAREER
// =======================

export async function updateCareer(
    id: number,
    formData: FormData
): Promise<SingleCareerResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        // Use POST with _method=PUT for multipart/form-data
        formData.append("_method", "PUT");

        const res = await fetch(`${API_BASE}/careers/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await res.json();

        if (res.ok && result?.success) {
          updateTag(CACHE_TAGS.CAREERS);
        }
        return result;
    } catch (error: unknown) {
            console.error("Error in updateCareer:", error);
        if (error instanceof Error) {
            console.error("Error in updateCareer:", error);
            throw new Error(error.message || "Failed to update career");
        } else {
            throw new Error("Failed to update career");
        }
    }
}

// =======================
// DELETE CAREER
// =======================

export async function deleteCareer(id: number): Promise<SingleCareerResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            throw new Error("No valid session/token");
        }

        const res = await fetch(`${API_BASE}/careers/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        if (res.ok && result?.success) {
          updateTag(CACHE_TAGS.CAREERS);
        }
        return result;
    } catch (error: unknown) {
        console.error("Error in deleteCareer:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Failed to delete career");
        }
    }
}

// =======================
// GET CAREER CATEGORIES (CACHED)
// =======================

export async function getCareerCategoriesCached(
    token: string,
    params: Record<string, unknown> = {}
): Promise<CareerCategoriesResponse | null> {
    "use cache";
    cacheTag(CACHE_TAGS.CAREERS);
    // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    try {
        const urlParams = new URLSearchParams();
        for (const key in params) {
            if (params[key] !== undefined && params[key] !== null) {
                urlParams.append(key, String(params[key]));
            }
        }

        const res = await fetch(
            `${API_BASE}/career-categories?${urlParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!res.ok) {
            console.error(`Career categories fetch failed: ${res.status} ${res.statusText}`);
            return null;
        }

        return await res.json();
    } catch (error: unknown) {
        console.error("Error in getCareerCategoriesCached:", error instanceof Error ? error.message : error);
        return null;
    }
}

export async function getCareerCategories(
    params: Record<string, unknown> = {}
): Promise<CareerCategoriesResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const result = await getCareerCategoriesCached(token, params);
    if (!result) throw new Error("Failed to fetch career categories.");
    return result;
}
