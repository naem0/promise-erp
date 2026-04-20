import BlogCategorySidebar from "@/components/root/blog/BlogCategorySidebar";
import BloggCategoryWrapperBanner from "@/components/root/blog/BloggCategoryWrapperBanner";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import BlogCategoryPostWrapper from "@/components/root/blog/BlogCategoryPostWrapper";
import BlogSidebarSkeleton from "@/components/root/blog/BlogSidebarSkeleton";
import CommonHeroBannerSkeleton from "@/components/common/web-common/CommonHeroBannerSkeleton";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/***** Dynamic Metadata *****/
export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;

  const canonicalUrl = `/blog/category/${slug}`;

  return {
    title: `${slug} - Promise Lms`,
    description: `Explore ${slug} related articles and insights on Promise Lms.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/***** Page Component *****/
export default async function BlogCategoryPage({
  params,
  searchParams,
}: BlogPageProps) {
  const { slug } = await params;

  if (!slug) {
    redirect("/blog");
  }

  return (
    <>
      <Suspense fallback={<CommonHeroBannerSkeleton />}>
        <BloggCategoryWrapperBanner />
      </Suspense>

      <section>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-24">
                <Suspense fallback={<BlogSidebarSkeleton />}>
                  <BlogCategorySidebar />
                </Suspense>
              </div>
            </aside>

            <Suspense
              fallback={
                <div className="lg:col-span-8 xl:col-span-9 flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <BlogCategoryPostWrapper
                slug={slug}
                searchParams={searchParams}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
