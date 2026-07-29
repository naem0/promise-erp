import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
export interface BannerSectionItem {
  id: number;
  title: string;
  sub_title: string;
  type?: string;
  description?: string;
  image?: string;
  video_link?: string;
  button_text_one?: string;
  button_link_one?: string;
  button_text_two?: string;
  button_link_two?: string;
  status?: number; // 1 = active, 0 = inactive
}
export interface BannerSectionData {
  total_sections: number;
  sections: BannerSectionItem[];
  pagination: PaginationType;
}
export interface BannerSectionApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: BannerSectionData;
  errors?: Record<string, string[]>;
}
export async function fetchCommonBannerSectionData(
  params: Record<string, unknown> = {},
): Promise<BannerSectionApiResponse | null> {
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        Object.prototype.hasOwnProperty.call(params, key)
      ) {
        urlParams.append(key, String(params[key]));
      }
    }
    const queryString = urlParams.toString();

    const res = await fetch(`${API_BASE}/public/sections?${queryString}`);

    if (res.status === 404) {
      console.warn("No banner section data found.");
      return null;
    }
    if (res.status === 401) {
      console.warn("Unauthorized access to banner section data (401).");
      return null;
    }
    if (res.status === 403) {
      console.warn("Forbidden access to banner section data (403).");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `Banner section API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: BannerSectionApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    if (error instanceof Error) {
      console.error(" Banner Section Fetch Error:", error.message);
    } else {
      console.error(" Banner Section Fetch Error: Unknown error");
    }
    return null;
  }
}
