"use server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
import { PaginationType } from "@/types/pagination";
import { BlogAuthor } from "./blogWebService";

// ---Start Interfaces home page hero section ---
export interface HeroSection {
  id: number;
  branch?: Branch;
  title: string;
  subtitle: string;
  description?: string;
  button_text_one?: string | null;
  button_link_one?: string | null;
  button_text_two?: string | null;
  button_link_two?: string | null;
  background_image?: string | null;
  video_url?: string | null;
  status?: number;
}

export interface HeroSectionResponse {
  success: boolean;
  message: string;
  code: number;
  data: HeroSection;
  errors?: Record<string, string[]>;
}
// ---End Interfaces home page hero section ---

// ---Start Interfaces home page CountDown ---
export interface SingleCountDown {
  id: number;
  title: string;
  count: number;
  image: string | null;
  status: number;
}

export interface StatsData {
  branch?: Branch;
  stats: SingleCountDown[];
}

export interface CountDownResponse {
  success: boolean;
  message: string;
  code: number;
  data: StatsData;
  errors?: Record<string, string[]>;
}
// End Interfaces home page CountDown ---

//Start Interfaces home page branch section ---
export interface Branch {
  id: number;
  name: string;
  address?: string | null;
  phone?: string[] | null;
  email?: string[] | null;
}

export interface BranchList {
  total_branches: number;
  section_title?: string | null;
  section_subtitle?: string | null;
  branches: Branch[];
  pagination: PaginationType;
}

export interface BranchApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: BranchList;
  errors?: Record<string, string[]>;
}

// Single branch interface
export interface HeaderBranchList {
  id: number;
  name: string;
  address?: string | null;
  phone?: string[] | null;
  email?: string[] | null;
}

// Main response interface
interface HeaderBranchListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    branches: HeaderBranchList[];
  };
}
//End Interfaces home page branch section ---

// Start Interfaces home page Teachers section ---
export interface Teacher {
  id: number;
  name: string;
  designation: string;
  experience: string;
  profile_image?: string | null;
  courses: string;
  branch_id: number;
}

export interface TeacherList {
  total_teachers: number;
  section_title?: string | null;
  section_subtitle?: string | null;
  teachers: Teacher[] | null;
  pagination: PaginationType;
}

export interface TeacherApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: TeacherList;
  errors?: Record<string, string[]>;
}
// End Interfaces home page Teachers section ---

// start Interfaces home page Reviews section ---
export interface Review {
  id: number;
  profile_image?: string | null;
  name: string;
  course_title: string;
  rating: number;
  feedback: string;
}

export interface ReviewList {
  total_reviews: number;
  section_title?: string | null;
  section_subtitle?: string | null;
  reviews: Review[] | null;
  pagination: PaginationType;
}

export interface ReviewApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: ReviewList;
  errors?: Record<string, string[]>;
}
// End Interfaces home page Reviews section ---

//Start Home Newsletter Subscription --
export interface getNewsletterItem {
  title: string;
  sub_title: string;
  image: string | null;
}

export interface getNewsletterItemResponse {
  success: boolean;
  message: string;
  code: number;
  data?: getNewsletterItem;
  errors?: Record<string, string[]>;
}
export interface NewsletterData {
  section_title?: string | null;
  section_subtitle?: string | null;
  id: number;
  email: string;
  subscribed_at: string;
}
export interface NewsletterApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: NewsletterData;
  errors?: Record<string, string[]>;
}
//End Home Newsletter Subscription --

//Start Home page affiliate Partner section get API --
export interface PartnerItem {
  id: number;
  title: string;
  image: string | null;
  status: number;
  partner_type: number;
}

export interface PartnersResponseData {
  section_title?: string | null;
  section_subtitle?: string | null;
  partners: {
    affiliate: PartnerItem[];
    concern: PartnerItem[];
    client: PartnerItem[];
  };
}

export interface PartnersApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: PartnersResponseData;
  errors?: Record<string, string[]>;
}

//End Home page affiliate Partner section get API --

//End Home page CompanyServiceItem section get API --
export interface ServiceItem {
  id: number;
  title: string;
  sub_title: string;
  logo_image: string;
}
export interface ServicesResponseData {
  total_services: number;
  section_title?: string | null;
  section_subtitle?: string | null;
  services: ServiceItem[];
  pagination: PaginationType;
}

export interface ServicesApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: ServicesResponseData;
  errors?: Record<string, string[]>;
}
//End Home page CompanyServiceItem section get API --

//End Home page CompanyServiceItem section get API --
export interface SuccessStoryItem {
  id: number;
  youtube_link: string;
  thumbnail_image: string;
  type: number;
  status: number;
}
export interface SuccessStoryData {
  total_video_galleries: number;
  section_title?: string | null;
  section_subtitle?: string | null;
  video_galleries: SuccessStoryItem[];
  pagination: PaginationType;
}

export interface SuccessStoryApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: SuccessStoryData;
  errors?: Record<string, string[]>;
}
//End Home page CompanyServiceItem section get API --
//start Home page News Feed  section get API --
export interface NewsFeedItem {
  id: number;
  news_link: string;
  image: string;
  entry_date: string;
}

