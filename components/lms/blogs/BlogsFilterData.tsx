import { getBlogCategories } from "@/apiServices/blogCategoryService";
import BlogsFilter from "./BlogsFilter";
import ErrorComponent from "@/components/common/ErrorComponent";

export default async function BlogsFilterData() {
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

    return <BlogsFilter categories={categories} />;
}
