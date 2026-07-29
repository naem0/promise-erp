"use server";

import { PaginationType } from "@/types/pagination";

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
export async function getPublicWhyChooseUs(): Promise<WhyChooseUsApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/public/why-choose-us`);

    if (res.status === 404) {
      console.warn("No why choose us found.");
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

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

export async function getPublicLicensesCertificate(): Promise<LicenseApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/public/licenses`);

    if (res.status === 404) {
      console.warn("No certificates found.");
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `getPublicLicensesCertificate API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: LicenseApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
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

export async function getPublicAchievements(): Promise<PublicAchievementApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/public/achievements`);

    if (res.status === 404) {
      console.warn("No achievements found.");
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

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
    throw new Error("Unknown error occurred while fetching Achievements");
  }
}
//   ******* End getPublicAchievements API *******

//   ******* Start getPublicCompanyMissionSection API *******
// Single section type (mission / vision / value)
export interface CompanyMission {
  type: string;
  id: number;
  title: string;
  sub_title: string;
  image?: string;
  status: number;
}
export interface CompanyMissionData {
  company_mission: CompanyMission[];
}

// Main API response type
export interface CompanyMissionApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: CompanyMissionData;
  errors?: Record<string, string[]>;
}

export async function getPublicCompanyMissionSection(): Promise<CompanyMissionApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/public/company-mission-section`);

    if (res.status === 404) {
      console.warn("No company mission found.");
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `getPublicCompanyMissionSection API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: CompanyMissionApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    if (error instanceof Error) {
      console.error("Error fetching company mission:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching company mission");
  }
}
//   ******* End getPublicCompanyMissionSection API *******

//   ******* Start getPublicAboutBanner API *******
export interface AboutBannerItem {
  id: number;
  title: string;
  sub_title: string;
  type: string;
  description: string;
  image?: string | null;
  video_link?: string;
  button_text_one?: string;
  button_link_one?: string;
  button_text_two?: string;
  button_link_two?: string;
  status: number;
}

export interface AboutBannerData {
  total_sections: number;
  sections: AboutBannerItem[];
  pagination: PaginationType;
}

export interface AboutBannerApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: AboutBannerData;
  errors?: Record<string, string[]>;
}

export async function getPublicAboutBanner(): Promise<AboutBannerApiResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/public/sections?type=about_banner&per_page=15&page=1`,
    );

    if (res.status === 404) {
      console.warn("No about banner found.");
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `getPublicAboutBanner API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: AboutBannerApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    if (error instanceof Error) {
      console.error("Error fetching About Banner:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred while fetching About Banner");
  }
}
//   ******* End getPublicAboutBanner API *******

//   ******* Start getPublicWhyChooseUsSection API *******
export async function getPublicWhyChooseUsSection(): Promise<AboutBannerApiResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/public/sections?type=why_choose_us&per_page=15&page=1`,
    );

    if (res.status === 404) {
      console.warn("No why choose us section found.");
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `getPublicWhyChooseUsSection API error: ${res.status} ${res.statusText}`,
      );
    }

    const data: AboutBannerApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    if (error instanceof Error) {
      console.error("Error fetching Why Choose Us section:", error.message);
      throw new Error(error.message);
    }
    throw new Error(
      "Unknown error occurred while fetching Why Choose Us section",
    );
  }
}
//   ******* End getPublicWhyChooseUsSection API *******
