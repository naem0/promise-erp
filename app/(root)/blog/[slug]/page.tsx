import BlogDetailWrapper from "@/components/root/blog/BlogDetailWrapper";
import { Suspense } from "react";

interface BlogDetailsPageProps {
  params: Promise<{ slug: string }>;
}

const BlogDetailsPage = async ({ params }: BlogDetailsPageProps) => {
  const { slug } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 space-y-16">
        <h1 className="text-2xl text-center">Loading...</h1>
      </div>
    </div>}>
      <BlogDetailWrapper slug={slug} />
    </Suspense>
  );
};

export default BlogDetailsPage;
