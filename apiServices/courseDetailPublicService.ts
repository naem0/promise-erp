"use server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag } from "next/cache";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// --- Interfaces matching actual API response ---
export interface Category {
  id: number;
  name: string;
}

export interface Branch {
  id: number;
  name: string;
}

export interface Batch {
  id: number;
  price: number;
  discount: number;
  discount_type: "percentage" | "fixed" | null;
  after_discount: number;
  is_online: boolean;
  is_offline: boolean;
  start_date: string;
  end_date: string;
  duration: string;
  discount_percentage?: number;
}

export interface CourseFacility {
  id: number;
  title: string;
  image: string | null;
}

export interface CourseTool {
  id: number;
  title: string;
  sub_title: string;
  image: string | null;
}

export interface CourseLearning {
  id: number;
  title: string;
}

export interface Chapter {
  id: number;
  description?: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  description?: string;
}

export interface CourseInstructor {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
  designation: string;
  experience: string;
  instructors_tools: CourseTool[];
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface ReviewUser {
  id: number;
  name: string;
  profile_image: string | null;
}

export interface Review {
  id: number;
  rating: number;
  feedback: string;
  user: ReviewUser;
}
export interface CourseJoin {
  id: number;
  title: string;
}

export interface CourseDetail {
  id: number;
  category_id: number;
  title: string;
  sub_title: string;
  short_description: string;
  slug: string;
  level: string;
  about_support: string;
  total_certified?: number;
  description: string;
  featured_image?: string;
  video_link?: string;
  status?: string;
  is_default?: boolean;
  total_enrolled?: number;
  ratings?: number;
  total_seats?: number | null;
  total_live_class?: number | null;
  course_type: "free" | "govt" | "paid" | null;
  is_collaboration: boolean;
  category: Category;
  total_prerecorded_video: number;
  branch_count: number;
  branches: Branch[];
  batch: Batch;
  course_facilities: CourseFacility[];
  course_tools: CourseTool[];
  course_learnings: CourseLearning[];
  faqs: FAQ[];
  chapters: Chapter[];
  course_instructors: CourseInstructor[];
  reviews: Review[];
  course_joins: CourseJoin[];
  certificate_image: string | null;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: CourseDetail;
}

export async function getCourseDetailBySlug(
  slug: string,
  branchId?: number,
): Promise<ApiResponse | null> {
  "use cache";
  cacheTag("course-detail");

  try {
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
   const urlParams = new URLSearchParams();

    if (branchId) {
      urlParams.append("branch_id", String(branchId));
    }
    const res = await fetch(`${API_BASE}/public/courses/${slug}?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("No course found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch course details: ${res.statusText}`);
    }

    const data: ApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getCourseDetailBySlug:", error);
      console.error("Service error:", "Error fetching course details");
      return null;
    } else {
      console.error("Service error:", "Error fetching course details");
      return null;
    }
  }
}

// Start get enrollment details
export interface CheckBatchEnrollmentResponse {
  success: boolean;
  message: string;
  code: number;
  data?: {
    is_enrolled: boolean;
  };
}
export async function checkBatchEnrollment(
  batchId: number
): Promise<CheckBatchEnrollmentResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");
    const res = await fetch(
      `${API_BASE}/public/check-batch-enrollment?batch_id=${batchId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data: CheckBatchEnrollmentResponse = await res.json();

    // API may return success=false with 200/500
    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Failed to check batch enrollment");
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in checkBatchEnrollment:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Error checking batch enrollment");
    }
  }
}