export interface NewsFeedData {
  total_news_feeds: number;
  section_title?: string | null;
  section_subtitle?: string | null;
  news_feeds: NewsFeedItem[];
  pagination: PaginationType;
}

export interface NewsFeedApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: NewsFeedData;
  errors?: Record<string, string[]>;
}
//End Home page News Feed section get API --

//Start Home page OpportunityItem section get API --
export interface OpportunityItem {
  id: number;
  title: string;
  sub_title: string;
  image: string;
}
export interface OpportunityData {
  total_opportunities: number;
  section_title?: string | null;
  section_subtitle?: string | null;
  section_image?: string | null;
  opportunities: OpportunityItem[];
  pagination: PaginationType;
}

export interface OpportunityApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: OpportunityData;
  errors?: Record<string, string[]>;
}
//End Home page OpportunityItem section get API --

//Start Home page Blogs section get API --

export interface BlogCategory {
  id: number;
  title: string;
  slug?: string;
}

export interface Blog {
  id: number;
  category: BlogCategory;
  title: string;
  slug: string;
  author?: BlogAuthor;
  short_description?: string;
  thumbnail: string;
  published_at: string;
}

export interface BlogApiData {
  section_title?: string | null;
  section_subtitle?: string | null;
  total_blogs: number;
  blogs: Blog[] | null;
  pagination:PaginationType;
}

export interface BlogApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: BlogApiData;
}
// End Home page Blogs section get API --

// Start Home page Govt Course Section get API --
export interface GovtCourseData {
  id?: number;
  title?: string;
  sub_title?: string;
  image?: string;
}

export interface GovtCourseResponse {
  success: boolean;
  message: string;
  code: number;
  data?: GovtCourseData;
  errors?: Record<string, string[]>;
}

// End Home page Govt Course Section get API --

// Start Home page Course Search get API --
export interface HomeSearchCourse {
  id: number;
  title: string;
  slug: string;
  image: string | null;
}

export interface HomeSearchCategory {
  id: number;
  title: string;
  slug: string;
  image: string | null;
}

export interface CourseSearchResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    courses: HomeSearchCourse[];
    categories: HomeSearchCategory[];
  };
  errors?: Record<string, string[]>;
}
// End Home page Course Search get API --

// Home Hero section get API
export async function getLatestHeroSection(): Promise<HeroSectionResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/hero-section/latest`);

    if (!res.ok) {
      throw new Error(
        `Home Hero section API failed — HTTP ${res.status} (${res.statusText})`
      );
    }

    const data: HeroSectionResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Hero Section API Error:", error.message);
      throw new Error("Error fetching hero section");
    }
    throw new Error("Unknown error occurred while fetching hero section");
  }
}

// Home page CountDown get API

export async function getLatestCountDown(): Promise<CountDownResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/stats/latest`);

    if (!res.ok) {
      throw new Error(`Countdown API error: ${res.status} ${res.statusText}`);
    }

    const data: CountDownResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Latest Countdown Fetch Error:", error.message);
      throw new Error("Error fetching countdown");
    }
    throw new Error("Unknown error occurred while fetching countdown");
  }
}
// Home page Branches get API
export async function fetchAllBranches(): Promise<BranchApiResponse | null> {
  try {

    const res = await fetch(`${API_BASE}/public/branch-list`);

    if (!res.ok) {
      throw new Error(
        `fetchAllBranches API error: ${res.status} ${res.statusText}`
      );
    }

    const data: BranchApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching branches:", error.message);
      return null;
    }
    throw new Error("Unknown error occurred while fetching branches");
  }
}
// Home page Teachers get API
//Start Home page Branches get API --

export async function getHomePageAllBranches(): Promise<BranchApiResponse | null> {
  try {

    const res = await fetch(`${API_BASE}/public/our-branches`);

    if (!res.ok) {
      throw new Error(
        `fetchAllBranches API error: ${res.status} ${res.statusText}`
      );
    }

    const data: BranchApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error our branches:", error.message);
      return null;
    }
    throw new Error("Unknown error occurred while our branches");
  }
}
export async function getPublicBranchList(): Promise<HeaderBranchListResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/branch-list`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Branch List API failed — HTTP ${res.status} (${res.statusText})`
      );
    }

    const data: HeaderBranchListResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Branch List API Error:", error.message);
      throw new Error("Error fetching Branch List ");
    }
    throw new Error("Unknown error occurred while fetching Branch List");
  }
}
//End Home page Branches get API --


export async function fetchAllPublicTeachers(): Promise<TeacherApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/public/teachers-list`);

    if (!res.ok) {
      throw new Error(
        `fetchAllTeachers API error: ${res.status} ${res.statusText}`
      );
    }

    const data: TeacherApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching teachers:", error.message);
      return null;
    }
    throw new Error("Unknown error occurred while fetching teachers");
  }
}

// Home page Reviews get API
export async function fetchPublicFeaturedReviews(): Promise<ReviewApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/public/reviews-featured`);

    if (!res.ok) {
      throw new Error(
        `fetchPublicFeaturedReviews API error: ${res.status} ${res.statusText}`
      );
    }

    const data: ReviewApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching featured reviews:", error.message);
      return null;
    }
    throw new Error("Unknown error occurred while fetching featured reviews");
  }
}

