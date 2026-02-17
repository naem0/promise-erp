// apiServices/studentDashboardService.ts
// "use server";
import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";
import { authOptions } from "@/lib/auth";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface StDashboardCards {
  total_enrolled_courses: number;
  running_courses: number;
  completed_courses: number;
  total_due_payment: number;
  due_in_courses: number;
  this_month_earning_bdt: number;
  this_month_earning_usd: number;
  earning_percentage: number;
  earning_change: "increase" | "decrease";
}
export interface StClassAttendance {
  course_title: string;
  classes_attended: number;
  total_classes: number;
  classes_completed: number;
  attendance_percentage: number;
  completion_percentage: number;
}
export interface StUpcomingClass {
  course_title: string;
  lesson_title: string;
  batch_name: string;
  schedule_date: string; // ISO date
  schedule_time: string;
  venue: string;
}
export interface StDuePaymentItem {
  course_title: string;
  amount: number;
  due_date: string;
}

export interface StDuePayments {
  total_due: number;
  payments: StDuePaymentItem[];
}
export interface StudentDashboardData {
  cards: StDashboardCards;
  class_attendance: StClassAttendance[];
  upcoming_classes: StUpcomingClass[];
  due_payments: StDuePayments;
}
export interface StudentDashboardResponse {
  success: boolean;
  message: string;
  code: number;
  data: StudentDashboardData;
  errors?: Record<string, string[]>;
}

// get student dashboard
export async function getStudentDashboard(
  accessToken: string,
): Promise<StudentDashboardResponse> {
  try {
    const res = await fetch(`${API_BASE}/student-dashboard`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch student dashboard ${res.status} (${res.statusText}`,
      );
    }

    const data: StudentDashboardResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Student Dashboard API Error:", error.message);
      throw new Error("Error fetching student dashboard");
    }
    throw new Error("Unknown error occurred while fetching student dashboard");
  }
}
//End Student Dashboard

// Start Free Seminars
export interface FreeSeminar {
  id: number;
  title: string;
  slug: string;
  seminar_type: number; // 0 | 1
  seminar_date: string; // YYYY-MM-DD
  seminar_time: string; // HH:mm:ss
  seminar_time_formatted?: string; // HH:mm
  image?: string | null;
}

export interface FreeSeminarsData {
  total_free_seminars: number;
  free_seminars: FreeSeminar[];
  pagination: PaginationType;
}

export interface FreeSeminarsApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: FreeSeminarsData;
}

// Get Free Seminars
export async function getFreeSeminars({
  params = {},
}: {
  params?: Record<string, unknown>;
}): Promise<FreeSeminarsApiResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("Unauthorized: Access token not found");
    }

    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    const queryString = urlParams.toString();
    const res = await fetch(
      `${API_BASE}/student-panel/free-seminars?${queryString}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(
        `get FreeSeminars API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: FreeSeminarsApiResponse = await res.json();

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("fetchFreeSeminars Error:", error.message);
      throw error;
    }

    throw new Error("Unknown error occurred while fetching free seminars");
  }
}
// End Free Seminars

// Start get Upcoming Courses
export interface CourseBatch {
  id: number;
  name: string;
  price: number;
  start_date: string; // YYYY-MM-DD
  days_to_go: number;
  available_seats: number;
}
export interface UpcomingCourse {
  id: number;
  title: string;
  slug: string;
  featured_image: string | null;
  ratings: number;
  batch: CourseBatch;
}
export interface CourseCategory {
  id: number;
  name: string;
  slug: string;
  image: string | null;
}
export interface UpcomingCoursesData {
  categories: CourseCategory[];
  courses: UpcomingCourse[];
  pagination: PaginationType;
}
export interface UpcomingCoursesApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: UpcomingCoursesData;
}

export async function getUpcomingCourses({
  params = {},
}: {
  params?: Record<string, unknown>;
}): Promise<UpcomingCoursesApiResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlParams.append(key, String(value));
    }
  });
  const queryString = urlParams.toString();
  try {
    const res = await fetch(
      `${API_BASE}/student-panel/upcoming-courses?${queryString}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(
        `UpcomingCourses API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: UpcomingCoursesApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getUpcomingCourses Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while fetching upcoming courses");
  }
}

// End get Upcoming Courses

// Start get Earning State
export type EarningChangeType = "increase" | "decrease";
export interface EarningCards {
  total_usd_earning: number;
  usd_earning_change: EarningChangeType;
  usd_earning_percentage: number;

  total_bdt_earning: number;
  bdt_earning_change: EarningChangeType;
  bdt_earning_percentage: number;

  this_month_earning_usd: number;
  this_month_earning_bdt: number;
  earning_percentage: number;
}
export interface StEarningStateResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    earning_cards: EarningCards;
  };
}

export async function getStudentEarningState(): Promise<StEarningStateResponse> {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error("Unauthorized: No access token found");
  }
  try {
    const res = await fetch(`${API_BASE}/student-earnings/earning-cards`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch earning cards ${res.status} (${res.statusText})`,
      );
    }

    const data: StEarningStateResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getUpcomingCourses Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while fetching upcoming courses");
  }
}

// End get Earning State

// Start get Earning Usd Charts

export interface EarningsChartItem {
  month: string;
  earning: number;
}

export interface EarningsChartData {
  currency: "USD" | "BDT";
  total: number;
  chart_data: EarningsChartItem[];
}

export interface EarningsChartApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: EarningsChartData;
}

export async function getStudentEarningUsdChart(
  accessToken: string,
): Promise<EarningsChartApiResponse> {
  if (!accessToken) {
    throw new Error("Unauthorized: No access token found");
  }
  try {
    const res = await fetch(`${API_BASE}/student-earnings/usd-chart`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch USD chart ${res.status} (${res.statusText})`,
      );
    }

    const data: EarningsChartApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getUpcomingCourses Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while fetching upcoming courses");
  }
}
// End get Earning Usd Charts

// Start get Earning Bdt Charts
export async function getStudentEarningBdtChart(
  accessToken: string,
): Promise<EarningsChartApiResponse> {
  if (!accessToken) {
    throw new Error("Unauthorized: No access token found");
  }
  try {
    const res = await fetch(`${API_BASE}/student-earnings/bdt-chart`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch BDT chart ${res.status} (${res.statusText})`,
      );
    }

    const data: EarningsChartApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getUpcomingCourses Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while fetching upcoming courses");
  }
}
// End get Earning Bdt Charts

