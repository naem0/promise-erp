"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// ============================================================
// Interfaces 
// ============================================================

export interface Branch {
  id: number;
  name: string;
}

export interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  button_text_one: string;
  button_link_one: string;
  button_text_two: string;
  button_link_two: string;
  background_image?: string | null;
  video_url?: string | null;
  status: number;
}

export interface HeroSectionsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_hero_sections: number;
    hero_sections: HeroSection[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleHeroSectionResponse {
  success: boolean;
  message: string;
  code?: number;
  data?: HeroSection | null;
  errors?: Record<string, string[] | string>;
}

// ============================================================
// GET Hero Sections (Paginated)
// ============================================================

export async function getHeroSectionsCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<HeroSectionsResponse> {
  "use cache";
  cacheTag("hero-sections-list");

  try {
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, params[key]!.toString());
      }
    }

    const res = await fetch(
      `${API_BASE}/hero-sections?${urlParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data: HeroSectionsResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getHeroSectionsCached:", error.message);
      throw new Error("Error fetching hero sections");
    } else {
      throw new Error("Error fetching hero sections");
    }
  }
}

export async function getHeroSections(
  params: Record<string, unknown> = {}
): Promise<HeroSectionsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    return await getHeroSectionsCached(token, params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getHeroSections:", error.message);
      throw new Error("Error fetching hero sections");
    } else {
      throw new Error("Error fetching hero sections");
    }
  }
}

// ============================================================
// GET Hero Section by ID
// ============================================================

export async function getHeroSectionById(
  id: number
): Promise<SingleHeroSectionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/hero-sections/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: SingleHeroSectionResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getHeroSectionById:", error.message);
      throw new Error("Error fetching hero section");
    } else {
      throw new Error("Error fetching hero section");
    }
  }
}

// ============================================================
// CREATE Hero Section
// ============================================================

export async function createHeroSection(
  formData: FormData
): Promise<SingleHeroSectionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
      };
    }

    const url = `${API_BASE}/hero-sections`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    updateTag("hero-sections-list");

    return result;
  } catch (error: unknown) {
    console.error("Error in createHeroSection:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error creating hero section",
    };
  }
}

// ============================================================
// UPDATE Hero Section
// ============================================================

export async function updateHeroSection(
  id: number,
  formData: FormData
): Promise<SingleHeroSectionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) {
      return {
        success: false,
        message: "No valid session or access token found.",
      };
    }

    formData.append("_method", "PUT");

    const res = await fetch(`${API_BASE}/hero-sections/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("hero-sections-list");

    return result;
  } catch (error: unknown) {
    console.error("Error in updateHeroSection:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error updating hero section",
    };
  }
}

// ============================================================
// DELETE Hero Section
// ============================================================

export async function deleteHeroSection(
  id: number
): Promise<SingleHeroSectionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/hero-sections/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("hero-sections-list");

    return result;
  } catch (error: unknown) {
    console.error("Error in deleteHeroSection:", error);
    if (error instanceof Error) {
      throw new Error("Error deleting hero section");
    } else {
      throw new Error("Error deleting hero section");
    }
  }
}


//video gallery service ts file started here

// ============================================================
// Interfaces 
// ============================================================ 
export interface VideoGallery {
  id: number;
  youtube_link: string;
  thumbnail_image?: string | null;
  type: number;
  status: number;
}
export interface VideoGalleriesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_video_galleries: number;
    video_galleries: VideoGallery[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}
export interface SingleVideoGalleryResponse {
  success: boolean;
  message: string;
  code?: number;
  data?: VideoGallery | null;
  errors?: Record<string, string[] | string>;
}
// ============================================================
// GET Video Galleries (Paginated)
// ============================================================

