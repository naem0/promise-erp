// "use server";

// import { authOptions } from "@/lib/auth";
// import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"; 

// ======================= Start Public Job Circular Api Service =======================

export interface JobCircularCategory {
  id: number;
  name: string;
}

export interface JobCircularBranch {
  id: number;
  name: string;
}

export interface JobCircularItem {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  salary?: string;
  deadline?: string;
  image?: string;
  job_type: number;
  job_type_label: string;
  location: string;
  status: number;
  career_category: JobCircularCategory;
  branch: JobCircularBranch;
}

export interface JobCircularData {
  total_careers: number;
  careers: JobCircularItem[];
  pagination: PaginationType;
}

export interface JobCircularApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: JobCircularData;
  errors?: Record<string, string[]>;
}

export async function getPublicJobCircular(
  params: Record<string, unknown> = {},
): Promise<JobCircularApiResponse | null> {
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

    const res = await fetch(`${API_BASE}/public/careers?${queryString}`);

    if (res.status === 404) {
      console.error("Error in getPublicJobCircular:", res);
      return null
    }
    if (!res.ok) {
      throw new Error(
        `Failed to fetch job circular: ${res.statusText} (${res.status})`,
      );
    }

    const data: JobCircularApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getPublicJobCircular:", error);
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred in getPublicJobCircular.");
    }
  }
}
// ======================= End Public Job Circular Api Service =======================

// ================== Start Public Job Circular by slug Api Service ===============
export interface JobCircularTool {
  id: number;
  title: string;
}
export interface JobCircularDetails {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  short_description: string;
  description: string;
  salary?: string;
  deadline?: string;
  image?: string;
  job_type: number;
  job_type_label: string;
  location: string;
  status: number;
  meta_title?: string;
  meta_description?: string;
  meta_tag: string[];
  schema?: string;
  career_category: JobCircularCategory;
  branch: JobCircularBranch;
  tools: JobCircularTool[];
}

export interface JobCircularDetailsApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: JobCircularDetails;
  errors?: Record<string, string[]>;
}

export async function getPublicJobCircularBySlug(
  slug: string,
): Promise<JobCircularDetailsApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/public/careers/${slug}`);

    if (res.status === 404) {
      console.warn("No job circular found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `Failed to fetch job circular by slug: ${res.statusText} (${res.status})`,
      );
    }

    const data: JobCircularDetailsApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getPublicJobCircularBySlug:", error);
      throw new Error(error.message);
    } else {
      throw new Error(
        "An unexpected error occurred in getPublicJobCircularBySlug.",
      );
    }
  }
}
// ================== End Public Job Circular by slug Api Service ===============

// ================== Start Apply Job Circular Api Service ===============
// Interface for the Career object
export interface ApplyCareerJob {
  id: number;
  title: string;
  salary?: string;
}
export interface ApplyJobApplicationData {
  id: number;
  career: ApplyCareerJob;
  name: string;
  email: string;
  phone: string;
  address?: string;
  resume: string;
  cover_letter?: string;
  status: number;
  status_label: string;
  created_at: string;
}
export interface ApplyJobApplicationResponse {
  success: boolean;
  message: string;
  code: number;
  data: ApplyJobApplicationData;
  errors?: Record<string, string[]>;
}

export async function applyJobApplicationForWeb(
  formData: FormData
): Promise<ApplyJobApplicationResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/job-applies`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("Full error:", error);
    if (error instanceof Error) {
      console.log("Error in applyJobApplicationForWeb:===>", error);
      throw new Error(error.message);
    } else {
      throw new Error("Failed to applyJobApplicationForWeb");
    }
  }
}
// ================== End Apply Job Circular Api Service ===============
