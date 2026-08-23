import {
  BlogApiResponse,
  fetchPublicHomeBlog,
} from "@/apiServices/homePageService";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import SectionTitle from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import { cacheTag } from "next/cache";
import Link from "next/link";
import BlogCardItems from "./BlogCardItems";
import ErrorComponent from "@/components/common/ErrorComponent";
import { CACHE_TAGS } from "@/constants/cacheTags";

const CareerDevelopmentBlog = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.BLOGS);

  let blogData: BlogApiResponse | null;
  try {
    blogData = await fetchPublicHomeBlog();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching public blog:", error.message);
      return (
        <div className="text-center text-red-500">
          <ErrorComponent message={error.message} />
        </div>
      );
    }
    return (
      <div className="text-center text-red-500">
        <ErrorComponent message="An unexpected error occurred." />
      </div>
    );
  }

  const blogPosts = blogData?.data?.blogs || [];
  if (!blogData || !blogData?.data || blogPosts?.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-14">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={blogData?.data?.section_title}
          subtitle={blogData?.data?.section_subtitle}
          iswhite={false}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
          {blogPosts && blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <BlogCardItems key={post?.id} post={post} />
            ))
          ) : (
            <NotFoundComponent
              message={blogData?.message || "No Blogs Found"}
              title="Blog List"
            />
          )}
        </div>
        <div className="flex justify-center mt-8">
          <Button asChild className="cursor-pointer flex items-center gap-2">
            <Link href="/blog" prefetch={true}>
              আরও পড়ুন
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CareerDevelopmentBlog;
