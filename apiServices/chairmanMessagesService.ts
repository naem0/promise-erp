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

export interface ChairmanMessage {
  id: number;
  name: string;
  designation: string;
  message_title: string;
  message_content: string;
  chairman_image?: string | null;
  status: number;
  type: number; // 1=chairman_message, 2=md_message
}

export interface ChairmanMessagesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_chairman_messages: number;
    chairman_messages: ChairmanMessage[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleChairmanMessageResponse {
  success: boolean;
  message: string;
  code: number;
  data: ChairmanMessage;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET CHAIRMAN MESSAGES (CACHED)
// =======================

export async function getChairmanMessagesCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<ChairmanMessagesResponse | null> {
  "use cache";
  cacheTag("chairman-messages-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/chairman-messages?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No items found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }
    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("getChairmanMessagesCached error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch Management messages");
  }
}

// =======================
// GET CHAIRMAN MESSAGES WRAPPER
// =======================

export async function getChairmanMessages(
  params: Record<string, unknown> = {},
): Promise<ChairmanMessagesResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No valid session/token");
  }
  try {
    const cachedResult = await getChairmanMessagesCached(token, params);
    if (!cachedResult) {
      throw new Error("Failed to fetch Management messages");
    }
    return cachedResult;
  } catch (error: unknown) {
    console.error("getChairmanMessages error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}

// =======================
// GET SINGLE CHAIRMAN MESSAGE
// =======================

export async function getChairmanMessageById(
  id: number,
): Promise<SingleChairmanMessageResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/chairman-messages/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 404) {
      console.warn("No item found (404). Returning null.");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }
    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("Error in getChairmanMessageById:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to fetch chairman message");
    }
  }
}

// =======================
// CREATE CHAIRMAN MESSAGE
// =======================

export async function createChairmanMessage(
  formData: FormData,
): Promise<SingleChairmanMessageResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/chairman-messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      updateTag("chairman-messages-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createChairmanMessage:", error);
      throw error;
    } else {
      throw new Error("Failed to create chairman message");
    }
  }
}

// =======================
// UPDATE CHAIRMAN MESSAGE
// =======================

export async function updateChairmanMessage(
  id: number,
  formData: FormData,
): Promise<SingleChairmanMessageResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/chairman-messages/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      updateTag("chairman-messages-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateChairmanMessage:", error);
      throw error;
    } else {
      throw new Error("Failed to update chairman message");
    }
  }
}

// =======================
// DELETE CHAIRMAN MESSAGE
// =======================

export async function deleteChairmanMessage(
  id: number,
): Promise<SingleChairmanMessageResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");
  try {
    const res = await fetch(`${API_BASE}/chairman-messages/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("chairman-messages-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteChairmanMessage:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to delete chairman message");
    }
  }
}
