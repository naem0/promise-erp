"use server"

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface PaymentHistoryResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: unknown;
}

export interface CreatePaymentData {
  enrollment_id: number;
  paid_amount: number;
  payment_method: number;
  payment_status: number;
  comment?: string;
  payment_number?: string;
  transaction_id?: string;
}

export interface UpdatePaymentStatusData {
  payment_status: number;
  comment?: string;
}

// ==========================
// Update Payment History Status
// ==========================

export async function updatePaymentHistoryStatus(
  paymentHistoryId: number,
  data: UpdatePaymentStatusData
): Promise<PaymentHistoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/payment-histories/${paymentHistoryId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        payment_status: data.payment_status,
        comment: data.comment,
      }),
    });

    const result = await res.json();

    if (!result.success && !result.errors) {
      throw new Error(result.message || "Failed to update payment status.");
    }

    return result;
  } catch (error) {
    console.error("Error in updatePaymentHistoryStatus:", error);
    throw error;
  }
}

// ==========================
// Create Payment
// ==========================

export async function createPayment(
  data: CreatePaymentData
): Promise<PaymentHistoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }


    const res = await fetch(`${API_BASE}/payment-histories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!result.success && !result.errors) {
      throw new Error(result.message || "Failed to create payment.");
    }

    return result;
  } catch (error) {
    console.error("Error in createPayment:", error);
    throw error;
  }
}

// ==========================
// Process Payment (Admin)
// ==========================

export async function processPayment(
  data: CreatePaymentData
): Promise<PaymentHistoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/payment-histories/process-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Failed to process payment.");
    }

    return result;
  } catch (error) {
    console.error("Error in processPayment:", error);
    throw error;
  }
}
