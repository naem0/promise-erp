import { getPublicBlogsByCategorySlug } from "@/apiServices/blogWebService";
import BlogFeaturedPost from "./BlogFeaturedPost";
import BlogPostCard from "./BlogPostCard";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import Pagination from "@/components/common/Pagination";

interface BlogCategoryPostWrapperProps {
  slug: string;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const BlogCategoryPostWrapper = async ({
  slug,
  searchParams,
}: BlogCategoryPostWrapperProps) => {
  const queryParams = await searchParams;
  const params = {
    per_page: queryParams.per_page ? Number(queryParams.per_page) : 16,
    page: queryParams.page ? Number(queryParams.page) : 1,
  };

  let blogInfo;

  try {
    if (slug) {
      blogInfo = await getPublicBlogsByCategorySlug({
        slug,
        params,
      });
    }
  } catch (error: unknown) {
    return (
      <div className="xl:col-span-9 w-full flex items-center justify-center h-full">
        <ErrorComponent
          message={
            error instanceof Error
              ? error.message
              : "An unexpected error occurred."
          }
        />
      </div>
    );
  }

  const blogInfoData = blogInfo?.data?.blogs || [];
  const pagination = blogInfo?.data?.pagination ?? null;

  if (blogInfoData.length === 0) {
    return (
      <div className="xl:col-span-9 w-full flex items-center justify-center h-full">
        <NotFoundComponent message={blogInfo?.message || " No blogs found."} />
      </div>
    );
  }

  if (!blogInfo || !blogInfo?.success || !blogInfo?.data) {
    return null;
  }

  return (
    <div className="xl:col-span-9 w-full space-y-8">
      <BlogFeaturedPost blogInfoData={blogInfoData} />
      <BlogPostCard blogInfoData={blogInfoData} />

      {pagination && <Pagination pagination={pagination} />}
    </div>
  );
};

export default BlogCategoryPostWrapper;
