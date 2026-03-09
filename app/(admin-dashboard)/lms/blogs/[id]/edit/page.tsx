import BlogsForm from "@/components/lms/blogs/BlogsForm";
import { getBlogById } from "@/apiServices/blogsService";
import { getBlogCategories } from "@/apiServices/blogCategoryService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch blog
    let blogRes;
    try {
        blogRes = await getBlogById(Number(id));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <ErrorComponent message={error.message} />;
        }
        return <ErrorComponent message="An unexpected error occurred." />;
    }

    if (!blogRes?.data) {
        return <NotFoundComponent message={blogRes?.message || "Blog not found."} />;
    }

    // Fetch categories
    let categories;
    try {
        const res = await getBlogCategories({ per_page: 500 });
        categories = res?.data?.blog_categories || [];
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching categories: ${error.message}`} />
                </div>
            );
        } else {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message="An unknown error occurred while fetching categories." />
                </div>
            );
        }
    }

    return (
        <BlogsForm
            title="Edit Blog"
            blog={blogRes?.data}
            categories={categories}
        />
    );
}
