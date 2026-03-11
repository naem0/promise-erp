
import { PaginationType } from "@/types/pagination";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// --- Interfaces ---
export interface Category {
  id: number;
  name: string;
}
export interface Branch {
  id: number;
  name: string;
}
export interface Batch {
  price: number;
  discount: number;
  discount_type?: "percentage" | "fixed" | null;
  after_discount?: number;
  is_online?: boolean | null;
  is_offline?: boolean | null;
  start_date?: string | null;
  end_date?: string | null;
  duration?: string | null;
}
export interface Course {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  featured_image: string;
  status?: string;
  is_default: boolean;
  total_enrolled?: number;
  ratings: number;
  total_seats?: number | null;
  total_live_class?: number | null;
  course_type?: "free" | "govt" | "paid" | null;
  is_collaboration?: boolean;
  category?: Category;
  branch_count?: number;
  branches?: Branch[];
  batch?: Batch;
}
export interface CourseTypeFilter {
  id: number;
  name: string;
}
export interface LevelFilter {
  id: string;
  name: string;
}
export interface BudgetScaleFilter {
  id: string;
  label: string;
}
export interface PriceRange {
  min: number;
  max: number;
}
export interface CourseTracks {
  id: number;
  name: string;
}
export interface Filters {
  search?: string;
  course_types?: CourseTypeFilter[];
  categories?: Category[];
  price_range?: PriceRange;
  levels?: LevelFilter[];
  budget_scale?: BudgetScaleFilter[];
  course_track?: CourseTracks[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    section_title?: string | null;
    section_subtitle?: string | null;
    courses: Course[];
    filters: Filters;
    pagination: PaginationType;
  };
}
export interface GetPublicCoursesParams {
  params?: Record<string, unknown>;
}

export async function getPublicCoursesList(
  params: Record<string, unknown> = {},
): Promise<ApiResponse> {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlParams.append(key, String(value));
    }
  });

  const queryString = urlParams.toString();
  try {
    const res = await fetch(`${API_BASE}/public/courses?${queryString}`, {
      headers: { "Content-Type": "application/json" },
    });

    const data: ApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getPublicCoursesList Error:", error.message);
      throw error;
    }
    throw new Error("An unexpected error occurred.");
  }
}