export async function getVideoGalleriesCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<VideoGalleriesResponse> {
  "use cache";
  cacheTag("public-reviews");

  try {
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, params[key]!.toString());
      }
    }

    const res = await fetch(
      `${API_BASE}/video-galleries?${urlParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data: VideoGalleriesResponse = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getVideoGalleriesCached:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching video galleries");
    } else {
      throw new Error("Error fetching video galleries");
    }
  }
}

export async function getVideoGalleries(
  params: Record<string, unknown> = {}
): Promise<VideoGalleriesResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    return await getVideoGalleriesCached(token, params);
  } catch (error: unknown) {
    console.error("Error in getVideoGalleries:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching video galleries");
    } else {
      throw new Error("Error fetching video galleries");
    }
  }
}

//GET VIDEO GALLERY by ID

export async function getVideoGalleryById(id: number): Promise<SingleVideoGalleryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/video-galleries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data: SingleVideoGalleryResponse = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getVideoGalleryById:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching video gallery");
    } else {
      throw new Error("Error fetching video gallery");
    }
  }
}
// ============================================================
//create video gallery
// ============================================================
export async function createVideoGallery(formData: FormData): Promise<SingleVideoGalleryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const url = `${API_BASE}/video-galleries`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    updateTag("public-reviews");
    return result;
  } catch (error: unknown) {
    console.error("Error in createVideoGallery:", error);
    if (error instanceof Error) {
      throw new Error("Error creating video gallery");
    } else {
      throw new Error("Error creating video gallery");
    }
  }
}
// ============================================================
// UPDATE Video Gallery
// ============================================================
export async function updateVideoGallery(
  id: number,
  formData: FormData
): Promise<SingleVideoGalleryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    formData.append("_method", "PUT");
    const res = await fetch(`${API_BASE}/video-galleries/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("public-reviews");

    return result;
  } catch (error: unknown) {
    console.error("Error in updateVideoGallery:", error);
    if (error instanceof Error) {
      throw new Error("Error updating video gallery");
    } else {
      throw new Error("Error updating video gallery");
    }
  }
}

// ============================================================ 
// DELETE Video Gallery
// ============================================================
export async function deleteVideoGallery(
  id: number
): Promise<SingleVideoGalleryResponse> {
  try {
    const session = await getServerSession(authOptions);

    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/video-galleries/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();

    updateTag("public-reviews");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteVideoGallery:", error);
    if (error instanceof Error) {
      throw new Error("Error deleting video gallery");
    } else {
      throw new Error("Error deleting video gallery");
    }
  }
}

//video gallery service ts file ended here

//common sections service ts file started here

// ============================================================
// Interfaces 
// ============================================================

export interface CommonSection {
  id: number;
  title: string;
  sub_title: string;
  type: string;
  description: string | null;
  image?: string | null;
  video_link?: string | null;
  button_text_one?: string | null;
  button_link_one?: string | null;
  button_text_two?: string | null;
  button_link_two?: string | null;
  status: number;
}

export interface CommonSectionsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_sections: number;
    sections: CommonSection[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleCommonSectionResponse {
  success: boolean;
  message: string;
  code: number;
  data?: CommonSection | null;
  errors?: Record<string, string[] | string>;
}

// ============================================================
// GET Common Sections (Paginated)
// ============================================================

export async function getCommonSectionsCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<CommonSectionsResponse> {
  "use cache";
  cacheTag("common-sections-list");

  try {
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, params[key]!.toString());
      }
    }

    const res = await fetch(
      `${API_BASE}/sections?${urlParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch common sections: ${res.status} ${res.statusText}`);
    }

    const data: CommonSectionsResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getCommonSectionsCached:", error.message);
      throw new Error("Error fetching common sections");
    } else {
      throw new Error("Error fetching common sections");
    }
  }
}

export async function getCommonSections(
  params: Record<string, unknown> = {}
): Promise<CommonSectionsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    return await getCommonSectionsCached(token, params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getCommonSections:", error.message);
      throw new Error("Error fetching common sections");
    } else {
      throw new Error("Error fetching common sections");
    }
  }
}

// ============================================================
// GET Common Section by ID
// ============================================================

export async function getCommonSectionById(
  id: number
): Promise<SingleCommonSectionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/sections/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch common section: ${res.status} ${res.statusText}`);
    }

    const data: SingleCommonSectionResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getCommonSectionById:", error.message);
      throw new Error("Error fetching common section");
    } else {
      throw new Error("Error fetching common section");
    }
  }
}

// ============================================================
// CREATE Common Section
// ============================================================

export async function createCommonSection(
  formData: FormData
): Promise<SingleCommonSectionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const url = `${API_BASE}/sections`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    updateTag("common-sections-list");
    updateTag("categories-list");
    updateTag("public-services");
    updateTag("public-govt-course");
    updateTag("public-opportunity");
    updateTag("public-teachers");
    updateTag("public-video-galleries");
    updateTag("public-blog");
    updateTag("public-reviews");
    updateTag("public-news-feeds");
    updateTag("affiliates-clients");
    updateTag("public-branches");

    return result
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createCommonSection:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Error creating common section");
    }
  }
}

// ============================================================
// UPDATE Common Section
// ============================================================

export async function updateCommonSection(
  id: number,
  formData: FormData
): Promise<SingleCommonSectionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    formData.append("_method", "PUT");

    const res = await fetch(`${API_BASE}/sections/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("common-sections-list");
    updateTag("categories-list");
    updateTag("public-services");
    updateTag("public-govt-course");
    updateTag("public-opportunity");
    updateTag("public-teachers");
    updateTag("public-video-galleries");
    updateTag("public-blog");
    updateTag("public-reviews");
    updateTag("public-news-feeds");
    updateTag("affiliates-clients");
    updateTag("public-branches");

    return result
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateCommonSection:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Error updating common section");
    }
  }
}