// get Student Earning List
export interface StudentEarningItem {
  id: number;
  marketplace_name: string;
  payment_method: string;
  job_title: string;
  amount_bdt: number;
  amount_usd: number;
  earning_images: string[];
  earned_at: string; // "YYYY-MM-DD HH:mm:ss"
  status: number; // 0 | 1
}
export interface StudentEarningsData {
  total_earnings: number;
  earnings: StudentEarningItem[];
  pagination: PaginationType;
}

export interface StudentEarningsApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: StudentEarningsData;
}
export async function getStudentEarningList({
  params = {},
  token,
}: {
  params?: Record<string, unknown>;
  token: string;
}): Promise<StudentEarningsApiResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      urlParams.append(key, String(value));
    }
  });

  const queryString = urlParams.toString();
  try {
    const res = await fetch(`${API_BASE}/student-earnings?${queryString}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(
        `StudentEarnings API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: StudentEarningsApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getStudentEarnings Error:", error.message);
      throw error;
    }

    throw new Error("Unknown error occurred while fetching student earnings");
  }
}
// End get Student Earning List

// start delete student earning
export interface DeleteStudentEarningResponse {
  success: boolean;
  message: string;
  code: number;
  data?: null;
}

export async function deleteStudentEarning(
  id: number,
): Promise<DeleteStudentEarningResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const response = await fetch(`${API_BASE}/student-earnings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete student earning ${response.status} (${response.statusText})`,
      );
    }

    const data: DeleteStudentEarningResponse = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("deleteStudentEarning Error:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(
        "An unknown error occurred while deleting student earning",
      );
    }
  }
}
// end delete student earning

// Start get Student Payment Histories
export interface PaymentDetails {
  id: number;
  title: string | null;
  image?: string | null;
  price: number | null;
  installment_type: string;
  paid_amount: number;
  payment_date: string;
  due: number;
  status: string;
}

export interface PaymentHistoryItem {
  payment_details: PaymentDetails;
}
export interface PaymentHistoryItemData {
  payment_histories: PaymentHistoryItem[];
  pagination: PaginationType;
}

export interface StudentPaymentHistoryApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: PaymentHistoryItemData;
  errors?: Record<string, string[]>;
}

