"use server";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// ======================= Start Public Image Gallery =======================

export interface ImageGallery {
  id: number;
  title: string;
  images?: string[];
  status: number;
  type: number;
}

export interface ImageGalleryData {
  total_image_galleries: number;
  image_galleries: ImageGallery[];
  pagination: PaginationType;
}

export interface ImageGalleryResponse {
  success: boolean;
  message: string;
  code: number;
  data: ImageGalleryData;
  errors?: Record<string, string[]>;
}

export async function getPublicImageGallery(
  params: Record<string, unknown> = {},
): Promise<ImageGalleryResponse | null> {
  try {
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (
        params.hasOwnProperty(key) &&
        params[key] !== undefined &&
        params[key] !== null
      ) {
        urlParams.append(key, params[key].toString());
      }
    }
    const queryString = urlParams.toString();

    const res = await fetch(
      `${API_BASE}/public/image-galleries?${queryString}`,
    );
    
    if (res.status === 404) {
      console.warn("No image galleries found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `Failed to fetch image gallery: ${res.statusText} (${res.status})`,
      );
    }

    const data: ImageGalleryResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getPublicImageGallery:", error);
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}
// ======================= End Public Image Gallery =======================