// ============================================================
// DELETE Common Section
// ============================================================

export async function deleteCommonSection(
  id: number
): Promise<SingleCommonSectionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/sections/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();


    updateTag("categories-list");
    updateTag("public-services");
    updateTag("public-govt-course");
    updateTag("public-opportunity");
    updateTag("public-teachers");
    updateTag("public-video-galleries");
    updateTag("public-blog");
    updateTag("public-reviews");
    updateTag("public-news-feeds");
    updateTag("affiliates-clients");
    updateTag("public-branches");

    return result
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in deleteCommonSection:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Error deleting common section");
    }
  }
}

//common sections service ts file ended here

//Opportunities service ts file started here

// ============================================================
// Interfaces 
// ============================================================

export interface Opportunity {
  id: number;
  title: string;
  sub_title: string;
  image?: string | null;
  status: number;
}

export interface OpportunitiesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_opportunities: number;
    opportunities: Opportunity[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleOpportunityResponse {
  success: boolean;
  message: string;
  code: number;
  data?: Opportunity | null;
  errors?: Record<string, string[] | string>;
}

// ============================================================
// GET Opportunities (Paginated)
// ============================================================

export async function getOpportunitiesCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<OpportunitiesResponse> {
  "use cache";
  cacheTag("opportunities-list");

  try {
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, params[key]!.toString());
      }
    }

    const res = await fetch(
      `${API_BASE}/opportunities?${urlParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch opportunities: ${res.status} ${res.statusText}`);
    }

    const data: OpportunitiesResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getOpportunitiesCached:", error.message);
      throw new Error("Error fetching opportunities");
    } else {
      throw new Error("Error fetching opportunities");
    }
  }
}

export async function getOpportunities(
  params: Record<string, unknown> = {}
): Promise<OpportunitiesResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    return await getOpportunitiesCached(token, params);
  } catch (error: unknown) {
    console.error("Error in getOpportunities:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching opportunities");
    } else {
      throw new Error("Error fetching opportunities");
    }
  }
}

// ============================================================
// GET Opportunity by ID
// ============================================================

export async function getOpportunityById(
  id: number
): Promise<SingleOpportunityResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/opportunities/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch opportunity: ${res.status} ${res.statusText}`);
    }

    const data: SingleOpportunityResponse = await res.json();

    return data;
  } catch (error: unknown) {
    console.error("Error in getOpportunityById:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching opportunity");
    } else {
      throw new Error("Error fetching opportunity");
    }
  }
}

// ============================================================
// CREATE Opportunity
// ============================================================

export async function createOpportunity(
  formData: FormData
): Promise<SingleOpportunityResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const url = `${API_BASE}/opportunities`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    updateTag("opportunities-list");
    updateTag("public-opportunity");

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createOpportunity:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Error creating opportunity");
    }
  }
}

// ============================================================
// UPDATE Opportunity
// ============================================================

export async function updateOpportunity(
  id: number,
  formData: FormData
): Promise<SingleOpportunityResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    formData.append("_method", "PUT");

    const res = await fetch(`${API_BASE}/opportunities/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("opportunities-list");
    updateTag("public-opportunity");

    return result;
  } catch (error: unknown) {
    console.error("Error in updateOpportunity:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error updating opportunity");
    }
  }
}

// ============================================================
// DELETE Opportunity
// ============================================================

export async function deleteOpportunity(
  id: number
): Promise<SingleOpportunityResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/opportunities/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("opportunities-list");
    updateTag("public-opportunity");

    return result;
  } catch (error: unknown) {
    console.error("Error in deleteOpportunity:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error deleting opportunity");
    }
  }
}

//Opportunities service ts file ended here

//our-partners service ts file started here

export interface Partner {
  id: number;
  title: string;
  image?: string | null;
  status: number;
  partner_type: number;
}

