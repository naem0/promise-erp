"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface PaymentMethod {
    id: number;
    name: string;
    type?: string;
    image?: string | null;
    status: number;
}

export interface PaymentMethodNamesResponse {
    success: boolean;
    message: string;
    code: number;
    data: PaymentMethod[];
    errors?: Record<string, string[]>;
}

// =======================
// GET PAYMENT METHOD NAMES
// =======================

export async function getPaymentMethodNames(
    search?: string,
): Promise<PaymentMethodNamesResponse | null> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");
    try {
        const urlParams = new URLSearchParams();
        if (search) urlParams.append("search", search);

        const res = await fetch(
            `${API_BASE}/payment-methods/names?${urlParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            },
        );

        if (res.status === 401 || res.status === 403) {
            console.warn("Unauthorized/Forbidden access to payment-methods/names");
            return null;
        }
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Status: ${res.status} ${res.statusText}`);

        return await res.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("getPaymentMethodNames error:", error.message);
        }
        return null;
    }
}
