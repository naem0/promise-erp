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

export interface JobApplyCareer {
    id: number;
    title: string;
    salary?: string | null;
}

export interface JobApply {
    id: number;
    career: JobApplyCareer;
    name: string;
    email: string;
    phone: string;
    address: string;
    resume: string;
    cover_letter: string;
    status: number;
    status_label: string;
    created_at: string;
}

export interface JobAppliesResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        total_applies: number;
        applies: JobApply[];
        pagination: PaginationType;
    };
    errors?: Record<string, string[]>;
}

export interface SingleJobApplyResponse {
    success: boolean;
    message: string;
    code: number;
    data: JobApply;
    errors?: Record<string, string[] | string>;
}

// =======================
// GET JOB APPLIES (CACHED)
// =======================

export async function getJobAppliesCached(
    token: string,
    params: Record<string, unknown> = {},
): Promise<JobAppliesResponse | null> {
    "use cache";
    cacheTag("job-applies-list");

    try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
        const urlParams = new URLSearchParams();
        for (const key in params) {
            if (
                params[key] !== undefined &&
                params[key] !== null &&
                Object.prototype.hasOwnProperty.call(params, key)
            ) {
                urlParams.append(key, String(params[key]));
            }
        }

        const res = await fetch(
            `${API_BASE}/job-applies?${urlParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            },
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
            console.error("Service error:", "Error fetching job applies");
            return null;
        }
    }
}

// =======================
// GET JOB APPLIES WRAPPER
// =======================

export async function getJobApplies(
    params: Record<string, unknown> = {},
): Promise<JobAppliesResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const _cachedResult = await getJobAppliesCached(token, params);

    if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

    return _cachedResult;
}

// =======================
// GET SINGLE JOB APPLY
// =======================

export async function getJobApplyById(
    id: number,
): Promise<SingleJobApplyResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/job-applies/${id}`, {
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
        console.error("Error in getJobApplyById:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to fetch job apply");
        } else {
            throw new Error("Failed to fetch job apply");
        }
    }
}

// =======================
// CREATE JOB APPLY
// =======================

export async function createJobApply(
    formData: FormData,
): Promise<SingleJobApplyResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/job-applies`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await res.json();

        updateTag("job-applies-list");
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in createJobApply:", error);
            throw new Error(error.message || "Failed to create job apply");
        } else {
            throw new Error("Failed to create job apply");
        }
    }
}

// =======================
// UPDATE JOB APPLY
// =======================

export async function updateJobApply(
    id: number,
    formData: FormData,
): Promise<SingleJobApplyResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/job-applies/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await res.json();

        updateTag("job-applies-list");
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in updateJobApply:", error);
            throw new Error(error.message || "Failed to update job apply");
        } else {
            throw new Error("Failed to update job apply");
        }
    }
}

// =======================
// DELETE JOB APPLY
// =======================

export async function deleteJobApply(
    id: number,
): Promise<SingleJobApplyResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            throw new Error("No valid session/token");
        }

        const res = await fetch(`${API_BASE}/job-applies/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        updateTag("job-applies-list");
        return result;
    } catch (error: unknown) {
        console.error("Error in deleteJobApply:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Failed to delete job apply");
        }
    }
}