export async function getStudentPaymentHistories({
  params = {},
}: {
  params?: Record<string, unknown>;
}): Promise<StudentPaymentHistoryApiResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      urlParams.append(key, String(value));
    }
  });

  const queryString = urlParams.toString();
  try {
    const res = await fetch(
      `${API_BASE}/student-panel/payment-histories?${queryString}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(
        `PaymentHistories API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: StudentPaymentHistoryApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getStudentPaymentHistories Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while fetching payment histories");
  }
}
// End get Student Payment Histories

// Start get Course Wise Due Payments
export interface CourseWiseDuePayment {
  id: number;
  course_title: string;
  course_image?: string | null;
  price: number;
  total_paid: number;
  due_amount: number;
}
export interface CourseWiseDuePaymentData {
  due_payments: CourseWiseDuePayment[];
}
export interface CourseWiseDuePaymentsApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: CourseWiseDuePaymentData;
  errors?: Record<string, string[]>;
}

export async function getCourseWiseDuePayments(): Promise<CourseWiseDuePaymentsApiResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }
  try {
    const res = await fetch(
      `${API_BASE}/student-panel/course-wise-due-payments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(
        `CourseWiseDuePayments API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: CourseWiseDuePaymentsApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getCourseWiseDuePayments Error:", error.message);
      throw error;
    }

    throw new Error(
      "Unknown error occurred while fetching course-wise due payments",
    );
  }
}
// End get Course Wise Due Payments

// Start get Student My Courses
export interface StudentCourseInfo {
  id: number;
  title: string;
  slug: string;
  featured_image?: string | null;
  ratings: number;
}
export interface StudentCoursesBatch {
  id: number;
  name: string;
}
export interface StudentMyCourse {
  id: number;
  status: "Pending" | "Active" | "Completed" | string;
  payment_status: number;
  total_completed_lessons: string;
  total_lessons: number;
  progress_percentage: number;
  progress_text: string;
  batch: StudentCoursesBatch;
  course: StudentCourseInfo;
}
export interface StudentMyCoursesData {
  courses: StudentMyCourse[];
  pagination: PaginationType;
}
export interface StudentMyCoursesResponse {
  success: boolean;
  message: string;
  code: number;
  data: StudentMyCoursesData;
  errors?: Record<string, string[]>;
}

export async function getStudentMyCourses({
  params = {},
}: {
  params?: Record<string, unknown>;
}): Promise<StudentMyCoursesResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      urlParams.append(key, String(value));
    }
  });

  const queryString = urlParams.toString();
  try {
    const res = await fetch(
      `${API_BASE}/student-panel/my-courses?${queryString}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(
        `MyCoursesResponse API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: StudentMyCoursesResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getStudentMyCourses Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while fetching student my courses");
  }
}

//******* End get Student My Courses ******

// ****** Start get My Course By Slug ******
export enum MyCourseBySlugLessonType {
  Video = 0,
  Document = 1,
}
export interface MyCourseBySlugInfo {
  id: number;
  title: string;
}
export interface MyCourseBySlugCurrentLesson {
  id: number;
  chapter_id: number;
  chapter_title: string;
  title: string;
  description: string;
  duration: number;
  type?: MyCourseBySlugLessonType; // 0 = video?, 1 = document? (backend logic)
  video_url?: string | null;
  is_completed: boolean;
  order: number;
}
export interface MyCourseBySlugLessonNavigationItem {
  id: number;
  title: string;
  chapter_title: string;
}

export interface LessonNavigation {
  previous_lesson: MyCourseBySlugLessonNavigationItem | null;
  next_lesson: MyCourseBySlugLessonNavigationItem | null;
}
export interface MyCourseBySlugData {
  course: MyCourseBySlugInfo;
  current_lesson: MyCourseBySlugCurrentLesson;
  navigation: LessonNavigation;
}

