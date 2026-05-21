
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// start get enrollment details

export type DiscountType = "fixed" | "percentage";

// batch info
export interface EnrollmentBatch {
  id: number;
  price: number;
  discount: number;
  discount_type: DiscountType;
  after_discount: number;
  batch_discount_amount: number;
  coupon_discount_amount: number;
  total_discount_amount: number;
  batch_discount_percentage: number;
  coupon_discount_percentage: number;
  discount_percentage: number;
  total_discount_percentage: number;
}

// main data
export interface EnrollmentsData {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  featured_image: string | null;
  batch: EnrollmentBatch;
}

// API response
export interface EnrollmentResponse {
  success: boolean;
  message: string;
  code: number;
  data: EnrollmentsData;
  errors?: Record<string, string[]>;
}

// end get enrollment details

// start for coupon apply
export interface EnrollmentCouponRequest {
  batch: number;
  coupon_code: string;
}
export interface EnrollmentData {
  valid: boolean;
  original_price: number;
  discount_percentage: number;
  discount_amount: number;
  final_price: number;
  coupon: {
    id: number;
    coupon_code: string;
    discount_percentage: number;
  };
}

export interface EnrollmentCouponResponse {
  success: boolean;
  message: string;
  code: number;
  data: EnrollmentData;
  errors?: Record<string, string[]>;
}
// end for coupon apply

// start post enrollment Submition
export enum PaymentMethodSubmit {
  PAYLATER = 0, // default
  ROCKET = 1,
  NAGAD = 2,
  BKASH = 3,
}

// payment_type
export enum PaymentTypeSubmit {
  FULL = 0,
  PARTIAL = 1, // optional
}
export interface EnrollmentBatchSubmit {
  id: number;
  name: string;
}

export interface EnrollmentCouponSubmit {
  id: number;
  coupon_code: string;
}

export interface EnrollmentSubmit {
  id: number;
  batch_id: number;
  payment_method: PaymentMethodSubmit;
  payment_type: PaymentTypeSubmit;
  partial_payment_amount: number | null;
  batch: EnrollmentBatchSubmit;
  coupon: EnrollmentCouponSubmit | null;
}

export interface EnrollmentPricing {
  original_price: number;
  discount_amount: number;
  final_price: number;
  coupon_applied: boolean;
  payment_type: PaymentTypeSubmit;
  partial_payment_amount: number | null;
  due_amount: number;
}

export interface EnrollmentSubmitResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    enrollment: EnrollmentSubmit;
    pricing: EnrollmentPricing;
    message: string;
  };
  errors?: Record<string, string[]>;
}
interface EnrollmentSubmitPayload {
  batch_id: number,
  coupon_code: string | null,
  payment_method: number | string,
  payment_type: number | null,
  partial_payment_amount: number | null,
}
// End post enrollment Submition


// get enrollment details ==> getEnrollmentDetails
export async function getEnrollmentDetails(
  slug: string,
  token: string,
  params?: Record<string, string | null>,
): Promise<EnrollmentResponse | null> {
  if (!token) { throw new Error("No valid session or access token found.")}
  try {

    const urlParams = new URLSearchParams();

    if (params) {
      for (const key in params) {
        if (params[key] !== undefined && params[key] !== null) {
          urlParams.append(key, String(params[key]));
        }
      }
    }

    const queryString = urlParams.toString();

    const url = `${API_BASE}/courses/${slug}/enrollment-details${
      queryString ? `?${queryString}` : ""
    }`;
    const res = await fetch(url,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if(res.status === 404) {
      console.error("Enrollment API Error: Not Found");
      return null; 
    }
    if(res.status === 403) {
      console.error("Enrollment API Error: Forbidden");
      return null; 
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch enrollment details ${res.status} (${res.statusText}`);
    }

    const data: EnrollmentResponse | null = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Enrollment API Error:", error);
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch enrollment details");;
  }
}

// function for postEnrollmentCoupon
export async function postEnrollmentCoupon(batchId: number, couponCode: string, token: string): Promise<EnrollmentCouponResponse> {
  if (!token) { throw new Error("No valid session or access token found.")}
  try {

    const response = await fetch(`${API_BASE}/batches/${batchId}/validate-coupon`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          batch: batchId,
          coupon_code: couponCode,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to validate coupon ${response.status} (${response.statusText})`);
    }
    const data: EnrollmentCouponResponse = await response.json();
    return data;

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Enrollment API Error:", error);
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch enrollment details");;
  }
}

// function for postEnrollmentSubmit

export async function postEnrollmentSubmit(
  payload: EnrollmentSubmitPayload,
  token: string
): Promise<EnrollmentSubmitResponse> {

  if (!token) { throw new Error("No valid session or access token found.") }

  try {
    const { batch_id, payment_method, coupon_code, payment_type, partial_payment_amount } = payload;

    const body = {
      coupon_code,
      payment_method,
      payment_type,
      partial_payment_amount,
    };

    const response = await fetch(`${API_BASE}/batches/${batch_id}/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data: EnrollmentSubmitResponse = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Enrollment API Error:", error);
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch enrollment details");;
  }
}

