"use server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

//   ******* Start getPublicWhyChooseUs API *******
export interface WhyChooseUsItem {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
  status: number;
}

export interface WhyChooseUsData {
  why_choose_us: WhyChooseUsItem[];
}

export interface WhyChooseUsApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: WhyChooseUsData;
  errors?: Record<string, string[]>;
}
export async function getPublicWhyChooseUs(): Promise<WhyChooseUsApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/why-choose-us`);

    if (!res.ok) {
      throw new Error(
        `getPublicWhyChooseUs API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: WhyChooseUsApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching Why Choose Us:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching Why Choose Us");
  }
}
//   ******* End getPublicWhyChooseUs API *******

//   ******* Start getPublicLicensesCertificate list API *******

export interface LicenseItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  status: number;
}
export interface LicenseData {
  licenses: LicenseItem[];
}
export interface LicenseApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: LicenseData;
  errors?: Record<string, string[]>;
}

export async function getPublicLicensesCertificate(): Promise<LicenseApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/licenses`);

    if (!res.ok) {
      throw new Error(
        `getPublicLicensesCertificate API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: LicenseApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching licenses Certificate:", error.message);
      throw new Error(error.message);
    }
    throw new Error(
      "Unknown error occurred while fetching licenses Certificate",
    );
  }
}
//   ******* End getPublicLicensesCertificate list API *******

//   ******* Start getPublicAchievements API *******
export interface PublicAchievement {
  id: number;
  image?: string;
  title: string;
  description: string;
  name: string;
  designation: string;
  status: number;
}

export interface PublicAchievementData {
  achievements: PublicAchievement[];
}

export interface PublicAchievementApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: PublicAchievementData;
  errors?: Record<string, string[]>;
}

export async function getPublicAchievements(): Promise<PublicAchievementApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/achievements`);

    if (!res.ok) {
      throw new Error(
        `getPublicAchievements API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: PublicAchievementApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching Achievements:", error.message);
      throw new Error(error.message);
    }
    throw new Error(
      "Unknown error occurred while fetching Achievements",
    );
  }
}
//   ******* End getPublicAchievements API *******

//   ******* Start getPublicCompanyMissionSection API *******
// Single section type (mission / vision / value)
export interface CompanyMission {
  id: number;
  title: string;
  sub_title: string;
  image: string;
  status: number;
}
export interface CompanyMissionData {
    mission: CompanyMission;
    vision: CompanyMission;
    value: CompanyMission;
}

// Main API response type
export interface CompanyMissionResponse {
  success: boolean;
  message: string;
  code: number;
  data: CompanyMissionData;
  errors?: Record<string, string[]>;
}
  
export async function getPublicCompanyMissionSection(): Promise<PublicAchievementApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/company-mission-section`);

    if (!res.ok) {
      throw new Error(
        `getPublicCompanyMissionSection API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: PublicAchievementApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching company mission:", error.message);
      throw new Error(error.message);
    }
    throw new Error(
      "Unknown error occurred while fetching company mission",
    );
  }
}
//   ******* End getPublicCompanyMissionSection API *******