export interface MyCourseBySlugApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: MyCourseBySlugData;
  errors?: Record<string, string[]>;
}
export async function getStudentMyCoursesBySlug(
  slug: string,
  params?: Record<string, unknown>,
): Promise<MyCourseBySlugApiResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  const urlParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        urlParams.append(key, String(value));
      }
    });
  }

  const queryString = urlParams.toString();
  const url = `${API_BASE}/student-panel/my-courses/${slug}${
    queryString ? `?${queryString}` : ""
  }`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // if (!res.ok) {
    //   throw new Error(
    //     `MyCoursesResponse API Error: ${res.status} ${res.statusText}`,
    //   );
    // }
    const data: MyCourseBySlugApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getMyCourseBySlug Error:", error.message);
      throw new Error("Error fetching my course by slug");
    }
    throw new Error(
      "Unknown error occurred while fetching student my courses by slug",
    );
  }
}
//******* End get My Course By Slug ******
//******* Start get My Course By Slug Modules ******
export interface CourseModuleLessonItem {
  id: number;
  title: string;
  description: string;
  duration: number;
  type?: MyCourseBySlugLessonType; // 1 = video?, 2 = document? (backend logic)
  video_url?: string | null;
  is_completed: boolean;
  order: number;
  status: number;
}
export interface CourseModule {
  id: number;
  title: string;
  description: string;
  lessons: CourseModuleLessonItem[];
}
export interface CourseModulesData {
  course_modules: CourseModule[];
}

// Full API response interface
export interface CourseModulesResponse {
  success: boolean;
  message: string;
  code: number;
  data: CourseModulesData;
  errors?: Record<string, string[]>;
}
export async function getStudentCourseModulesList(
  slug: string,
): Promise<CourseModulesResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("Unauthorized: Access token not found");
    }

    const url = `${API_BASE}/student-panel/my-courses/${slug}/modules`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(
        `getStudentCourseModulesList API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: CourseModulesResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getStudentCourseModulesList Error:", error.message);
      throw new Error("Error fetching course modules");
    }
    throw new Error("Unknown error occurred while fetching course modules");
  }
}

// ****** End get My Course By Slug Modules ******

// ******* Start MyCourse Mark Lesson Complete ******

export interface MarkLessonCompleteData {
  completed_at: string;
}
export interface MarkLessonCompleteResponse {
  success: boolean;
  message: string;
  code: number;
  data: MarkLessonCompleteData | null;
  errors?: Record<string, string[]>;
}

export async function MyCourseMarkLessonComplete(
  lessonId: number,
): Promise<MarkLessonCompleteResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
      throw new Error("Unauthorized: Access token not found");
    }
    const url = `${API_BASE}/student-panel/lessons/${lessonId}/mark-complete`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data: MarkLessonCompleteResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("markLessonComplete Error:", error.message);
      throw new Error("Error marking lesson complete");
    }
    throw new Error("Unknown error occurred while marking lesson complete");
  }
}
// ******* End MyCourse Mark Lesson Complete ******

//******* Start get Student Profile ******
export interface Education {
  id: number;
  degree: string;
  institution: string;
  subject: string;
}

export interface Organization {
  id: number;
  name: string;
}

export interface Branch {
  id: number;
  name: string;
}

export interface StudentProfile {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  profile_image: string | null;
  status: string;
  is_blocked: boolean;
  email_verified_at: string | null;
  last_login_at: string | null;
  organization: Organization;
  branch: Branch;
  age: number | null;
  date_of_birth: string | null;
  gender: string | null;
  facebook: string | null;
  linkedin: string | null;
  educations: Education[];
}

export interface StudentProfileResponse {
  success: boolean;
  message: string;
  code: number;
  data: StudentProfile;
  errors?: Record<string, string[]>;
}

export async function getStudentProfile(): Promise<StudentProfileResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const res = await fetch(`${API_BASE}/student-panel/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(
        `StudentProfile API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: StudentProfileResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getStudentProfile Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while fetching student profile");
  }
}
// End get Student Profile

// Start change Student Password
export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  code: number;
  errors?: Record<string, string[]>;
}

// Client-side function for changing password (for use in client components)
export async function changeStudentPasswordClient(
  payload: ChangePasswordPayload,
  accessToken: string,
): Promise<ChangePasswordResponse> {
  try {
    // Convert to URL-encoded format
    const formData = new URLSearchParams();
    formData.append("current_password", payload.current_password);
    formData.append("password", payload.password);
    formData.append("password_confirmation", payload.password_confirmation);

    const res = await fetch(
      `${API_BASE}/student-panel/profile/change-password`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      },
    );

    const data: ChangePasswordResponse = await res.json();

    if (!res.ok) {
      return data;
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("changeStudentPasswordClient Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while changing password");
  }
}
// End change Student Password

// Client-side function for getting student profile (for use in client components)
export async function getStudentProfileClient(
  accessToken: string,
): Promise<StudentProfileResponse> {
  try {
    const res = await fetch(`${API_BASE}/student-panel/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(
        `StudentProfile API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: StudentProfileResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getStudentProfileClient Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while fetching student profile");
  }
}

// Start update Student Profile
export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  age?: number | null;
  facebook?: string | null;
  linkedin?: string | null;
  educations?: Array<{
    id?: number;
    degree: string;
    institution: string;
    subject: string;
  }>;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  code: number;
  data?: StudentProfile;
  errors?: Record<string, string[]>;
}

// Client-side function for updating student profile (for use in client components with FormData)
export async function updateStudentProfileClient(
  formData: FormData,
  accessToken: string,
): Promise<UpdateProfileResponse> {
  try {
    const res = await fetch(`${API_BASE}/student-panel/profile/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Don't set Content-Type header, browser will set it with boundary for FormData
      },
      body: formData,
    });

    const data: UpdateProfileResponse = await res.json();

    if (!res.ok) {
      return data;
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("updateStudentProfileClient Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while updating profile");
  }
}

