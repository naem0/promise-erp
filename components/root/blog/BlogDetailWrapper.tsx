import { getPublicBlogBySlug } from "@/apiServices/blogWebService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Facebook,
  Linkedin,
  SquareArrowOutUpRight,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BlogShareButton from "./BlogShareButton";
import LikeToggleButton from "./LikeToggleButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface BlogDetailWrapperProps {
  slug: string;
}
const BlogDetailWrapper = async ({ slug }: BlogDetailWrapperProps) => {
  let blogDetails;
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  try {
    blogDetails = await getPublicBlogBySlug(slug);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return (
        <div className=" container mx-auto px-4 py-16 space-y-16 flex items-center justify-center h-full">
          <ErrorComponent message={error.message} />
        </div>
      );
    }
    return (
      <div className=" container mx-auto px-4 py-16 space-y-16 flex items-center justify-center h-full">
        <ErrorComponent
          message={"Unknown error occurred while fetching blog details."}
        />
      </div>
    );
  }

  const blogData = blogDetails?.data || {};
  if (!blogData.id) {
    return (
      <div className=" container mx-auto px-4 py-16 space-y-16 flex items-center justify-center h-full">
        <NotFoundComponent message={blogDetails?.message} />
      </div>
    );
  }

  return (
    <section className="py-8 md:py-14 px-4">
      <div className="container mx-auto">
        <div className="md:pb-8 pb-6">
          <Link
            href="/blog"
            className="flex items-center gap-1 text-base font-medium ease-in-out mb-2"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="text-2xl lg:text-5xl text-secondary capitalize font-bold">
            {blogData.title}
          </h1>
        </div>
        <div className="w-full px-6 py-2 flex md:flex-row flex-col gap-4 md:items-start items-center justify-between mb-4">
          {/* Left Section */}
          <div className="flex  items-center gap-4">
            <div className="relative w-14 h-14 border-2 border-primary rounded-full">
              <Image
                src={blogData?.author?.image || "/images/placeholder_img.jpg"}
                alt={blogData?.author?.name || "Author Image"}
                fill
                className="rounded-full object-scale-down"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-secondary">
                {blogData?.author?.name}
              </h2>
              <p className="text-sm text-primary">
                {blogData?.author?.designation || "--------"}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex  items-center md:gap-3 gap-1">
            <Button size="icon" className="bg-blue-600 border-0" asChild>
              <Link
                href="https://www.facebook.com/elaeltd.official"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-white" />
              </Link>
            </Button>

            <Button size="icon" className="bg-red-600 border-0" asChild>
              <Link
                href="https://www.youtube.com/@elaeltd.official"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 text-white" />
              </Link>
            </Button>

            <Button size="icon" className="bg-black border-0" asChild>
              <Link
                href="https://www.linkedin.com/company/e-learning-and-earning-ltd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-white" />
              </Link>
            </Button>
            <BlogShareButton slug={blogData?.slug} />
          </div>
        </div>

        <div className="pb-9">
          <Image
            src={blogData.thumbnail || "/images/placeholder_img.jpg"}
            alt={blogData.title}
            width={1536}
            height={630}
            className="rounded-lg object-fill w-full h-full"
          />
        </div>
        <div className="">
          <div dangerouslySetInnerHTML={{ __html: blogData.description }} />
        </div>
        <div className="pt-4">
          <h4 className="text-secondary text-lg md:text-2xl font-bold flex items-center gap-2">
            <SquareArrowOutUpRight className="w-4 h-4 inline mr-2" />
            নিয়মিত নিউজ পেতে আমাদের ওয়েব সাইট ভিজিট করুন।
          </h4>
        </div>
        {token && (
          <div className="mt-4">
            <LikeToggleButton blogId={blogData?.id} />
          </div>
        )}

        <div className="mt-4 flex flex-wrap">
          {blogData?.meta_keywords?.length > 0 &&
            blogData.meta_keywords.map((keyword: string, index: number) => (
              <span
                key={index}
                className="text-base text-secondary mr-2 mb-2 font-semibold border border-secondary rounded-full px-4 py-0 capitalize"
              >
                # {keyword}
              </span>
            ))}
        </div>
      </div>
    </section>
  );
};

export default BlogDetailWrapper;