// Home Newsletter Subscription
export async function SubscribeToNewsletter(
  email: string
): Promise<NewsletterApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/newsletter-subscriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data: NewsletterApiResponse = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to subscribe to newsletter.");
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Newsletter error:", error.message);
      throw new Error("Failed to subscribe to newsletter.");
    }
    throw new Error("Unknown error occurred while fetching newsletter");
  }
}

// Home page affiliate Partner section get API --
export async function fetchHomeAffiliatePartners(): Promise<PartnersApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/partners`);

    if (!res.ok) {
      throw new Error(`Partners API error: ${res.status} ${res.statusText}`);
    }

    const data: PartnersApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Partners Fetch Error:", error.message);
      throw new Error("Error fetching partners data");
    }
    throw new Error("Unknown error occurred while fetching partners data");
  }
}

// Home page Services section get API
export async function fetchPublicCompanyServices(): Promise<ServicesApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/public/company-services`);

    if (!res.ok) {
      throw new Error(
        `fetchPublicCompanyServices API error: ${res.status} ${res.statusText}`
      );
    }

    const data: ServicesApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching company services:", error.message);
      return null;
    }
    throw new Error("Unknown error occurred while fetching company services");
  }
}
// {
//         cache: "no-store",
//       }
// Home page Video Galleries section get API
export async function fetchPublicVideoGalleries(): Promise<SuccessStoryApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/public/video-galleries`);

    if (!res.ok) {
      throw new Error(
        `fetchPublicVideoGalleries API error: ${res.status} ${res.statusText}`
      );
    }

    const data: SuccessStoryApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching video galleries:", error.message);
      return null;
    }
    throw new Error("Unknown error occurred while fetching video galleries");
  }
}
// Home page News Feeds section get API
export async function fetchPublicNewsFeeds(): Promise<NewsFeedApiResponse | null> {
  try {

    const res = await fetch(`${API_BASE}/public/news-feeds`);

    if (!res.ok) {
      throw new Error(
        `fetchPublicNewsFeeds API error: ${res.status} ${res.statusText}`
      );
    }

    const data: NewsFeedApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching news feeds:", error.message);
      return null;
    }
    throw new Error("Unknown error occurred while fetching news feeds");
  }
}

// Home page opportunity section get API
export async function fetchPublicOpportunities(): Promise<OpportunityApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/public/public-opportunities`);

    if (!res.ok) {
      throw new Error(
        `fetchPublicOpportunities API error: ${res.status} ${res.statusText}`
      );
    }

    const data: OpportunityApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching opportunities:", error.message);
      return null;
    }
    throw new Error("Unknown error occurred while fetching opportunities");
  }
}
// home page featured course section get API
export async function fetchPublicHomeBlog(): Promise<BlogApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/public/blogs`);
    if (!res.ok) {
      throw new Error(
        `fetchPublicHomeBlog API error: ${res.status} ${res.statusText}`
      );
    }

    const data: BlogApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching HomeBlog:", error.message);
      return null;
    }
    throw new Error("Unknown error occurred while fetching HomeBlog");
  }
}

// Home Govt Course Section get API
export async function getPublicGovtCourseSection(): Promise<GovtCourseResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/govt-course-section`);
    if (!res.ok) {
      throw new Error(
        `Govt Course Section API failed — HTTP ${res.status} (${res.statusText})`
      );
    }

    const data: GovtCourseResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Govt Course Section API Error:", error.message);
      throw new Error("Error fetching govt course section");
    }
    throw new Error(
      "Unknown error occurred while fetching govt course section"
    );
  }
}
// Home Get Newsletter Section --
export async function getPublicNewsletterSection(): Promise<getNewsletterItemResponse> {
  try {
    const res = await fetch(`${API_BASE}/public/newsletter-section`);

    if (!res.ok) {
      throw new Error(
        `Newsletter Section API failed — HTTP ${res.status} (${res.statusText})`
      );
    }

    const data: getNewsletterItemResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Newsletter Section API Error:", error.message);
      throw new Error("Error fetching newsletter section");
    }
    throw new Error("Unknown error occurred while fetching newsletter section");
  }
}


// Home page Course Search API
export async function getPublicCourseSearch({
  params = {},
}: {
  params?: Record<string, unknown>;
}): Promise<CourseSearchResponse | null> {
  try {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    const queryString = urlParams.toString();

    const res = await fetch(`${API_BASE}/public/home-search?${queryString}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `fetchPublicCourseSearch API error: ${res.status} ${res.statusText}`
      );
    }

    const data: CourseSearchResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching course search:", error.message);
      return null;
    }
    throw new Error("Unknown error occurred while fetching course search");
  }
}
