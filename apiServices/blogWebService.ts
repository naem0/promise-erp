"use server";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
import { authOptions } from "@/lib/auth";
import { PaginationType } from "@/types/pagination";
import { getServerSession } from "next-auth";

// ******* Start Blog Info API *******
export interface BlogInfoCategory {
  id: number;
  title: string;
}
export interface BlogAuthor {
  id: number;
  name: string;
  image?: string;
  designation?: string;
}

export interface BlogInfo {
  id: number;
  category: BlogInfoCategory;
  title: string;
  short_description?: string;
  slug: string;
  author?: BlogAuthor;
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
}): Promise<BlogInfoApiResponse | null> {
  try {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    const queryString = urlParams.toString();

    const res = await fetch(`${API_BASE}/public/blogs?${queryString}`);

    if(res.status === 404) {
      console.warn("No blogs found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `fetchPublicBlogInfo API error: ${res.status} ${res.statusText}`,
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

export async function getPublicBlogCategories(): Promise<BlogCategoryApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/public/blog-categories`);

    if (!res.ok) {
      throw new Error(
        `fetchPublicBlogCategories API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: BlogCategoryApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }

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
  author?: BlogAuthor;
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
  slug: string,
): Promise<BlogSlugDetailsApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/blogs/${slug}`);

    if (!res.ok) {
      throw new Error(
        `getPublicBlogBySlug API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: BlogSlugDetailsApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching blog details:", error.message);
      throw new Error(error.message);
    }

    throw new Error("Unknown error occurred while fetching blog details.");
  }
}
// ******* End get Public Blog By Slug API *******

// ******* Start get Public Blog Category Slug API *******

export async function getPublicBlogsByCategorySlug({
  slug,
  params = {},
}: {
  slug: string;
  params?: Record<string, unknown>;
}): Promise<BlogInfoApiResponse | null> {
  try {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    const queryString = urlParams.toString();

    const res = await fetch(
      `${API_BASE}/public/blogs/category/${slug}?${queryString}`,
    );

    if(res.status === 404) {
      console.warn("No blogs found.");
      return null;
    }
    if (!res.ok) {
      throw new Error(
        `getPublicBlogsByCategorySlug API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: BlogInfoApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching blogs by category:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching blogs by category.");
  }
}
// ******* End get Public Blog Category Slug API *******

// ******* Start get Public getBlogDetailLikeCount API *******

export interface BlogLikesData {
  blog_id: number;
  likes_count: number;
}

export interface BlogLikesApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: BlogLikesData;
}
export async function getBlogDetailLikeCount(
  blogId: number,
): Promise<BlogLikesApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/blogs/${blogId}/likes-count`);

    if (!res.ok) {
      throw new Error(
        `getBlogDetailLikeCount API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: BlogLikesApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching blog likes:", error.message);
      throw new Error(error.message);
    }

    throw new Error("Unknown error occurred while fetching blog likes.");
  }
}
// ******* End get Public getBlogDetailLikeCount API *******

// ******* Start toggle Blog Detail Likes API *******

export interface ToggleLikeResponseData {
  is_liked: boolean;
  likes_count: number;
}

export interface ToggleLikeApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: ToggleLikeResponseData;
  errors?: Record<string, string[]>;
}

export async function toggleBlogDetailLikes(
  blogId: number,
): Promise<ToggleLikeApiResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }
    const res = await fetch(`${API_BASE}/blogs/${blogId}/toggle-like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: ToggleLikeApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error toggling blog like:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while toggling blog like.");
  }
}
// ******* End toggle Blog Detail Likes API *******
