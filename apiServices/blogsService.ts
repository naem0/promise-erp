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

export interface BlogCategory {
    id: number;
    title: string;
    slug: string;
}

export interface BlogAuthor {
    id: number;
    name: string;
    image?: string;
    designation?: string;
}

export interface Blog {
    id: number;
    category: BlogCategory;
    title: string;
    slug: string;
    author: string;
    short_description: string;
    description: string;
    thumbnail?: string ;
    status: number;
    published_at?: string ;
    meta_title?: string;
    meta_description?: string;
    meta_tag: string[];
    schema?: string;
    schedule?: string;
}

export interface BlogsResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        total_blogs: number;
        blogs: Blog[];
        pagination: PaginationType;
    };
    errors?: Record<string, string[]>;
}

export interface SingleBlogResponse {
    success: boolean;
    message: string;
    code: number;
    data: Blog;
    errors?: Record<string, string[] | string>;
}

// =======================
// GET BLOGS (CACHED)
// =======================

export async function getBlogsCached(
    token: string,
    params: Record<string, unknown> = {}
): Promise<BlogsResponse | null> {
    "use cache";
    cacheTag("blogs-list");

    // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    try {
        const urlParams = new URLSearchParams();
        for (const key in params) {
            if (params[key] !== undefined && params[key] !== null) {
                urlParams.append(key, String(params[key]));
            }
        }

        const res = await fetch(
            `${API_BASE}/blogs?${urlParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!res.ok) {
            console.error(`Blogs fetch failed: ${res.status} ${res.statusText}`);
            return null;
        }

        return await res.json();
    } catch (error: unknown) {
        console.error("Error in getBlogsCached:", error instanceof Error ? error.message : error);
        return null;
    }
}

export async function getBlogs(
    params: Record<string, unknown> = {}
): Promise<BlogsResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const result = await getBlogsCached(token, params);
    if (!result) throw new Error("Failed to fetch blogs.");
    return result;
}

// =======================
// GET SINGLE BLOG
// =======================

export async function getBlogById(id: number): Promise<SingleBlogResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/blogs/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`Status: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        return result;
    } catch (error: unknown) {
        console.error("Error in getBlogById:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to fetch blog");
        } else {
            throw new Error("Failed to fetch blog");
        }
    }
}

// =======================
// CREATE BLOG
// =======================

export async function createBlog(
    formData: FormData
): Promise<SingleBlogResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/blogs`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await res.json();

        if (res.ok && result?.success) {
          updateTag("blogs-list");
        }
        return result;
    } catch (error: unknown) {
        console.error("Error in createBlog:", error);
        if (error instanceof Error) {
            console.error("Error in createBlog:", error);
            throw new Error(error.message || "Failed to create blog");
        } else {
            throw new Error("Failed to create blog");
        }
    }
}

// =======================
// UPDATE BLOG
// =======================

export async function updateBlog(
    id: number,
    formData: FormData
): Promise<SingleBlogResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/blogs/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await res.json();

        if (res.ok && result?.success) {
          updateTag("blogs-list");
        }
        return result;
    } catch (error: unknown) {
        console.error("Error in updateBlog:", error);
        if (error instanceof Error) {
            console.error("Error in updateBlog:", error);
            throw new Error(error.message || "Failed to update blog");
        } else {
            throw new Error("Failed to update blog");
        }
    }
}

// =======================
// DELETE BLOG
// =======================

export async function deleteBlog(id: number): Promise<SingleBlogResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            throw new Error("No valid session/token");
        }

        const res = await fetch(`${API_BASE}/blogs/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        if (res.ok && result?.success) {
          updateTag("blogs-list");
        }
        return result;
    } catch (error: unknown) {
        console.error("Error in deleteBlog:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Failed to delete blog");
        }
    }
}
