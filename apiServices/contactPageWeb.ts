"use server";
import { cacheTag, updateTag, cacheLife } from "next/cache";

import { CACHE_TAGS } from "@/constants/cacheTags";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

//****************** Start function getPublicContactPageInfo ****************/
export interface ContactPageInfo {
  id: number;
  branch_id: number;
  page_title: string;
  page_subtitle: string;
  page_banner?: string | null;
  email: string;
  phone: string;
  address: string;
  office_hours: string;
  google_map: string;
  status: number;
}
export interface ContactPageInfoApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: ContactPageInfo;
  errors?: Record<string, string[]>;
}
export async function getPublicContactPageInfo(): Promise<ContactPageInfoApiResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.CONTACT_PAGES);
  cacheLife("days");
  try {
    const res = await fetch(`${API_BASE}/public/contact-page`);

    if (res.status === 404) {
      console.warn("No contact page info found.");
      return null;
    }
    if (res.status === 401) {
      console.error("Error fetching contact page info:", res.statusText);
      return null;
    }
    if (res.status === 402) {
      console.error("Error fetching contact page info:", res.statusText);
      return null;
    }
    if (res.status === 403) {
      console.error("Error fetching contact page info:", res.statusText);
      return null;
    }
    if (res.status === 405) {
      console.error("Error fetching contact page info:", res.statusText);
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `getPublicContactPageInfo API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: ContactPageInfoApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    if (error instanceof Error) {
      console.error("Error fetching contact page info:", error.message);
      throw new Error(error.message);
    }

    throw new Error("Unknown error occurred while fetching contact page info.");
  }
}
//****************** */ End function getPublicContactPageInfo ****************/

// ****************** Start function submitContactForm ****************/

export interface ContactQueryData {
  id: number;
  branch_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: number;
}

export interface ContactQueryApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: ContactQueryData;
  errors?: Record<string, string[]>;
}

interface ContactQueryPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}

export async function submitContactForm(
  payload: ContactQueryPayload,
): Promise<ContactQueryApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/contact-queries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: ContactQueryApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error submitting contact form:", error.message);
      throw new Error(error.message);
    }

    throw new Error("Unknown error occurred while submitting contact form.");
  }
}
// ****************** End function submitContactForm ****************/

// ****************** Start function getPublicContactFaqs ****************/

export interface ContactPageFAQFaqItem {
  id: number;
  question: string;
  answer: string;
  type: number;
  status: number;
}

// Full API response
export interface ContactPagePublicFaqResponse {
  success: boolean;
  message: string;
  code: number;
  data: ContactPageFAQFaqItem[];
  errors?: Record<string, string[]>;
}
export async function getPublicContactFaqs(): Promise<ContactPagePublicFaqResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/contact-faqs`);

    if (!res.ok) {
      throw new Error(
        `getPublicContactFaqs API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: ContactPagePublicFaqResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return { success: false, message: "Request aborted", code: 499, data: [] };
    }
    if (error instanceof Error) {
      console.error("Error fetching public contact FAQs:", error.message);
      throw new Error(error.message);
    }

    throw new Error(
      "Unknown error occurred while fetching public contact FAQs.",
    );
  }
}
// ****************** End function getPublicContactFaqs ****************/
