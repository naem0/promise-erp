"use server"
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
import { PaginationType } from "@/types/pagination";

// ******* Start Blog Info API *******
export interface BlogInfoCategory {
  id: number;
  title: string;
}

export interface BlogInfo {
  id: number;
  category: BlogInfoCategory;
  title: string;
  short_description?: string;
  slug: string;
  author?: string;
  thumbnail?: string;
  published_at: string;
  status?: number;
}
export interface BlogInfoData {
  section_title: string;
  section_subtitle: string;
  total_blogs: number;
  blogs: BlogInfo[];
  pagination: PaginationType;
}

export interface BlogInfoApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: BlogInfoData;
  errors?: Record<string, string[]>;
}

export async function getPublicBlogInfo({
  params = {},
}: {
  params?: Record<string, unknown>;
}): Promise<BlogInfoApiResponse> {
  try {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    const queryString = urlParams.toString();

    const res = await fetch(`${API_BASE}/public/blogs?${queryString}`);

    if (!res.ok) {
      throw new Error(
        `fetchPublicBlogInfo API error: ${res.status} ${res.statusText}`
      );
    }

    const data: BlogInfoApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching blog info:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching blog info.");
  }
}
// ******* End Blog Info API *******

// ******* Start Blog Category API *******
export interface BlogCategory {
  id: number;
  title: string;
  slug?: string;
  image?: string | null;
  status?: number;
  blog_count?: string; 
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

export interface BlogCategoryData {
  total_blog_categories: number;
  total_blog_count: number;
  blog_categories: BlogCategory[];
  pagination?: PaginationType;
}

export interface BlogCategoryApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: BlogCategoryData;
  errors?: Record<string, string[]>;
}

export async function getPublicBlogCategories(): Promise<BlogCategoryApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/blog-categories`);

    if (!res.ok) {
      throw new Error(
        `fetchPublicBlogCategories API error: ${res.status} ${res.statusText}`
      );
    }

    const data: BlogCategoryApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching blog categories:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching blog categories.");
  }
}
// ******* End Blog Category API *******


// ******* Start get Public Blog By Slug API *******

export interface BlogSlugDetailsApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: BlogSlugDetails;
}

export interface BlogSlugDetails {
  id: number;
  category: {
    id: number;
    title: string;
    slug: string;
  };
  title: string;
  slug: string;
  author: string;
  short_description: string;
  description: string;
  thumbnail?: string;
  status: number;
  published_at: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
}


export async function getPublicBlogBySlug(
  slug: string
): Promise<BlogSlugDetailsApiResponse> {
  try {
    const res = await fetch(
      `${API_BASE}/public/blogs/${slug}`
    );

    if (!res.ok) {
      throw new Error(
        `getPublicBlogBySlug API error: ${res.status} ${res.statusText}`
      );
    }

    const data: BlogSlugDetailsApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching blog details:", error.message);
      throw new Error(error.message);
    }

    throw new Error(
      "Unknown error occurred while fetching blog details."
    );
  }
}
// ******* End get Public Blog By Slug API *******

