import { getPublicBlogInfo } from "@/apiServices/blogWebService";
import BlogFeaturedPost from "./BlogFeaturedPost";
import BlogPostCard from "./BlogPostCard";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import Pagination from "@/components/common/Pagination";

interface BlogPagePropsParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const BlogPostWrapper = async ({ searchParams }: BlogPagePropsParams) => {

  const queryParams = await searchParams;
  const params = {
    search: typeof queryParams.search === "string" ? queryParams.search : "",
    blog_category_id: queryParams.blog_category_id
      ? Number(queryParams.blog_category_id)
      : undefined,
    per_page: queryParams.per_page ? Number(queryParams.per_page) : 16,
    page: queryParams.page ? Number(queryParams.page) : 1,
  };
  let blogInfo;
  try {
    blogInfo = await getPublicBlogInfo({ params });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className="lg:col-span-8 xl:col-span-9 flex items-center justify-center h-full">
          <ErrorComponent message={error.message} />
        </div>
      );
    } else {
      return (
        <div className="lg:col-span-8 xl:col-span-9 flex items-center justify-center h-full">
          <ErrorComponent message="An unexpected error occurred." />
        </div>
      );
    }
  }
  const blogInfoData = blogInfo?.data?.blogs || [];
  const pagination = blogInfo?.data?.pagination ?? null;
  if (blogInfoData?.length === 0) {
    return (
      <div className="lg:col-span-8 xl:col-span-9 flex items-center justify-center h-full">
        <NotFoundComponent message={blogInfo?.message ?? "No data found"} />
      </div>
    );
  }
  if (!blogInfo || !blogInfo?.success || !blogInfo?.data) {
    return null;
  }
  return (
    <div className="lg:col-span-8 xl:col-span-9 space-y-8">
      {/* Featured Posts Section */}
      <BlogFeaturedPost blogInfoData={blogInfoData} />
      {/* Recent Posts Section */}
      <BlogPostCard blogInfoData={blogInfoData} />
      {pagination && (
        <div className="">
          <Pagination pagination={pagination} />
        </div>
      )}
    </div>

  );
};

export default BlogPostWrapper;
