"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { CourseProject } from "./courseProjectsService";
import { Facility } from "./facilitiesService";
import { JoinType } from "./joinService";
import { Faq } from "./faqsService";
import { PaginationType } from "@/types/pagination";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface Batch {
  id: number;
  name: string;
  price: string;
  discount_price: string;
  duration: string;
  lecture: string;
  is_online: boolean;
  is_offline: boolean;
}

export interface Category { id: number; name: string };
export interface Branch { id: number; name: string };

export interface Course {
  id: number;
  category_id: number;
  title: string;
  sub_title: string;
  slug: string;
  short_description: string;
  description: string;
  featured_image: string;
  certificate_image: string;
  video_link?: string;
  level: string;
  end_date: string;
  status: string;
  is_default: number;
  total_enrolled: number;
  status_text: string;
  category: Category;
  branches: Branch[];
  organization: { name: string };
  batches: Batch[];
  course_projects?: CourseProject[];
  branch_count: number;
  language: string;
  price: number;
  discount: number;
  discount_type: string;
  after_discount: number;
  ratings: number;
  total_seats: number;
  total_live_class: number | null;
  total_prerecorded_video: number | null;
  about_support: string;
  course_type: string;
  is_collaboration: number;
  latest_batch?: { name: string } | null;
  facilities?: Facility[];
  joins?: JoinType[];
  faqs?: Faq[];
  meta_title: string;
  meta_description: string;
  meta_tag: string;
  schema: string;
}

export interface CourseResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    courses: Course[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface CourseSingleResponse {
  success: boolean;
  message: string;
  code: number;
  data: Course;
  errors?: Record<string, string[] | string>;
}

export interface CourseLearning {
  id: number;
  course_id: number;
  title: string;
  status: number;
}

export interface CourseLearningResponseData {
  id: number;
  title: string;
  status: number;
  course_id: number;
  course_learnings?: CourseLearning[];
}

export interface CourseLearningResponse {
  success: boolean;
  message: string;
  code: number;
  data?: {
    course_learnings: CourseLearningResponseData[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[] | string>;
}

export interface CourseTool {
  id: number;
  course_id: number;
  title: string;
  sub_title: string;
  image?: string | null;
  status: number;
}

export interface CourseToolResponse {
  success: boolean;
  message: string;
  code: number;
  data?: {
    total_tools?: number;
    course_tools: CourseTool[];
    pagination?: PaginationType;
  };
  errors?: Record<string, string[] | string>;
}

export interface AssignedFaqsResponse {
  success: boolean;
  message: string;
  code: number;
  data: Faq[];
  errors?: Record<string, string[] | string>;
}


export interface AssignedFacilitiesResponse {
  success: boolean;
  message: string;
  code: number;
  data: Facility[];
  errors?: Record<string, string[] | string>;
}
export interface AssignedJoinsResponse {
  success: boolean;
  message: string;
  code: number;
  data: JoinType[];
  errors?: Record<string, string[] | string>;
}

export interface AssignedToolsResponse {
  success: boolean;
  message: string;
  code: number;
  data: CourseTool[];
  errors?: Record<string, string[] | string>;
}

export interface Lesson {
  id?: number | null;
  title: string;
  description: string | null;
  duration: number;
  type: string | number;
  type_name?: string;
  video_url: string;
  order: number;
  is_preview: number;
  status: number;
  schedule_at: string | null;
}

export interface Chapter {
  id?: number;
  title: string;
  description: string;
  status: string | number;
  lessons: Lesson[];
  lessons_count?: number;
}

export interface FormValues {
  course_id: number;
  chapters: Chapter[];
}

export interface ChapterLessonResponse {
  success: boolean;
  message: string;
  code: number;
  data?: Chapter[];
  errors?: Record<string, string[] | string>;
}

async function getCoursesCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<CourseResponse | null> {
  "use cache";
  cacheTag("courses-list");
  try {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    const res = await fetch(`${API_BASE}/courses?${urlParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch courses: ${res.statusText}`);
    }

    return res.json();
  } catch (error: unknown) {
    console.error("Error in getCoursesCached:", error);
    if (error instanceof Error) {
      console.error("Cache error:", error.message);

      return null;
    } else {
      console.error("Cache error:", "Failed to fetch courses");

      return null;
    }
  }
}

// =======================
// Get Courses (Paginated)
// =======================
export async function getCourses(params: Record<string, unknown> = {}): Promise<CourseResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) throw new Error("No valid session or access token found.");

  const _cachedResult = await getCoursesCached(token, params);


  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");


  return _cachedResult;
}

// =======================
//  Create Course
// =======================
export async function createCourse(formData: FormData): Promise<CourseSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/courses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!result.success && !result.errors) {
      throw new Error(result.message || "Failed to create course");
    }

    updateTag("courses-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in createCourse:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create course.");
    }
  }
}

// =======================
//  Get Course by ID
// =======================
export async function getCourseById(id: string): Promise<CourseSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/courses/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to get course");
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in getCourseById:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to get course.");
    }

  }
}

// =======================
// Update Course
// =======================
export async function updateCourse(id: number, formData: FormData): Promise<CourseSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    formData.append("_method", "PUT");

    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!result.success && !result.errors) {
      throw new Error(result.message || "Failed to update course");
    }

    updateTag("courses-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in updateCourse:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to update course.");
    }
  }
}

// =======================
// Delete Course
// =======================
export async function DeleteCourse(id: number): Promise<CourseSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete course");
    }

    updateTag("courses-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in DeleteCourse:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to delete course.");
    }
  }
}

