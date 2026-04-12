// lib/permissions.ts
import { cache } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface PermissionResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
    };
    roles: string[];
    permissions: string[];
    total_permissions: number;
  };
}


export const fetchMyPermissions = cache(
  async (token: string): Promise<PermissionResponse | null> => {
    if (!token) throw new Error("Unauthorized: Access token not found");
    try {
    const res = await fetch(`${API_BASE}/my-permissions`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if(res.status === 401 || res.status === 403) {
      console.warn("No permission data found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data: PermissionResponse = await res.json();
    return data;
    } catch (error) {
      console.error("fetchMyPermissions Error:", error);
      throw error;
    }
  }
);
