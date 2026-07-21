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

export interface RoomBranch {
  id: number;
  name: string;
}

export interface Room {
  id: number;
  name: string;
  room_no: string;
  status: number;
  status_text: string;
  branch: RoomBranch;
}

export interface RoomsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_rooms: number;
    rooms: Room[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleRoomResponse {
  success: boolean;
  message: string;
  code: number;
  data: Room;
  errors?: Record<string, string[] | string>;
}

// =======================
// GET ROOMS (CACHED)
// =======================

export async function getRoomsCached(
  token: string,
  params: Record<string, unknown> = {},
): Promise<RoomsResponse | null> {
  "use cache";
  cacheTag("rooms-list");

  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(
      `${API_BASE}/inventory/rooms?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 404) {
      console.warn("No rooms found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found or invalid.");
      return null;
    }

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
      console.error("Service error:", "Error fetching rooms");
      return null;
    }
  }
}

// =======================
// GET ROOMS WRAPPER
// =======================

export async function getRooms(
  params: Record<string, unknown> = {},
): Promise<RoomsResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getRoomsCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE ROOM
// =======================

export async function getRoomById(
  id: number,
): Promise<SingleRoomResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/rooms/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 404) {
      console.warn(`No room found with ID ${id} (404).`);
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
    console.error("Error in getRoomById:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch room details");
    } else {
      throw new Error("Failed to fetch room details");
    }
  }
}

// =======================
// CREATE ROOM
// =======================

export async function createRoom(
  formData: FormData,
): Promise<SingleRoomResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/rooms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("rooms-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createRoom:", error);
      throw new Error(error.message || "Failed to create room");
    } else {
      throw new Error("Failed to create room");
    }
  }
}

// =======================
// UPDATE ROOM
// =======================

export async function updateRoom(
  id: number,
  formData: FormData,
): Promise<SingleRoomResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");
    if (!formData.has("_method")) {
      formData.append("_method", "PUT");
    }

    const res = await fetch(`${API_BASE}/inventory/rooms/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("rooms-list");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateRoom:", error);
      throw new Error(error.message || "Failed to update room");
    } else {
      throw new Error("Failed to update room");
    }
  }
}

// =======================
// DELETE ROOM
// =======================

export async function deleteRoom(id: number): Promise<SingleRoomResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/inventory/rooms/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("rooms-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteRoom:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete room");
    }
  }
}
