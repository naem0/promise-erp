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

export interface ContactPage {
  id: number;
  page_title: string;
  page_subtitle: string;
  page_banner?: string;
  email: string[];
  phone: string[];
  address: string;
  office_hours: string;
  google_map: string;
  meta_title?: string;
  meta_description?: string;
  meta_tag?: string[];
  schema?: string;
  status: number;
}

export interface ContactPagesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_contact_pages: number;
    contact_pages: ContactPage[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleContactPageResponse {
  success: boolean;
  message: string;
  code: number;
  data: ContactPage;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET CONTACT PAGES (CACHED)
// =======================

export async function getContactPagesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<ContactPagesResponse | null> {
  "use cache";
  cacheTag("contact-pages-list");

  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/contact-pages?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      console.error(`Contact pages fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("Error in getContactPagesCached:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getContactPages(
  params: Record<string, unknown> = {},
): Promise<ContactPagesResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const result = await getContactPagesCached(token, params);
  if (!result) throw new Error("Failed to fetch contact pages.");
  return result;
}

// =======================
// GET SINGLE CONTACT PAGE
// =======================

export async function getContactPageById(
  id: number,
): Promise<SingleContactPageResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/contact-pages/${id}`, {
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
    console.error("Error in getContactPageById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch contact page");
    } else {
      throw new Error("Failed to fetch contact page");
    }
  }
}

// =======================
// CREATE CONTACT PAGE
// =======================

export async function createContactPage(
  formData: FormData,
): Promise<SingleContactPageResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/contact-pages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("contact-pages-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createContactPage:", error);
      throw new Error(error.message || "Failed to create contact page");
    } else {
      throw new Error("Failed to create contact page");
    }
  }
}

// =======================
// UPDATE CONTACT PAGE
// =======================

export async function updateContactPage(
  id: number,
  formData: FormData,
): Promise<SingleContactPageResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/contact-pages/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("contact-pages-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateContactPage:", error);
      throw new Error(error.message || "Failed to update contact page");
    } else {
      throw new Error("Failed to update contact page");
    }
  }
}

// =======================
// DELETE CONTACT PAGE
// =======================

export async function deleteContactPage(
  id: number,
): Promise<SingleContactPageResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session/token");
    }

    const res = await fetch(`${API_BASE}/contact-pages/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("contact-pages-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteContactPage:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete contact page");
    }
  }
}
