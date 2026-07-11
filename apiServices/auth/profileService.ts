
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://erp.e-laeltd.com/api/v1";

export interface UserProfile {
  id: number;
  uuid: string;
  employee_id?: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  date_of_birth?: string;
  blood_group?: string;
  nid?: string;
  joining_date?: string;
  release_date?: string;
  employment_type?: string;
  experience?: string;
  address?: string;
  note?: string;
  profile_image?: string ;
  organization: {
    id: number;
    name: string;
  };
  department?: string;
  designation?: {
    id: number;
    name: string;
  };
  salary_scale?: string;
  subscription?: string;
  branches?: {
    id: number;
    name: string;
  }[];
  main_branch?: {
    id: number;
    name: string;
  };
  roles?: string[];
  tools?: string[];
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  code: number;
  data: UserProfile;
  errors?: Record<string, string[]>;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  code: number;
  data: UserProfile;
  errors?: Record<string, string[]>;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  code: number;
  data: null;
  errors?: Record<string, string[]>;
}

export async function getUserProfile(accessToken: string): Promise<UserProfileResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("User profile not found.");
      return null;
    }

    if (res.status === 401) {
      console.warn("Unauthorized: Invalid access token");
      return null;
    }

    if (res.status === 403) {
      console.warn("Unauthorized: Invalid access token");
      return null;
    }

    if (!res.ok) {
      throw new Error(`UserProfile API Error: ${res.status} ${res.statusText}`);
    }

    const data: UserProfileResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getUserProfile Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while fetching profile");
  }
}

export async function updateUserProfile(
  formData: FormData,
  accessToken: string
): Promise<UpdateProfileResponse> {
  try {
    const res = await fetch(`${API_BASE}/auth/update-profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data: UpdateProfileResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("updateUserProfile Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while updating profile");
  }
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export async function changeUserPassword(
  payload: ChangePasswordPayload,
  accessToken: string
): Promise<ChangePasswordResponse> {
  try {
    const formData = new FormData();
    formData.append("current_password", payload.current_password);
    formData.append("new_password", payload.new_password);
    formData.append("new_password_confirmation", payload.new_password_confirmation);

    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data: ChangePasswordResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("changeUserPassword Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while changing password");
  }
}
