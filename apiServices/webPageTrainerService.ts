"use server";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
import { PaginationType } from "@/types/pagination";
// ******* Start Teachers List API *******
export interface TeacherList {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  experience: string;
  profile_image?: string;
  courses: string;
  note: string;
  branch_id: number;
}

export interface TeacherListData {
  section_title: string;
  section_subtitle: string;
  total_teachers: number;
  teachers: TeacherList[];
  pagination: PaginationType;
}

export interface TeacherListApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: TeacherListData;
  errors?: Record<string, string[]>;
}

export async function getPublicTeachersList({
  params = {},
}: {
  params?: Record<string, unknown>;
}): Promise<TeacherListApiResponse> {
  try {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    const queryString = urlParams.toString();

    const res = await fetch(`${API_BASE}/public/teachers-list?${queryString}`);

    if (!res.ok) {
      throw new Error(
        `getPublicTeachersList API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: TeacherListApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching teachers list:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching teachers list.");
  }
}
// ******* End Teachers List API *******