export interface PartnersResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_partners: number;
    partners: Partner[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SinglePartnerResponse {
  success: boolean;
  message: string;
  code: number;
  data?: Partner | null;
  errors?: Record<string, string[] | string>;
}

// ============================================================
// GET Partners (Paginated)
// ============================================================

export async function getPartnersCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<PartnersResponse> {
  "use cache";
  cacheTag("partners-list");

  try {
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, params[key]!.toString());
      }
    }

    const res = await fetch(
      `${API_BASE}/partners?${urlParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch partners: ${res.status} ${res.statusText}`);
    }

    const data: PartnersResponse = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getPartnersCached:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching partners");
    } else {
      throw new Error("Error fetching partners");
    }
  }
}

export async function getPartners(
  params: Record<string, unknown> = {}
): Promise<PartnersResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    return await getPartnersCached(token, params);
  } catch (error: unknown) {
    console.error("Error in getPartners:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching partners");
    } else {
      throw new Error("Error fetching partners");
    }
  }
}

// ============================================================
// GET Partner by ID
// ============================================================

export async function getPartnerById(
  id: number
): Promise<SinglePartnerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/partners/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch partner: ${res.status} ${res.statusText}`);
    }

    const data: SinglePartnerResponse = await res.json();

    return data;
  } catch (error: unknown) {
    console.error("Error in getPartnerById:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching partner");
    } else {
      throw new Error("Error fetching partner");
    }
  }
}

// ============================================================
// CREATE Partner
// ============================================================

export async function createPartner(
  formData: FormData
): Promise<SinglePartnerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const url = `${API_BASE}/partners`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    updateTag("partners-list");

    return result;
  } catch (error: unknown) {
    console.error("Error in createPartner:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error creating partner");
    }
  }
}

// ============================================================
// UPDATE Partner
// ============================================================

export async function updatePartner(
  id: number,
  formData: FormData
): Promise<SinglePartnerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    formData.append("_method", "PUT");

    const res = await fetch(`${API_BASE}/partners/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("partners-list");

    return result;
  } catch (error: unknown) {
    console.error("Error in updatePartner:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error updating partner");
    }
  }
}

// ============================================================
// DELETE Partner
// ============================================================

export async function deletePartner(
  id: number
): Promise<SinglePartnerResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/partners/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("partners-list");

    return result;
  } catch (error: unknown) {
    console.error("Error in deletePartner:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error deleting partner");
    }
  }
}

//our-partners service ts file ended here

//news-feeds service ts file started here

// ============================================================
// Interfaces 
// ============================================================

export interface NewsFeed {
  id: number;
  title: string;
  news_link: string;
  image?: string | null;
  created_at: string;
  status: number;
}

export interface NewsFeedsResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_news_feeds: number;
    news_feeds: NewsFeed[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}

export interface SingleNewsFeedResponse {
  success: boolean;
  message: string;
  code: number;
  data?: NewsFeed | null;
  errors?: Record<string, string[] | string>;
}

// ============================================================
// GET News Feeds (Paginated)
// ============================================================

export async function getNewsFeedsCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<NewsFeedsResponse> {
  "use cache";
  cacheTag("news-feeds-list");

  try {
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, params[key]!.toString());
      }
    }

    const res = await fetch(
      `${API_BASE}/news-feeds?${urlParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch news feeds: ${res.status} ${res.statusText}`);
    }

    const data: NewsFeedsResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getNewsFeedsCached:", error.message);
      throw new Error("Error fetching news feeds");
    } else {
      throw new Error("Error fetching news feeds");
    }
  }
}

export async function getNewsFeeds(
  params: Record<string, unknown> = {}
): Promise<NewsFeedsResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    return await getNewsFeedsCached(token, params);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getNewsFeeds:", error.message);
      throw new Error("Error fetching news feeds");
    } else {
      throw new Error("Error fetching news feeds");
    }
  }
}

// ============================================================
// GET News Feed by ID
// ============================================================