// Start get Free Seminar by Slug
export interface FreeSeminar {
  id: number;
  title: string;
  slug: string;
  about: string;
  class_topic: string;
  seminar_type: number;
  seminar_type_text?: string;
  description: string;
  location: string;
  seminar_date: string;
  seminar_time: string;
  seminar_time_formatted?: string;
  seminar_link: string | null;
  image?: string | null;
  branch: SeminarBranch;
  instructors: Instructor[];
  course_category?: FreeSeminarCourseCategory;
}
interface FreeSeminarCourseCategory {
  id?: number;
  category_id: number;
  category_name: string;
  name?: string;
  slug?: string;
  bn_name?: string;
}

export interface SeminarBranch {
  id: number;
  name: string;
}
export interface Instructor {
  id: number;
  name: string;
  email: string;
  designation: string;
  experience: string;
  profile_image?: string | null;
  instructors_tools: InstructorTool[];
}
export interface InstructorTool {
  id: number;
  image?: string | null;
}
export interface FreeSeminarBySlugResponse {
  success: boolean;
  message: string;
  code: number;
  data: FreeSeminar;
}
export async function getFreeSeminarBySlug(
  slug: string,
  token?: string,
): Promise<FreeSeminarBySlugResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const response = await fetch(
      `${API_BASE}/student-panel/free-seminars/${slug}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch free seminar (${response.status} ${response.statusText})`,
      );
    }

    const data: FreeSeminarBySlugResponse = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("getFreeSeminarBySlug Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while fetching free seminar");
  }
}
// End get Free Seminar by Slug

// Start Public get Free Seminar  by Slug
export interface PublicFreeSeminar {
  id: number;
  title: string;
  slug: string;
  about: string;
  class_topic: string;
  seminar_type: number;
  description: string;
  location: string;
  seminar_date: string;
  seminar_time: string;
  seminar_link: string | null;
  image?: string | null;
  branch: PublicSeminarBranch;
  instructors: PublicInstructor[];
  course_category?: PublicFreeSeminarCourseCategory;
}

export interface PublicFreeSeminarCourseCategory {
  id: number;
  name: string;
  slug: string;
  courses: PublicCourse[];
}

export interface PublicCourse {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  featured_image: string;
  ratings: number;
  total_live_class: number;
  branches: PublicSeminarBranch[];
  batch: PublicCourseBatch;
}

export interface PublicCourseBatch {
  id: number;
  price: number;
  discount: number;
  discount_type: string;
  after_discount: number;
  discount_percentage: number;
  is_online: number;
  start_date: string;
  end_date: string;
  apply_end_date: string;
  status: number;
  duration: string;
  location: string;
  seminar_type_text?: string;
}

export interface PublicSeminarBranch {
  id: number;
  name: string;
}

export interface PublicInstructor {
  id: number;
  name: string;
  email: string;
  designation: string;
  experience: string;
  profile_image?: string | null;
  instructors_tools: PublicInstructorTool[];
}

export interface PublicInstructorTool {
  id: number;
  image?: string | null;
}

