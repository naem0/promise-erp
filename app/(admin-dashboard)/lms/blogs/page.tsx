import BlogsData from "@/components/lms/blogs/BlogsData";
import BlogsFilterData from "@/components/lms/blogs/BlogsFilterData";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
export default function BlogsPage({ searchParams }: PageProps) {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          Blogs
        </h1>

        <Button asChild className="bg-green-600">
          <Link href="/lms/blogs/add">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Blog
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <BlogsFilterData />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
        <BlogsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