export async function getNewsFeedById(
  id: number
): Promise<SingleNewsFeedResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/news-feeds/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch news feed: ${res.status} ${res.statusText}`);
    }

    const data: SingleNewsFeedResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getNewsFeedById:", error.message);
      throw new Error("Error fetching news feed");
    } else {
      throw new Error("Error fetching news feed");
    }
  }
}

// ============================================================
// CREATE News Feed
// ============================================================

export async function createNewsFeed(
  formData: FormData
): Promise<SingleNewsFeedResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const url = `${API_BASE}/news-feeds`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    updateTag("news-feeds-list");
    updateTag("public-news-feeds");
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createNewsFeed:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Error creating news feed");
    }
  }
}

// ============================================================
// UPDATE News Feed
// ============================================================

export async function updateNewsFeed(
  id: number,
  formData: FormData
): Promise<SingleNewsFeedResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    formData.append("_method", "PUT");

    const res = await fetch(`${API_BASE}/news-feeds/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("news-feeds-list");
    updateTag("public-news-feeds");

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateNewsFeed:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Error updating news feed");
    }
  }
}

// ============================================================
// DELETE News Feed
// ============================================================

export async function deleteNewsFeed(
  id: number
): Promise<SingleNewsFeedResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/news-feeds/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    updateTag("news-feeds-list");
    updateTag("public-news-feeds");

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in deleteNewsFeed:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Error deleting news feed");
    }
  }
}

//news-feeds service ts file ended here

//image gallery service ts file started here

// ============================================================
// Interfaces 
// ============================================================
export interface ImageGallery {
  id: number;
  title: string;
  images: string[];
  type: number;
  status: number;
}
export interface ImageGalleriesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total_image_galleries: number;
    image_galleries: ImageGallery[];
    pagination: PaginationType;
  };
  errors?: Record<string, string[]>;
}
export interface SingleImageGalleryResponse {
  success: boolean;
  message: string;
  code?: number;
  data?: ImageGallery | null;
  errors?: Record<string, string[] | string>;
}

// ============================================================
// GET Image Galleries (Paginated)
// ============================================================

export async function getImageGalleriesCached(
  token: string,
  params: Record<string, unknown> = {}
): Promise<ImageGalleriesResponse> {
  "use cache";
  cacheTag("image-galleries-list");

  try {
    const urlParams = new URLSearchParams();

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, params[key]!.toString());
      }
    }

    const res = await fetch(
      `${API_BASE}/image-galleries?${urlParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data: ImageGalleriesResponse = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getImageGalleriesCached:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching image galleries");
    } else {
      throw new Error("Error fetching image galleries");
    }
  }
}

export async function getImageGalleries(
  params: Record<string, unknown> = {}
): Promise<ImageGalleriesResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    return await getImageGalleriesCached(token, params);
  } catch (error: unknown) {
    console.error("Error in getImageGalleries:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching image galleries");
    } else {
      throw new Error("Error fetching image galleries");
    }
  }
}

// ============================================================
// GET Image Gallery by ID
// ============================================================

export async function getImageGalleryById(id: number): Promise<SingleImageGalleryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/image-galleries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data: SingleImageGalleryResponse = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error in getImageGalleryById:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching image gallery");
    } else {
      throw new Error("Error fetching image gallery");
    }
  }
}

// ============================================================
// CREATE Image Gallery
// ============================================================
export async function createImageGallery(formData: FormData): Promise<SingleImageGalleryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const url = `${API_BASE}/image-galleries`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    updateTag("image-galleries-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in createImageGallery:", error);
    if (error instanceof Error) {
      throw new Error("Error creating image gallery");
    } else {
      throw new Error("Error creating image gallery");
    }
  }
}

// ============================================================
// UPDATE Image Gallery
// ============================================================
export async function updateImageGallery(
  id: number,
  formData: FormData
): Promise<SingleImageGalleryResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    formData.append("_method", "PUT");
    const res = await fetch(`${API_BASE}/image-galleries/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    updateTag("image-galleries-list");

    return result;
  } catch (error: unknown) {
    console.error("Error in updateImageGallery:", error);
    if (error instanceof Error) {
      throw new Error("Error updating image gallery");
    } else {
      throw new Error("Error updating image gallery");
    }
  }
}

// ============================================================
// DELETE Image Gallery
// ============================================================
export async function deleteImageGallery(
  id: number
): Promise<SingleImageGalleryResponse> {
  try {
    const session = await getServerSession(authOptions);

    const token = session?.accessToken;
    if (!token) throw new Error("No valid session or access token found.");

    const res = await fetch(`${API_BASE}/image-galleries/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();

    updateTag("image-galleries-list");
    return result;
  } catch (error: unknown) {
    console.error("Error in deleteImageGallery:", error);
    if (error instanceof Error) {
      throw new Error("Error deleting image gallery");
    } else {
      throw new Error("Error deleting image gallery");
    }
  }
}

//image gallery service ts file ended here