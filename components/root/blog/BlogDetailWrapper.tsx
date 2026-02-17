import { getPublicBlogBySlug } from "@/apiServices/blogWebService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";
import { BackpackIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogDetailWrapperProps {
  slug: string;
}
const BlogDetailWrapper = async ({ slug }: BlogDetailWrapperProps) => {
  let blogDetails;
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

  console.log(blogDetails);
  return (
    <section className="py-8 md:py-14 px-4">
      <div className="container mx-auto">
        <div className="pb-9">
          <Link
            href="/blog"
            className="flex items-center gap-1 text-base font-medium ease-in-out mb-2"
          >
            <BackpackIcon className="h-4 w-4" /> Back to Blog
          </Link>
          <h1 className="text-2xl lg:text-5xl text-secondary capitalize font-bold">
            {blogData.title}
          </h1>
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
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blogData.description }}
        />
      </div>
    </section>
  );
};

export default BlogDetailWrapper;
