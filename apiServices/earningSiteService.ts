"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

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
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Status: ${res.status} ${res.statusText}`);

        return await res.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("getEarningSitesSimpleList error:", error.message);
        }
        return null;
    }
}