// =======================
// Assign Branches to Course
// =======================
export async function assignBranchesToCourse(
  courseId: string,
  branchIds: number[]
): Promise<CourseSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/courses/${courseId}/branches`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ branch_ids: branchIds }),
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to assign branches");
    }

    updateTag("courses-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in assignBranchesToCourse:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to assign branches.");
    }
  }
}

// =======================
//  Create Chapters with Lessons
// =======================
export async function createChaptersWithLessons(
  chaptersData: FormValues
): Promise<ChapterLessonResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/chapter-lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(chaptersData),
    });

    const result = await res.json();
    return result;
  } catch (error: unknown) {
    console.error("Error in createChaptersWithLessons:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create chapters.");
    }
  }
}

// =======================
//  Update Chapters with Lessons
// =======================
export async function updateChaptersWithLessons(
  chaptersData: FormValues
): Promise<ChapterLessonResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/chapter-lessons/bulk-update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(chaptersData),
    });

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("Error in updateChaptersWithLessons:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to update chapters.");
    }
  }
}


// =======================
//  Assign FAQs to Course
// =======================
export async function assignFaqsToCourse(
  courseId: string | number,
  faqIds: number[]
): Promise<CourseSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const response = await fetch(`${API_BASE}/courses/${courseId}/faqs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ faq_ids: faqIds }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to assign FAQs");
    }

    updateTag("courses-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in assignFaqsToCourse:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to assign FAQs.");
    }
  }
}


// =======================
// Assign Facilities to Course
// =======================
export async function assignFacilitiesToCourse(
  courseId: string | number,
  facilityIds: number[]
): Promise<CourseSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const response = await fetch(
      `${API_BASE}/courses/${courseId}/facilities`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ facility_ids: facilityIds }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to assign facilities");
    }

    updateTag("courses-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in assignFacilitiesToCourse:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to assign facilities.");
    }
  }
}




// =======================
// Create Course Learnings
// =======================
export interface CourseLearningInput {
  id?: number;
  title: string;
  status: number;
}

export async function createCourseLearningsFormData(
  courseId: number,
  learnings: CourseLearningInput[]
): Promise<CourseLearningResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const requestBody = {
      course_id: courseId,
      course_learnings: learnings,
    };

    const url = `${API_BASE}/course-learnings/bulk`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create course learnings");
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in createCourseLearningsFormData:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create course learnings.");
    }
  }
}
// =======================
//  GET Course Learnings (for edit mode)
// =======================
export async function getCourseLearnings(
  courseId: number
): Promise<CourseLearningResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/course-learnings?course_id=${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch course learnings");
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in getCourseLearnings:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch course learnings.");
    }
  }
}

// =======================
// bulk Update Course Learnings
// =======================
export async function editCourseLearnings(
  courseId: number,
  learnings: CourseLearningInput[]
): Promise<CourseLearningResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/course-learnings/bulk-update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course_id: courseId, course_learnings: learnings }),
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to edit course learnings");
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in editCourseLearnings:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to edit course learnings.");
    }
  }
}
// =======================
//  GET Chapters by Course ID (for edit mode)
// =======================
export async function getChaptersByCourseId(
  courseId: number
): Promise<ChapterLessonResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/chapter-lessons/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch chapters");
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in getChaptersByCourseId:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch chapters.");
    }
  }
}
// =======================
//  GET Course FAQs (for edit mode)
// =======================
export async function getCourseFaqs(
  courseId: number
): Promise<AssignedFaqsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/courses/${courseId}/faqs`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch FAQs");
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in getCourseFaqs:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch FAQs.");
    }
  }
}
// =======================
// GET Course Facilities (for edit mode)
// =======================
export async function getCourseFacilities(
  courseId: number
): Promise<AssignedFacilitiesResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/courses/${courseId}/facilities`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch facilities");
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in getCourseFacilities:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch facilities.");
    }
  }
}
// =======================
// Assign Joins to Course
// =======================
export async function assignJoinsToCourse(
  courseId: string | number,
  joinIds: number[]
): Promise<CourseSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const response = await fetch(
      `${API_BASE}/courses/${courseId}/joins`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ join_ids: joinIds }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to assign joins");
    }

    updateTag("courses-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in assignJoinsToCourse:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to assign joins.");
    }
  }
}

// =======================
// GET Course Joins (for edit mode)
// =======================
export async function getCourseJoins(
  courseId: number
): Promise<AssignedJoinsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/courses/${courseId}/joins`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch joins");
    }

    return result;
  } catch (error: unknown) {
    console.error("Error in getCourseJoins:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch joins.");
    }
  }
}

// =======================
// Assign Tools to Course
// =======================
export async function assignToolsToCourse(
  courseId: number,
  toolIds: number[]
): Promise<CourseSingleResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const response = await fetch(
      `${API_BASE}/courses/${courseId}/tools/sync`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tool_ids: toolIds }),
      }
    );



    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to assign tools");
    }

    updateTag("courses-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in assignToolsToCourse:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to assign tools.");
    }
  }
}

// =======================
// GET Course Assigned Tools (for edit mode)
// =======================
export async function getCourseAssignedTools(
  courseId: number
): Promise<AssignedToolsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No valid session or access token found.");
    }

    const res = await fetch(`${API_BASE}/courses/${courseId}/tools`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();

    return result;
  } catch (error: unknown) {
    console.error("Error in getCourseAssignedTools:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch course tools.");
    }
  }
}

// =======================
// Get ALL Public Courses
// =======================
export async function getPublicCoursesAll(): Promise<CourseResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/courses/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch all public courses: ${res.statusText}`);
    }
    return res.json();
  } catch (error: unknown) {
    console.error("Error in getPublicCoursesAll:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch all public courses");
    }
  }
}
