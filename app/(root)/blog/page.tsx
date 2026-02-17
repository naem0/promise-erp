import BlogCategorySidebar from "@/components/root/blog/BlogCategorySidebar";
import BloggWrapperBanner from "@/components/root/blog/BloggWrapperBanner";
import BlogPostWrapper from "@/components/root/blog/BlogPostWrapper";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Metadata } from "next";

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**** Dynamic Metadata ******/

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {

  const params = await searchParams;
  const page = params.page;

  let canonicalUrl = "/blog";

  if (page && page !== "1") {
    canonicalUrl = `/blog?page=${page}`;
  }
  return {
    title: `Blog - Promise ERP ${page && page !== "1" ? ` - Page ${page}` : ""}`,
    description:`Explore our latest articles, insights, and updates on Promise ERP and business management solutions. ${page && page !== "1" ? ` - Page ${page}` : ""}`,

    alternates: {
      canonical: canonicalUrl,
    },


    openGraph: {
      title: "Blog - Promise ERP",
      description:
        "Explore our latest articles, insights, and updates on Promise ERP and business management solutions.",
      url: canonicalUrl,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/images/home/hero-banner.png",
          width: 1200,
          height: 630,
          alt: "Promise ERP Blog",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Blog - Promise ERP",
      description:
        "Explore our latest articles, insights, and updates on Promise ERP and business management solutions.",
      images: ["/images/home/hero-banner.png"],
    },
  };
}
const BlogPage = ({ searchParams }: BlogPageProps) => {

  return (
    <>
      <BloggWrapperBanner />
      <section className="">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-24">
                <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                  <BlogCategorySidebar />
                </Suspense>
              </div>
            </aside>

            {/* Main Content */}
            <Suspense fallback={<div className="lg:col-span-8 xl:col-span-9 flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <BlogPostWrapper searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;
