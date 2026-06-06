"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface InvoiceSummary {
  total_invoices: number;
  paid_invoices: number;
  pending_invoices: number;
  overdue_invoices: number;
  total_revenue: string;
}

export interface Invoice {
  id: number;
  invoice_no: string;
  final_amount: number;
  status: number;
  status_text: string;
  due_date: string;
  paid_at?: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  profile_image?: string;
}

export interface InvoiceData {
  summary: InvoiceSummary;
  invoices: Invoice[];
  pagination: PaginationType;
}

export interface InvoicesResponse {
  success: boolean;
  message: string;
  code: number;
  data: InvoiceData;
}

export async function getInvoices(
  params: Record<string, unknown> = {},
): Promise<InvoicesResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, params[key].toString());
      }
    }
  const url = `${API_BASE}/invoices?${urlParams.toString()}`;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || `Status: ${res.status} ${res.statusText}`);
    }

    if(res.status === 401 || res.status === 403) {
      console.error("Unauthorized");
      return null
    }

    if(res.status === 404) {
      console.error("Not Found");
      return null
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in getInvoices:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred while fetching invoices.");
    }
  }
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_image?: string;
}

export interface CourseInfo {
  id: number;
  title: string;
  slug: string;
}

export interface BatchInfo {
  id: number;
  name: string;
  batch_duration: string;
  batch_end_date: string;
  batch_start_date: string;
  course: CourseInfo;
}

export interface PaymentDetails {
  pre_amount: number;
  paid_amount: number;
  due_amount: number;
  payment_method_id: number;
  payment_method: number;
  payment_method_name: string;
  payment_status: number;
  payment_status_name: string;
  payment_type_name: string;
  installment_type_name: string;
  payment_number: string | null;
  transaction_id: string | null;
  comment: string | null;
  date?: string;
}

export interface PaymentHistory {
  id: number;
  approved_by: string | null;
  payment_details: PaymentDetails;
}

export interface PaymentTimelineItem {
  title: string;
  subtitle: string;
  date: string;
}

export interface InvoiceDetailData {
  id: number;
  invoice_no: string;
  batch_id: string;
  branch_name: string;
  coupon_id: number | null;
  coupon_code: string | null;
  coupon_discount: number | null;
  original_price: number;
  discount_amount: number;
  final_price: number;
  enrollment_date: string;
  expired_at: string;
  approved_by: string | null;
  status: number;
  status_label: string;
  payment_method_id: number;
  payment_method_label: string;
  payment_status: number;
  payment_status_label: string;
  payment_type_label: string | null;
  payment_type: string | null;
  payment_amount: number;
  partial_payment_amount: number;
  due_amount: number;
  payment_reference: string | null;
  user: UserInfo;
  batch: BatchInfo;
  payment_histories: PaymentHistory[];
  payment_timeline: PaymentTimelineItem[];
}

export interface InvoiceDetailResponse {
  success: boolean;
  message: string;
  code: number;
  data: InvoiceDetailData;
}

export async function getInvoiceById(
  id: string | number
): Promise<InvoiceDetailResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const url = `${API_BASE}/invoices/${id}`;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    if (res.status === 401 || res.status === 403) {
      console.error("Unauthorized");
      return null;
    }

    if (res.status === 404) {
      console.error("Not Found");
      return null;
    }

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || `Status: ${res.status} ${res.statusText}`);
    }

    return result;
  } catch (error: unknown) {
    console.error(`Error in getInvoice for ID ${id}:`, error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred while fetching invoice details.");
    }
  }
}

