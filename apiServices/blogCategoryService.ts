"use server";
import { cacheTag, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cacheTags";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface BlogCategory {
  id: number;
  title: string;
  image: string;
  status: number;
  meta_title: string;
  meta_description: string;
  meta_tag: string[];
  schema: string;
  slug: string;
}

export interface BlogCategoryResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_blog_categories: number;
    blog_categories: BlogCategory[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleBlogCategoryResponse {
  success: boolean;
  message: string;
  code: number;
  data: BlogCategory | null;
  errors?: Record<string, string[] | string>;
}

export async function createBlogCategory(
  formData: FormData,
): Promise<SingleBlogCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }
    const res = await fetch(`${API_BASE}/blog-categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const result = await res.json();
    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.BLOG_CATEGORIES);
    }
    return result;
  } catch (error: unknown) {
    console.error("Error creating blog category:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create blog category");
  }
}

export async function updateBlogCategory(
  id: number,
  formData: FormData,
): Promise<SingleBlogCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }
    const res = await fetch(`${API_BASE}/blog-categories/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();
    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.BLOG_CATEGORIES);
    }
    return result;
  } catch (error: unknown) {
    console.error("Error updating blog category:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update blog category");
  }
}


// Cached fetch for blog categories
export async function getBlogCategoriesCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<BlogCategoryResponse | null> {
  "use cache";
  cacheTag(CACHE_TAGS.BLOG_CATEGORIES);
  // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
  try {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        Object.prototype.hasOwnProperty.call(params, key)
      ) {
        urlParams.append(key, params[key].toString());
      }
    }

    const res = await fetch(`${API_BASE}/blog-categories?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    if (!res.ok) {
      console.error(`Blog categories fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("Error in getBlogCategoriesCached:", error instanceof Error ? error.message : error);
    return null;
  }
}

// Main function to get blog categories with session
export async function getBlogCategories(
  params: Record<string, unknown> = {}
): Promise<BlogCategoryResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session or access token found.");

  const result = await getBlogCategoriesCached(token, params);
  if (!result) throw new Error("Failed to fetch blog categories.");
  return result;
}


export async function getBlogCategoryById(
  id: string,
): Promise<SingleBlogCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }
    const res = await fetch(`${API_BASE}/blog-categories/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  } catch (error: unknown) {
    console.error("Error fetching blog category:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch blog category");
  }
}

export async function deleteBlogCategory(
  id: number,
): Promise<SingleBlogCategoryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }
    const res = await fetch(`${API_BASE}/blog-categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    if (res.ok && result?.success) {
      updateTag(CACHE_TAGS.BLOG_CATEGORIES);
    }
    return result;
  } catch (error) {
    console.error("Error deleting blog category:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete blog category",
    );
  }
}
