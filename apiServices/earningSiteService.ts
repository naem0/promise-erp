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
export interface EarningSite {
    id: number;
    title: string;
    status: number;
}

export interface EarningSitesResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        total_earning_sites: number;
        earning_sites: EarningSite[];
        pagination: PaginationType;
    };
    errors?: Record<string, string[]>;
}
export interface EarningSitesSimpleListResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        total_earning_sites: number;
        earning_sites: EarningSite[];
    };
    errors?: Record<string, string[]>;
}
export interface SingleEarningSiteResponse {
    success: boolean;
    message: string;
    code: number;
    data: EarningSite | null;
    errors?: Record<string, string[] | string>;
}

// =======================
// GET EARNING SITES (CACHED)
// =======================

export async function getEarningSitesCached(
    token: string,
    params: Record<string, unknown> = {}
): Promise<EarningSitesResponse | null> {
    "use cache";
    cacheTag(CACHE_TAGS.EARNING_SITES);
    try {
        const urlParams = new URLSearchParams();
        for (const key in params) {
            if (params[key] !== undefined && params[key] !== null) {
                urlParams.append(key, String(params[key]));
            }
        }

        const res = await fetch(
            `${API_BASE}/earning-sites?${urlParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (res.status === 401 || res.status === 403) {
            console.warn("Unauthorized/Forbidden access to earning-sites list");
            return null;
        }
        if (res.status === 404) {
            console.warn("No earning-sites found");
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
            console.error("Service error:", "Error fetching earning sites");
            return null;
        }
    }
}

// =======================
// GET EARNING SITES WRAPPER
// =======================

export async function getEarningSites(
    params: Record<string, unknown> = {}
): Promise<EarningSitesResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const _cachedResult = await getEarningSitesCached(token, params);

    if (!_cachedResult) throw new Error("Failed to fetch earning sites from cache.");

    return _cachedResult;
}

// =======================
// GET SINGLE EARNING SITE
// =======================

export async function getEarningSiteById(id: number | string): Promise<SingleEarningSiteResponse | null> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");
    try {
        const res = await fetch(`${API_BASE}/earning-sites/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (res.status === 401 || res.status === 403) {
            console.warn("Unauthorized/Forbidden access to earning-sites simple-list");
            return null;
        }
        if (res.status === 404) {
            console.warn("No earning-sites found");
            return null;
        }
        if (!res.ok) {
            throw new Error(`Status: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();

        return result;
    } catch (error: unknown) {
        console.error("Error in getEarningSiteById:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to fetch earning site");
        } else {
            throw new Error("Failed to fetch earning site");
        }
    }
}

// =======================
// CREATE EARNING SITE
// =======================

export async function createEarningSite(
    formData: FormData
): Promise<SingleEarningSiteResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");
    try {
        const res = await fetch(`${API_BASE}/earning-sites`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await res.json();

        if (res.ok && result?.success) {
            updateTag(CACHE_TAGS.EARNING_SITES);
        }
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in createEarningSite:", error);
            throw new Error(error.message || "Failed to create earning site");
        } else {
            throw new Error("Failed to create earning site");
        }
    }
}

// =======================
// UPDATE EARNING SITE
// =======================

export async function updateEarningSite(
    id: number | string,
    formData: FormData
): Promise<SingleEarningSiteResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");
    try {
        if (!formData.has("_method")) {
            formData.append("_method", "PUT");
        }

        const res = await fetch(`${API_BASE}/earning-sites/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await res.json();

        if (res.ok && result?.success) {
            updateTag(CACHE_TAGS.EARNING_SITES);
        }
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in updateEarningSite:", error);
            throw new Error(error.message || "Failed to update earning site");
        } else {
            throw new Error("Failed to update earning site");
        }
    }
}

// =======================
// DELETE EARNING SITE
// =======================

export async function deleteEarningSite(id: number | string): Promise<SingleEarningSiteResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
        throw new Error("No valid session/token");
    }
    try {
        const res = await fetch(`${API_BASE}/earning-sites/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        if (res.ok && result?.success) {
            updateTag(CACHE_TAGS.EARNING_SITES);
        }
        return result;
    } catch (error: unknown) {
        console.error("Error in deleteEarningSite:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Failed to delete earning site");
        }
    }
}

// =======================
// GET EARNING SITES SIMPLE LIST
// =======================

export async function getEarningSitesSimpleList(
    search?: string,
): Promise<EarningSitesSimpleListResponse | null> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");
    try {
        const urlParams = new URLSearchParams();
        if (search) urlParams.append("search", search);

        const res = await fetch(
            `${API_BASE}/earning-sites/simple-list?${urlParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            },
        );

        if (res.status === 401 || res.status === 403) {
            console.warn("Unauthorized/Forbidden access to earning-sites simple-list");
            return null;
        }
        if (res.status === 404) {
            console.warn("No earning-sites found");
            return null;
        }
        if (!res.ok) throw new Error(`Status: ${res.status} ${res.statusText}`);

        return await res.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("getEarningSitesSimpleList error:", error.message);
        }
        return null;
    }
}