export interface PublicFreeSeminarBySlugResponse {
  success: boolean;
  message: string;
  code: number;
  data: PublicFreeSeminar;
}
export async function getPublicFreeSeminarBySlug(
  slug: string,
): Promise<PublicFreeSeminarBySlugResponse> {
  try {
    const response = await fetch(
      `${API_BASE}/public/free-seminars/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch public free seminar (${response.status} ${response.statusText})`
      );
    }

    const data: PublicFreeSeminarBySlugResponse = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("getPublicFreeSeminarBySlug Error:", error);
    if (error instanceof Error) {
      throw new Error(`Error fetching public free seminar: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching public free seminar");
  }
}

// End Public get Free Seminar by Slug

export async function getFreeSeminarByPublicPage({ params = {} }: { params?: Record<string, unknown> } = {}): Promise<FreeSeminarsApiResponse> {

  try {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        urlParams.append(key, String(value));
      }
    });

    const queryString = urlParams.toString();
    const url = `${API_BASE}/public/free-seminars?${queryString}`;
    const response = await fetch(url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: FreeSeminarsApiResponse = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("getFreeSeminarByPublicPage Error:", error);
    if (error instanceof Error) {
      throw new Error(`Error fetching free seminars: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching free seminars");
  }
}


// start get All Job Titles For Earning

export interface JobTitleEarningItem {
  id: number;
  title: string;
}

export interface JobTitleEarningItemData {
  marketplaces: JobTitleEarningItem[];
  payment_methods: JobTitleEarningItem[];
  job_titles: JobTitleEarningItem[];
}

export interface JobTitleEarningItemResponse {
  success: boolean;
  message: string;
  code: number;
  data: JobTitleEarningItemData;
  errors?: Record<string, string[]>;
}

export async function getAllJobTitlesForEarning(
  token?: string,
): Promise<JobTitleEarningItemResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const response = await fetch(
      `${API_BASE}/student-earnings/dropdown-options`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch student job list (${response.status} ${response.statusText})`,
      );
    }

    const data: JobTitleEarningItemResponse = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getAllJobTitlesForEarning Error:", error.message);
      throw new Error(`Error fetching job list: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching job list");
  }
}

// End get All Job Titles For Earning

// start Post add student earning

export interface StudentEarningCreateData {
  id: number;
  marketplace_name: string;
  payment_method: string;
  job_title: string;
  amount_bdt: number;
  amount_usd: number;
  earning_images: string[];
  earned_at: string;
  status: number;
}
export interface CreateStudentEarningApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: StudentEarningCreateData;
  errors?: Record<string, string[]>;
}

export async function addStudentEarning(
  formData: FormData,
  token: string,
): Promise<CreateStudentEarningApiResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const response = await fetch(`${API_BASE}/student-earnings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data: CreateStudentEarningApiResponse = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("addStudentEarning Error:", error.message);
      throw new Error(`Error adding job Earning: ${error.message}`);
    }
    throw new Error("An unknown error occurred while adding job Earning");
  }
}
// End addStudentEarning

// start get student earning by id
export interface StudentEarningByIdData {
  id: number;
  marketplace_name: string;
  payment_method: string;
  job_title: string;
  amount_bdt: number;
  amount_usd: number;
  earning_images: string[];
  earned_at: string;
}

export interface GetStudentEarningByIdApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: StudentEarningByIdData;
  errors?: Record<string, string[]>;
}

export async function getStudentEarning(
  earningId: number,
  token: string,
): Promise<GetStudentEarningByIdApiResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const response = await fetch(`${API_BASE}/student-earnings/${earningId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch student earning (${response.status} ${response.statusText})`,
      );
    }

    const data: GetStudentEarningByIdApiResponse = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getStudentEarning Error:", error.message);
      throw new Error(`Error fetching student earning: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching student earning");
  }
}
// End get student earning by id

// Start update student earning
export interface StudentEarningUpdateData {
  id: number;
  marketplace_name: string;
  payment_method: string;
  job_title: string;
  amount_bdt: number;
  amount_usd: number;
  earning_images: string[];
  earned_at: string;
}

export interface UpdateStudentEarningApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: StudentEarningUpdateData;
  errors?: Record<string, string[]>;
}

export async function updateStudentEarning(
  earningId: number,
  formData: FormData,
  token: string,
): Promise<UpdateStudentEarningApiResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const response = await fetch(`${API_BASE}/student-earnings/${earningId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data: UpdateStudentEarningApiResponse = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("updateStudentEarning Error:", error.message);
      throw new Error(`Error updating student earning: ${error.message}`);
    }
    throw new Error("An unknown error occurred while updating student earning");
  }
}
// End update student earning
